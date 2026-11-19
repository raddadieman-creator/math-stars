import 'server-only';
import { supabaseAdmin } from './supabase/admin';
import { isCorrect } from './grading';
import type { PublicQuestion, Question } from './types';
import { COGNITIVE_AR } from './types';
import { awardNewBadges } from './badge-service';

export const MIX_SIZE = 8;

export async function listModels(studentId: string) {
  const db = supabaseAdmin();
  const [{ data: models }, { data: attempts }] = await Promise.all([
    db.from('assessments').select('id, title, form_label, description, domain_code, sort_order, assessment_items(count)').eq('kind', 'model').eq('is_open', true).order('sort_order'),
    db.from('assessment_attempts').select('assessment_id, score, max_score').eq('student_id', studentId).not('submitted_at', 'is', null),
  ]);
  return (models ?? []).map((m) => {
    const mine = (attempts ?? []).filter((a) => a.assessment_id === m.id && a.max_score);
    const best = mine.length ? Math.max(...mine.map((a) => Math.round(((a.score ?? 0) / a.max_score!) * 100))) : null;
    const count = m.form_label === 'mix' ? MIX_SIZE : ((m.assessment_items as unknown as { count: number }[])[0]?.count ?? 0);
    return { id: m.id as string, title: m.title as string, key: m.form_label as string, group: (m.form_label as string).startsWith('bk-') ? 'booklet' : (m.form_label as string).startsWith('ch-') ? 'challenge' : 'timss', domain: (m.domain_code as string | null) ?? null, count, best, tries: mine.length };
  });
}

/** أسئلة النموذج دون الإجابات. النموذج الشامل يختار أسئلة عشوائية من بنك المكتبة في كل محاولة */
export async function loadModel(assessmentId: string, measure = false, studentId?: string) {
  const db = supabaseAdmin();
  const { data: a } = await db.from('assessments').select('id, title, form_label, kind, is_open, source_label, source_url').eq('id', assessmentId).single();
  if (!a || !a.is_open || (measure ? !['pre', 'post'].includes(a.kind) : a.kind !== 'model')) return null;
  let qs: Question[];
  if (a.form_label === 'mix') {
    const { data } = await db.from('questions').select('*').eq('bank', 'library').eq('status', 'published');
    qs = ((data ?? []) as Question[]).sort(() => Math.random() - 0.5).slice(0, MIX_SIZE);
  } else if ((a.form_label as string).startsWith('ch-')) {
    qs = await challengeItems(db, a.form_label as string, studentId);
  } else {
    const { data } = await db.from('assessment_items').select('position, questions(*)').eq('assessment_id', a.id).order('position');
    qs = (data ?? []).map((r) => r.questions as unknown as Question).filter((q) => q && (q as unknown as { status: string }).status === 'published');
  }
  const items = qs.map((q) => ({ id: q.id, qtype: q.qtype, prompt: q.prompt, media_url: q.media_url, options: q.options, difficulty: q.difficulty, cognitive: COGNITIVE_AR[q.cognitive], hint: measure ? null : q.hint ?? q.solution_steps?.[0] ?? null }));
  return { id: a.id as string, title: a.title as string, source: (a.source_label as string | null) ?? null, sourceUrl: (a.source_url as string | null) ?? null, items: items as (PublicQuestion & { cognitive: string })[] };
}

