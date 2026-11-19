import 'server-only';
import { supabaseAdmin } from './supabase/admin';
import { BADGES, DEFAULT_MONTHLY_GOALS, MONTHLY_BADGE, evaluateBadges, hijriMonth, type MonthlyGoals, type StudentStats } from './badges';

type DB = ReturnType<typeof supabaseAdmin>;
const OFFICIAL_KEYS = ['iea', 't03a', 't03b', 't99a', 't99b', 't99c'];

export async function monthlyGoals(db: DB): Promise<MonthlyGoals> {
  const { data } = await db.from('reward_rules').select('monthly_sessions, monthly_models, monthly_independent').eq('id', 1).single();
  return data ? { sessions: data.monthly_sessions, models: data.monthly_models, independent: data.monthly_independent } : DEFAULT_MONTHLY_GOALS;
}

/** إحصاءات الطالب اللازمة لقواعد الأوسمة، محسوبة من البيانات المحفوظة */
export async function studentStats(db: DB, studentId: string, now = new Date()): Promise<StudentStats> {
  const month = hijriMonth(now).key;
  const since = new Date(now.getTime() - 45 * 864e5).toISOString();
  const [sessions, mastery, atts, outcomesRecent, hints, bests] = await Promise.all([
    db.from('practice_sessions').select('started_at, ended_at').eq('student_id', studentId).not('ended_at', 'is', null),
    db.from('skill_mastery').select('status, skills(standard_no)').eq('student_id', studentId).eq('status', 'mastered'),
    db.from('assessment_attempts').select('score, max_score, submitted_at, assessments(kind, form_label)').eq('student_id', studentId).not('submitted_at', 'is', null),
    db.from('item_outcomes').select('outcome, created_at').eq('student_id', studentId).eq('outcome', 'independent').gte('created_at', since),
    db.from('item_outcomes').select('outcome', { count: 'exact', head: true }).eq('student_id', studentId).eq('outcome', 'with_hint'),
    db.from('star_ledger').select('reason').eq('student_id', studentId).eq('reason', 'تحسن شخصي'),
  ]);
  const inMonth = (d: string | null) => !!d && hijriMonth(new Date(d)).key === month;
  const ended = sessions.data ?? [];
  const models = (atts.data ?? []).filter((a) => (a.assessments as unknown as { kind: string } | null)?.kind === 'model');
  const weekAgo = now.getTime() - 7 * 864e5;
  return {
    sessions: ended.length,
    masteredStandards: (mastery.data ?? []).map((m) => (m.skills as unknown as { standard_no: number | null } | null)?.standard_no).filter((n): n is number => !!n),
    modelsCompleted: models.length,
    bestModelPct: models.reduce((mx, a) => Math.max(mx, a.max_score ? Math.round(((a.score ?? 0) / a.max_score) * 100) : 0), 0),
    officialModelsDone: new Set(models.map((a) => (a.assessments as unknown as { form_label: string }).form_label).filter((k) => OFFICIAL_KEYS.includes(k))).size,
    officialModelsTotal: OFFICIAL_KEYS.length,
    practiceDaysLast7: new Set(ended.filter((s) => new Date(s.started_at).getTime() >= weekAgo).map((s) => s.started_at.slice(0, 10))).size,
    solvedAfterHint: hints.count ?? 0,
    improvements: (bests.data ?? []).length,
    month: {
      sessions: ended.filter((s) => inMonth(s.ended_at)).length,
      models: models.filter((a) => inMonth(a.submitted_at)).length,
      independent: (outcomesRecent.data ?? []).filter((o) => inMonth(o.created_at)).length,
    },
  };
}

/** يمنح الأوسمة المستحقة الجديدة ويعيد أسماءها لعرضها للطالب */
export async function awardNewBadges(studentId: string): Promise<string[]> {
  const db = supabaseAdmin();
  const [stats, goals, { data: catalog }, { data: owned }] = await Promise.all([
    studentStats(db, studentId), monthlyGoals(db),
    db.from('badges').select('id, code'),
    db.from('student_badges').select('period, badges(code)').eq('student_id', studentId),
  ]);
  const ownedSet = new Set((owned ?? []).map((o) => {
    const code = (o.badges as unknown as { code: string }).code;
    return o.period ? `${code}:${o.period}` : code;
  }));
  const period = hijriMonth(new Date()).key;
  const fresh = evaluateBadges(stats, ownedSet, period, goals);
  const idOf = new Map((catalog ?? []).map((b) => [b.code, b.id]));
  const names: string[] = [];
  for (const f of fresh) {
    const id = idOf.get(f.code);
    if (!id) continue;
    const { error } = await db.from('student_badges').insert({ student_id: studentId, badge_id: id, period: f.period });
    if (!error) names.push(f.code === MONTHLY_BADGE.code ? `${MONTHLY_BADGE.name} — ${hijriMonth(new Date()).name}` : BADGES.find((b) => b.code === f.code)?.name ?? f.code);
  }
  return names;
}
