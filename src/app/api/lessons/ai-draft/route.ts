import { NextResponse, type NextRequest } from 'next/server';
import { requireStaff } from '@/lib/data';
import { sanitizeScenario } from '@/lib/scenario';
import { err } from '@/lib/api';

export const maxDuration = 60;

const PROMPT = `أنت مصمم تعليمي لمادة الرياضيات لطالبات الصف الثاني المتوسط (الصف الثامن) في المملكة العربية السعودية.
اقرأ صفحة الكتاب المرفقة (أو نصها)، واستخرج المفهوم الرياضي وأمثلته كما وردت، دون إضافة معلومات غير موجودة في الصفحة.
ثم أعد سيناريو درس مرئي قصير (5 إلى 9 مشاهد) بالعربية الفصحى الواضحة، مناسبًا لعمر 13–14 سنة، دون أسلوب طفولي.

أعد JSON فقط بهذا الشكل:
{"summary": "ملخص المفهوم في جملتين",
 "scenes": [ { "template": "...", "title": "...", "caption": "نص التعليق (جملة أو جملتان)", "duration": 8, "data": {...} } ]}

القوالب المسموح بها وبيانات كل منها:
- "title": {"subtitle": "..."}
- "cycle": {"stages": ["...", "..."]}  (2–8 مراحل قصيرة)
- "steps": {"steps": ["...", "..."]}   (1–8 خطوات)
- "number_line": {"start": عدد صحيح, "moves": [أعداد صحيحة موجبة أو سالبة]}
- "balance": {"left": "2س + 3", "right": "11", "steps": [{"left": "2س", "right": "8", "note": "نطرح 3 من الطرفين"}]}
- "percent_grid": {"percent": 0-100, "label": "..."}
- "question": {"prompt": "...", "options": ["...", "..."], "correct": رقم الخيار الصحيح بدءًا من 0, "explain": "..."}
ابدأ بمشهد title، واجعل مشهد question واحدًا على الأقل في المنتصف أو النهاية. تحقق من صحة كل عملية حسابية.`;

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return err('الاقتراح الآلي غير مفعّل', 400);
  const { sb } = await requireStaff();
  const { lessonId } = await req.json().catch(() => ({}));
  const { data: l } = await sb.from('lessons').select('source_file_path, extracted_text').eq('id', String(lessonId)).single();
  if (!l) return err('الدرس غير موجود', 404);

  const parts: object[] = [{ text: PROMPT }];
  if (l.source_file_path) {
    const { data: file, error } = await sb.storage.from('content').download(l.source_file_path);
    if (error || !file) return err('تعذر قراءة ملف الصفحة');
    if (file.size > 15_000_000) return err('الملف كبير جدًا للاقتراح الآلي');
    const mime = file.type || (l.source_file_path.endsWith('.pdf') ? 'application/pdf' : 'image/png');
    parts.push({ inline_data: { mime_type: mime, data: Buffer.from(await file.arrayBuffer()).toString('base64') } });
  }
  if (l.extracted_text) parts.push({ text: `النص المستخرج من الصفحة بعد مراجعة المعلمة:\n${l.extracted_text}` });

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { responseMimeType: 'application/json', temperature: 0.4 } }),
  });
  if (r.status === 429) return err('تجاوز حد الاستخدام المجاني مؤقتًا. حاولي بعد قليل، أو أعدّي المشاهد يدويًا.', 429);
  if (!r.ok) return err(`تعذر الاتصال بخدمة الذكاء الاصطناعي (${r.status})`, 502);
  const j = await r.json();
  const text: string = j?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '';
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return err('وصلت استجابة غير صالحة. أعيدي المحاولة.', 502); }
  const { scenario, dropped } = sanitizeScenario(raw);
  if (!scenario.scenes.length) return err('لم تتضمن الاستجابة مشاهد صالحة. أعيدي المحاولة أو أعدّي المشاهد يدويًا.', 502);
  return NextResponse.json({ scenario, dropped, summary: typeof (raw as { summary?: unknown }).summary === 'string' ? (raw as { summary: string }).summary : '' });
}
