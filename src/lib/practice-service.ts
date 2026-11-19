import 'server-only';
import { supabaseAdmin } from './supabase/admin';
import { isCorrect, classifyError } from './grading';
import { decideFeedback, praiseMessage, retryMessage } from './feedback';
import { updateMastery, INITIAL_MASTERY, DEFAULT_RULES } from './adaptive';
import { starsForOutcome, rewardsForMasteryChange, isPersonalImprovement, DEFAULT_REWARDS } from './rewards';
import { awardNewBadges } from './badge-service';
import type { AdaptiveRules, MasteryState, Outcome, PublicQuestion, Question, RewardRules } from './types';

type DB = ReturnType<typeof supabaseAdmin>;

async function rules(db: DB): Promise<{ a: AdaptiveRules; r: RewardRules }> {
  const [{ data: a }, { data: r }] = await Promise.all([
    db.from('adaptive_rules').select('*').eq('id', 1).single(),
    db.from('reward_rules').select('*').eq('id', 1).single(),
  ]);
  return { a: (a as AdaptiveRules) ?? DEFAULT_RULES, r: (r as RewardRules) ?? DEFAULT_REWARDS };
}

async function getMastery(db: DB, studentId: string, skillId: string): Promise<MasteryState> {
  const { data } = await db.from('skill_mastery').select('*').eq('student_id', studentId).eq('skill_id', skillId).maybeSingle();
  return data ? (data as MasteryState) : { ...INITIAL_MASTERY };
}

async function ownSession(db: DB, studentId: string, sessionId: string) {
  const { data } = await db.from('practice_sessions').select('*').eq('id', sessionId).eq('student_id', studentId).single();
  if (!data) throw new Error('الجلسة غير موجودة');
  if (data.ended_at) throw new Error('انتهت الجلسة');
  return data as { id: string; skill_id: string; mode: string; student_id: string };
}

