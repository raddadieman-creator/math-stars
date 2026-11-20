import 'server-only';
import { classData, skillNames } from '@/lib/teacher-data';
import { classIndicators, hardestSkills, studentIndicators } from '@/lib/metrics';
import type { supabaseServer } from '@/lib/supabase/server';

type SB = Awaited<ReturnType<typeof supabaseServer>>;

/** بيانات تقرير الفصل ولوحة المتابعة: مؤشرات وصفية مبنية على ما حُفظ فعليًا */
export async function classReport(sb: SB, classId: string) {
  const [{ students, outcomes, mastery }, names, { data: skills }] = await Promise.all([
    classData(sb, classId), skillNames(sb),
    sb.from('skills').select('id, content_domains(name_ar, code)'),
  ]);
  const active = students.filter((s) => s.is_active);
  const ids = active.map((s) => s.id);
  const [{ data: mAs }, { data: stars }, { data: badges }] = await Promise.all([
    sb.from('assessments').select('id, kind').in('kind', ['pre', 'post']),
    ids.length ? sb.from('star_ledger').select('student_id, amount').in('student_id', ids) : Promise.resolve({ data: [] as { student_id: string; amount: number }[] }),
    ids.length ? sb.from('student_badges').select('student_id, badges(code)').in('student_id', ids) : Promise.resolve({ data: [] as { student_id: string; badges: unknown }[] }),
  ]);
  const { data: mAtt } = ids.length && mAs?.length
    ? await sb.from('assessment_attempts').select('assessment_id, student_id, score, max_score').in('student_id', ids).in('assessment_id', mAs.map((x) => x.id)).not('submitted_at', 'is', null)
    : { data: [] as { assessment_id: string; student_id: string; score: number; max_score: number }[] };
  const pctOf = (sid: string, kind: string) => {
    const a = mAs?.find((x) => x.kind === kind);
    const t = (mAtt ?? []).find((x) => x.student_id === sid && x.assessment_id === a?.id);
    return t ? Math.round((t.score / Math.max(1, t.max_score)) * 100) : null;
  };
  const support = new Set(mastery.filter((m) => m.status === 'needs_support').map((m) => m.student_id));

  const rows = active.map((s) => {
    const ind = studentIndicators(outcomes.filter((o) => o.student_id === s.id));
    return {
      id: s.id, name: s.full_name, sessions: ind.sessions, items: ind.itemsAnswered, firstTry: ind.firstTryPct,
      mastered: mastery.filter((m) => m.student_id === s.id && m.status === 'mastered').length,
      stars: (stars ?? []).filter((x) => x.student_id === s.id).reduce((a, x) => a + x.amount, 0),
      badges: (badges ?? []).filter((x) => x.student_id === s.id).length,
      pre: pctOf(s.id, 'pre'), post: pctOf(s.id, 'post'),
      status: support.has(s.id) ? 'تحتاج إلى دعم' : ind.itemsAnswered ? 'متابعة' : 'لم تبدأ',
    };
  });

  // نسبة الإتقان لكل مجال: (طالب، مهارة) متقنة من مجموع أزواج المجال لطلاب الفصل
  const domOf = new Map<string, string>();
  for (const k of skills ?? []) { const d = k.content_domains as unknown as { name_ar: string } | null; if (d) domOf.set(k.id, d.name_ar); }
  const domains = [...new Set(domOf.values())].map((name) => {
    const sk = [...domOf.entries()].filter(([, n]) => n === name).map(([id]) => id);
    const total = sk.length * Math.max(1, active.length);
    const done = mastery.filter((m) => m.status === 'mastered' && sk.includes(m.skill_id) && ids.includes(m.student_id)).length;
    return { name, pct: active.length ? Math.round((done / total) * 100) : 0 };
  });

  const avg = (xs: (number | null)[]) => { const v = xs.filter((x): x is number => x !== null); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null; };
  const ci = classIndicators(ids, outcomes, mastery);
  return {
    rows, ci, domains,
    hard: hardestSkills(outcomes, 5).slice(0, 6).map((h) => ({ name: names.get(h.skill_id) ?? '—', pct: h.firstTryPct })),
    prePost: { pre: avg(rows.map((r) => r.pre)), post: avg(rows.map((r) => r.post)), preN: rows.filter((r) => r.pre !== null).length, postN: rows.filter((r) => r.post !== null).length },
    badgeCounts: (badges ?? []).reduce<Record<string, number>>((acc, b) => { const c = (b.badges as { code?: string } | null)?.code; if (c) acc[c] = (acc[c] ?? 0) + 1; return acc; }, {}),
    totals: { stars: rows.reduce((a, r) => a + r.stars, 0), badges: rows.reduce((a, r) => a + r.badges, 0), items: rows.reduce((a, r) => a + r.items, 0) },
  };
}
export type ClassReport = Awaited<ReturnType<typeof classReport>>;

/** منجزات طالبة واحدة للشهادة والمشاركة */
export async function studentAchievements(sb: SB | ReturnType<typeof import('@/lib/supabase/admin').supabaseAdmin>, studentId: string) {
  const { data: st } = await sb.from('students').select('id, full_name, nickname, classes(name)').eq('id', studentId).maybeSingle();
  if (!st) return null;
  const [{ data: stars }, { data: earned }] = await Promise.all([
    sb.from('star_ledger').select('amount').eq('student_id', studentId),
    sb.from('student_badges').select('period, badges(code, name_ar, icon, tier)').eq('student_id', studentId),
  ]);
  const seen = new Set<string>();
  const badges = (earned ?? []).map((e) => e.badges as unknown as { code: string; name_ar: string; icon: string; tier: string })
    .filter((b) => b && !seen.has(b.code) && seen.add(b.code));
  return {
    name: st.full_name as string, short: (st.nickname as string) || st.full_name.split(' ').slice(0, 2).join(' '),
    className: ((st.classes as unknown as { name: string } | null)?.name) ?? '',
    stars: (stars ?? []).reduce((a, x) => a + x.amount, 0), badges,
  };
}
export type StudentAch = NonNullable<Awaited<ReturnType<typeof studentAchievements>>>;