export async function submitModel(studentId: string, assessmentId: string, answers: Record<string, unknown>) {
  const db = supabaseAdmin();
  const { data: a } = await db.from('assessments').select('id, form_label, kind, is_open').eq('id', assessmentId).single();
  if (!a || !['model', 'pre', 'post'].includes(a.kind) || !a.is_open) throw new Error('النموذج غير متاح');
  if (a.kind !== 'model') { // القياس: محاولة واحدة فقط
    const { data: prev } = await db.from('assessment_attempts').select('id').eq('assessment_id', a.id).eq('student_id', studentId).not('submitted_at', 'is', null).limit(1);
    if (prev?.length) throw new Error('أُنجز هذا القياس من قبل');
  }
  const ids = Object.keys(answers ?? {});
  if (!ids.length || ids.length > 40) throw new Error('لا توجد إجابات صالحة');
  let allowed: Set<string>;
  if (a.form_label === 'mix' || (a.form_label as string).startsWith('ch-')) {
    if (ids.length > CH_SIZE) throw new Error('عدد الأسئلة غير صحيح');
    const { data } = await db.from('questions').select('id').in('bank', a.form_label === 'mix' ? ['library'] : ['library', 'practice']).eq('status', 'published').in('id', ids);
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
  const newBadges = await awardNewBadges(studentId);
  return { score, total: review.length, byCog, review, newBadges };
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

/** تغذية راجعة فورية لسؤال واحد في نماذج التدريب (لا تُسجَّل؛ التسجيل عند تسليم النموذج) */
export async function checkModelItem(studentId: string, assessmentId: string, questionId: string, answer: unknown) {
  void studentId;
  const db = supabaseAdmin();
  const { data: a } = await db.from('assessments').select('id, form_label, kind, is_open').eq('id', assessmentId).single();
  if (!a || a.kind !== 'model' || !a.is_open) throw new Error('النموذج غير متاح');
  if (a.form_label !== 'mix') {
    const { data: link } = await db.from('assessment_items').select('question_id').eq('assessment_id', a.id).eq('question_id', questionId).maybeSingle();
    if (!link) throw new Error('السؤال غير متاح');
  }
  const { data: qd } = await db.from('questions').select('*').eq('id', questionId).eq('status', 'published').single();
  if (!qd) throw new Error('السؤال غير متاح');
  const q = qd as Question;
  const correctText = q.qtype === 'mcq' || q.qtype === 'image_mcq'
    ? q.options.find((o) => o.id === q.correct_answer.value)?.text ?? ''
    : q.qtype === 'true_false' ? (q.correct_answer.value ? 'صواب' : 'خطأ') : String(q.correct_answer.value);
  return { ok: isCorrect(q, answer), correct: q.correct_answer.value, correctText, steps: q.solution_steps ?? [], hint: q.hint ?? q.solution_steps?.[0] ?? null };
}

/** حالة القياس القبلي والبعدي للطالب */
export async function measureStatus(studentId: string) {
  const db = supabaseAdmin();
  const { data: as } = await db.from('assessments').select('id, kind, is_open, assessment_items(count)').in('kind', ['pre', 'post']).order('created_at');
  const { data: att } = await db.from('assessment_attempts').select('assessment_id, score, max_score, submitted_at').eq('student_id', studentId).not('submitted_at', 'is', null);
  const pick = (k: string) => { const a = (as ?? []).find((x) => x.kind === k); if (!a) return null;
    const t = (att ?? []).find((x) => x.assessment_id === a.id);
    return { id: a.id as string, open: a.is_open as boolean, count: (a.assessment_items as unknown as { count: number }[])[0]?.count ?? 0, done: t ? { score: t.score as number, max: t.max_score as number, at: t.submitted_at as string } : null }; };
  return { pre: pick('pre'), post: pick('post') };
}

// ---------------- التحديات: أسئلة البنك كله تتكرر بصيغ مختلفة ----------------
export const CH_SIZE = 10;
function seeded(seed: number) { return () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }; }
async function challengeItems(db: ReturnType<typeof supabaseAdmin>, label: string, studentId?: string): Promise<Question[]> {
  const pool = async () => ((await db.from('questions').select('*').in('bank', ['practice', 'library']).eq('status', 'published').eq('qtype', 'mcq')).data ?? []) as Question[];
  if (label === 'ch-daily') { // تحدي اليوم: عشرة أسئلة ثابتة للجميع تتجدد كل يوم (بتوقيت الرياض)
    const day = new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10);
    const rnd = seeded([...day].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 2147483647, 7));
    return (await pool()).sort((x, y) => x.id.localeCompare(y.id)).map((q) => [rnd(), q] as const).sort((x, y) => x[0] - y[0]).slice(0, CH_SIZE).map((x) => x[1]);
  }
  if (label === 'ch-mistakes' && studentId) { // تحدي الأخطاء: أسئلة سبق الخطأ فيها
    const { data } = await db.from('attempts').select('question_id').eq('student_id', studentId).eq('is_correct', false).order('created_at', { ascending: false }).limit(200);
    const ids = [...new Set((data ?? []).map((r) => r.question_id as string))].slice(0, 40);
    if (!ids.length) return [];
    const { data: qs } = await db.from('questions').select('*').in('id', ids).eq('status', 'published');
    return ((qs ?? []) as Question[]).sort(() => Math.random() - 0.5).slice(0, CH_SIZE);
  }
  return (await pool()).sort(() => Math.random() - 0.5).slice(0, CH_SIZE); // تحدي السرعة
}

/** ملخص تحديات الطالب: معرّفات التحديات وما أنجزه اليوم */
export async function challengesOverview(studentId: string) {
  const db = supabaseAdmin();
  const { data: as } = await db.from('assessments').select('id, form_label, title, description').like('form_label', 'ch-%').eq('is_open', true).order('sort_order');
  const { data: att } = await db.from('assessment_attempts').select('assessment_id, score, max_score, submitted_at').eq('student_id', studentId).not('submitted_at', 'is', null).in('assessment_id', (as ?? []).map((a) => a.id));
  const today = new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10);
  return (as ?? []).map((a) => { const mine = (att ?? []).filter((x) => x.assessment_id === a.id);
    return { id: a.id as string, label: a.form_label as string, title: a.title as string, desc: (a.description as string | null) ?? '', tries: mine.length,
      best: mine.length ? Math.max(...mine.map((x) => Math.round(((x.score ?? 0) / Math.max(1, x.max_score ?? 1)) * 100))) : null,
      doneToday: mine.some((x) => new Date(new Date(x.submitted_at as string).getTime() + 3 * 3600e3).toISOString().slice(0, 10) === today) }; });
}

/** لوحة التميز: ترتيب طلاب الفصل في الشهر الهجري الحالي بالنجوم، مع عدد الأوسمة (بالاسم المختصر فقط) */
export async function honorBoard(classId: string) {
  const db = supabaseAdmin();
  const { data: st } = await db.from('students').select('id, nickname, full_name').eq('class_id', classId).eq('is_active', true);
  const ids = (st ?? []).map((s) => s.id);
  if (!ids.length) return [];
  const since = new Date(Date.now() - 31 * 864e5).toISOString();
  const [{ data: stars }, { data: badges }] = await Promise.all([
    db.from('star_ledger').select('student_id, amount, created_at').in('student_id', ids).gte('created_at', since),
    db.from('student_badges').select('student_id, period').in('student_id', ids),
  ]);
  return (st ?? []).map((s) => ({
    id: s.id as string, name: (s.nickname as string) || (s.full_name as string).split(' ')[0],
    stars: (stars ?? []).filter((x) => x.student_id === s.id).reduce((t, x) => t + (x.amount as number), 0),
    badges: (badges ?? []).filter((x) => x.student_id === s.id && !x.period).length,
    monthly: (badges ?? []).filter((x) => x.student_id === s.id && x.period).length,
  })).sort((a, b) => b.stars - a.stars || b.badges - a.badges).slice(0, 15);
}