export async function startSession(studentId: string, skillId: string, mode: 'practice' | 'game' = 'practice', gameKey?: string) {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('practice_sessions')
    .insert({ student_id: studentId, skill_id: skillId, mode, game_key: gameKey ?? null })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

function toPublic(q: Question): PublicQuestion {
  // خلط الخيارات في كل عرض لتقليل حفظ مواقع الإجابات
  const options = [...(q.options ?? [])].sort(() => Math.random() - 0.5);
  return { id: q.id, qtype: q.qtype, prompt: q.prompt, media_url: q.media_url, options, difficulty: q.difficulty, hint: q.hint ?? q.solution_steps?.[0] ?? null };
}

/**
 * اختيار السؤال التالي:
 * - من المهارة نفسها وبمستوى الصعوبة الحالي للطالب
 * - لم يظهر في هذه الجلسة، مع تفضيل ما لم تره مؤخرًا
 * - عند طلب "سؤال مشابه" يُفضَّل المستوى نفسه للسؤال الذي كُشف حله
 */
export async function nextQuestion(studentId: string, sessionId: string, similarTo?: string) {
  const db = supabaseAdmin();
  const session = await ownSession(db, studentId, sessionId);
  const mastery = await getMastery(db, studentId, session.skill_id);
  let level: number = mastery.level;
  if (similarTo) {
    const { data: ref } = await db.from('questions').select('difficulty').eq('id', similarTo).single();
    if (ref) level = ref.difficulty;
  }
  const { data: seenRows } = await db.from('item_outcomes').select('question_id').eq('session_id', sessionId);
  const seenHere = new Set((seenRows ?? []).map((r) => r.question_id));
  const { data: recentRows } = await db
    .from('item_outcomes').select('question_id').eq('student_id', studentId).eq('skill_id', session.skill_id)
    .order('created_at', { ascending: false }).limit(30);
  const recent = new Set((recentRows ?? []).map((r) => r.question_id));

  const { data: pool } = await db.from('questions').select('*').eq('skill_id', session.skill_id).eq('status', 'published').in('bank', ['practice', 'library']);
  const candidates = ((pool ?? []) as Question[]).filter((q) => !seenHere.has(q.id) && q.id !== similarTo);
  if (!candidates.length) return { done: true as const, seen: seenHere.size };

  const score = (q: Question) => Math.abs(q.difficulty - level) * 10 + (recent.has(q.id) ? 5 : 0) + Math.random();
  candidates.sort((a, b) => score(a) - score(b));
  return { done: false as const, question: toPublic(candidates[0]), level: mastery.level, seen: seenHere.size };
}

export async function submitAnswer(studentId: string, sessionId: string, questionId: string, answer: unknown, timeMs: number, hintUsed = false) {
  const db = supabaseAdmin();
  const session = await ownSession(db, studentId, sessionId);
  const { a: aRules, r: rRules } = await rules(db);
  const { data: qd } = await db.from('questions').select('*').eq('id', questionId).eq('skill_id', session.skill_id).single();
  if (!qd) throw new Error('السؤال غير متاح');
  const q = qd as Question;

  const { data: done } = await db.from('item_outcomes').select('outcome').eq('session_id', sessionId).eq('question_id', questionId).maybeSingle();
  if (done) throw new Error('تمت معالجة هذا السؤال');

  const { data: prevTries } = await db.from('attempts').select('try_no, time_ms').eq('session_id', sessionId).eq('question_id', questionId);
  const tryNo = (prevTries?.length ?? 0) + 1;
  const correct = isCorrect(q, answer);
  // محاولة واحدة لكل سؤال: تظهر الإجابة الصحيحة وشرحها مباشرة، و«الهمسة» متاحة قبل الإجابة
  const action = decideFeedback({ correct, tryNo, maxTriesBeforeReveal: 1, solutionRevealed: false });

  await db.from('attempts').insert({
    session_id: sessionId, student_id: studentId, question_id: questionId, try_no: tryNo,
    answer: { value: answer }, is_correct: correct, hint_shown: hintUsed, solution_revealed: !correct,
    error_type: correct ? null : classifyError(q, answer), time_ms: Math.max(0, Math.min(timeMs, 30 * 60 * 1000)),
  });

  if (action.kind === 'hint') {
    return { kind: 'hint' as const, message: retryMessage(tryNo + q.prompt.length), hint: q.hint ?? q.solution_steps?.[0] ?? 'تحديد المطلوب في السؤال هو الخطوة الأولى.', triesLeft: action.triesLeft };
  }

  const outcome: Outcome = correct && hintUsed ? 'with_hint' : action.outcome;
  const totalTime = (prevTries ?? []).reduce((s, t) => s + (t.time_ms ?? 0), 0) + timeMs;
  await db.from('item_outcomes').insert({
    session_id: sessionId, question_id: questionId, student_id: studentId, skill_id: session.skill_id,
    tries: tryNo, outcome, total_time_ms: totalTime,
  });

  // تحديث الإتقان والمكافآت
  const before = await getMastery(db, studentId, session.skill_id);
  const after = updateMastery(before, outcome, aRules);
  await db.from('skill_mastery').upsert({ student_id: studentId, skill_id: session.skill_id, ...after, updated_at: new Date().toISOString() });

  let starsEarned = 0;
  const grants = [] as { amount: number; reason: string }[];
  const s1 = starsForOutcome(outcome, rRules);
  if (s1) grants.push(s1);
  const mc = rewardsForMasteryChange(before.status, after.status, rRules);
  grants.push(...mc.stars);
  for (const g of grants) {
    starsEarned += g.amount;
    await db.from('star_ledger').insert({ student_id: studentId, amount: g.amount, reason: g.reason, session_id: sessionId });
  }

  if (action.kind === 'correct') {
    return { kind: 'correct' as const, outcome, message: praiseMessage(tryNo + q.prompt.length + Date.now()), explanation: q.explanation ?? null, steps: q.solution_steps ?? [], starsEarned, masteryStatus: after.status, level: after.level };
  }
  return {
    kind: 'reveal' as const, outcome, correctAnswer: q.correct_answer.value,
    correctText: q.options?.find((o) => String(o.id) === String(q.correct_answer.value))?.text ?? String(q.correct_answer.value),
    steps: q.solution_steps ?? [], explanation: q.explanation ?? null, remedial: q.remedial_activity ?? null, hint: q.hint ?? q.solution_steps?.[0] ?? null, chosen: answer,
    starsEarned, masteryStatus: after.status, level: after.level,
  };
}

export async function finishSession(studentId: string, sessionId: string) {
  const db = supabaseAdmin();
  const session = await ownSession(db, studentId, sessionId);
  const { r: rRules } = await rules(db);
  await db.from('practice_sessions').update({ ended_at: new Date().toISOString() }).eq('id', sessionId);

  const { data: outs } = await db.from('item_outcomes').select('outcome').eq('session_id', sessionId);
  const current = (outs ?? []).map((o) => o.outcome as Outcome);
  let stars = 0;
  if (current.length >= 3) {
    stars += rRules.stars_session_complete;
    await db.from('star_ledger').insert({ student_id: studentId, amount: rRules.stars_session_complete, reason: 'إكمال جلسة تدريب', session_id: sessionId });
  }
  // الجلسة السابقة في المهارة نفسها للمقارنة الذاتية
  const { data: prev } = await db.from('practice_sessions').select('id').eq('student_id', studentId).eq('skill_id', session.skill_id)
    .neq('id', sessionId).not('ended_at', 'is', null).order('started_at', { ascending: false }).limit(1);
  if (prev?.[0]) {
    const { data: po } = await db.from('item_outcomes').select('outcome').eq('session_id', prev[0].id);
    if (isPersonalImprovement(current, (po ?? []).map((o) => o.outcome as Outcome))) {
      stars += rRules.stars_personal_improvement;
      await db.from('star_ledger').insert({ student_id: studentId, amount: rRules.stars_personal_improvement, reason: 'تحسن شخصي', session_id: sessionId });
    }
  }
  const awarded = await awardNewBadges(studentId);
  return {
    items: current.length,
    independent: current.filter((o) => o === 'independent').length,
    withHint: current.filter((o) => o === 'with_hint').length,
    revealed: current.filter((o) => o === 'after_reveal').length,
    bonusStars: stars,
    newBadges: awarded,
  };
}
