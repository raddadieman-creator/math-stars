import 'server-only';
import { supabaseAdmin } from './supabase/admin';
import { isCorrect } from './grading';
import type { PublicQuestion, Question } from './types';
import { COGNITIVE_AR } from './types';

export const MIX_SIZE = 8;

export async function listModels(studentId: string) {
  const db = supabaseAdmin();
  const [{ data: models }, { data: attempts }] = await Promise.all([
    db.from('assessments').select('id, title, form_label, description, sort_order, assessment_items(count)').eq('kind', 'model').eq('is_open', true).order('sort_order'),
    db.from('assessment_attempts').select('assessment_id, score, max_score').eq('student_id', studentId).not('submitted_at', 'is', null),
  ]);
  return (models ?? []).map((m) => {
    const mine = (attempts ?? []).filter((a) => a.assessment_id === m.id && a.max_score);
    const best = mine.length ? Math.max(...mine.map((a) => Math.round(((a.score ?? 0) / a.max_score!) * 100))) : null;
    const count = m.form_label === 'mix' ? MIX_SIZE : ((m.assessment_items as unknown as { count: number }[])[0]?.count ?? 0);
    return { id: m.id as string, title: m.title as string, key: m.form_label as string, count, best, tries: mine.length };
  });
}

/** أسئلة النموذج دون الإجابات. النموذج الشامل يختار أسئلة عشوائية من بنك المكتبة في كل محاولة */
export async function loadModel(assessmentId: string) {
  const db = supabaseAdmin();
  const { data: a } = await db.from('assessments').select('id, title, form_label, kind, is_open, source_label, source_url').eq('id', assessmentId).single();
  if (!a || a.kind !== 'model' || !a.is_open) return null;
  let qs: Question[];
  if (a.form_label === 'mix') {
    const { data } = await db.from('questions').select('*').eq('bank', 'library').eq('status', 'published');
    qs = ((data ?? []) as Question[]).sort(() => Math.random() - 0.5).slice(0, MIX_SIZE);
  } else {
    const { data } = await db.from('assessment_items').select('position, questions(*)').eq('assessment_id', a.id).order('position');
    qs = (data ?? []).map((r) => r.questions as unknown as Question).filter((q) => q && (q as unknown as { status: string }).status === 'published');
  }
  const items = qs.map((q) => ({ id: q.id, qtype: q.qtype, prompt: q.prompt, media_url: q.media_url, options: q.options, difficulty: q.difficulty, cognitive: COGNITIVE_AR[q.cognitive] }));
  return { id: a.id as string, title: a.title as string, source: (a.source_label as string | null) ?? null, sourceUrl: (a.source_url as string | null) ?? null, items: items as (PublicQuestion & { cognitive: string })[] };
}

export async function submitModel(studentId: string, assessmentId: string, answers: Record<string, unknown>) {
  const db = supabaseAdmin();
  const { data: a } = await db.from('assessments').select('id, form_label, kind, is_open').eq('id', assessmentId).single();
  if (!a || a.kind !== 'model' || !a.is_open) throw new Error('النموذج غير متاح');
  const ids = Object.keys(answers ?? {});
  if (!ids.length || ids.length > 40) throw new Error('لا توجد إجابات صالحة');
  let allowed: Set<string>;
  if (a.form_label === 'mix') {
    if (ids.length > MIX_SIZE) throw new Error('عدد الأسئلة غير صحيح');
    const { data } = await db.from('questions').select('id').eq('bank', 'library').eq('status', 'published').in('id', ids);
    allowed = new Set((data ?? []).map((r) => r.id));
  } else {
    const { data } = await db.from('assessment_items').select('question_id').eq('assessment_id', a.id);
    allowed = new Set((data ?? []).map((r) => r.question_id));
  }
  const { data: qs } = await db.from('questions').select('*').in('id', ids.filter((i) => allowed.has(i)));
  const list = (qs ?? []) as Question[];
  if (!list.length) throw new Error('لا توجد إجابات صالحة');

  const byCog: Record<string, [number, number]> = {};
  const review = list.map((q) => {
    const ans = answers[q.id];
    const answered = ans !== undefined && ans !== null && ans !== '';
    const ok = answered && isCorrect(q, ans);
    const key = COGNITIVE_AR[q.cognitive];
    byCog[key] ??= [0, 0];
    byCog[key][1] += 1;
    if (ok) byCog[key][0] += 1;
    const correctText = q.qtype === 'mcq' || q.qtype === 'image_mcq'
      ? q.options.find((o) => o.id === q.correct_answer.value)?.text ?? ''
      : q.qtype === 'true_false' ? (q.correct_answer.value ? 'صواب' : 'خطأ') : String(q.correct_answer.value);
    return { id: q.id, ok, answer: ans ?? null, correctText, steps: q.solution_steps ?? [], intlPct: (q as unknown as { international_pct: number | null }).international_pct ?? null };
  });
  const score = review.filter((r) => r.ok).length;
  const { data: att, error } = await db.from('assessment_attempts').insert({
    assessment_id: a.id, student_id: studentId, submitted_at: new Date().toISOString(), score, max_score: review.length, by_cognitive: byCog,
  }).select('id').single();
  if (error) throw error;
  await db.from('assessment_responses').insert(review.map((r) => ({ attempt_id: att.id, question_id: r.id, answer: { value: r.answer }, is_correct: r.ok })));
  return { score, total: review.length, byCog, review };
}

/** ملفات المكتبة الظاهرة للطلاب: الرسمية أولًا ثم ملفات المعلم، مع روابط موقعة مؤقتة للملفات المرفوعة */
export async function listFiles() {
  const db = supabaseAdmin();
  const { data } = await db.from('library_files').select('id, title, publisher, language, storage_path, external_url, is_official, sort_order').eq('is_visible', true).order('is_official', { ascending: false }).order('sort_order');
  const out = [] as { id: string; title: string; publisher: string | null; language: string; url: string; official: boolean }[];
  for (const f of data ?? []) {
    let url = f.external_url as string | null;
    if (!url && f.storage_path) url = (await db.storage.from('content').createSignedUrl(f.storage_path, 3600)).data?.signedUrl ?? null;
    if (url) out.push({ id: f.id, title: f.title, publisher: f.publisher, language: f.language, url, official: f.is_official });
  }
  return out;
}
