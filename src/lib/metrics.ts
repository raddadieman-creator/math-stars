import type { MasteryStatus, Outcome } from './types';

export interface OutcomeRow {
  student_id: string;
  skill_id: string;
  session_id: string;
  tries: number;
  outcome: Outcome;
  total_time_ms: number | null;
  created_at: string;
}

/** رقم أسبوع البرنامج (1..weeks) من تاريخ البداية؛ null إن لم تُحدد البداية أو قبلها */
export function programWeek(date: Date, start: Date | null, weeks: number): number | null {
  if (!start) return null;
  const diff = Math.floor((date.getTime() - start.getTime()) / (7 * 24 * 3600 * 1000));
  if (diff < 0) return null;
  return Math.min(diff + 1, weeks);
}

const pct = (n: number, d: number) => (d === 0 ? null : Math.round((n / d) * 1000) / 10);

export interface StudentIndicators {
  sessions: number;
  totalTries: number;
  itemsAnswered: number;
  firstTryPct: number | null;
  withHelpPct: number | null;
  afterRevealPct: number | null;
  totalMinutes: number;
  retrainCount: number; // جلسات إضافية على مهارة سبق التدرب عليها
}

export function studentIndicators(rows: OutcomeRow[]): StudentIndicators {
  const sessions = new Set(rows.map((r) => r.session_id));
  const n = rows.length;
  const independent = rows.filter((r) => r.outcome === 'independent').length;
  const withHint = rows.filter((r) => r.outcome === 'with_hint').length;
  const reveal = rows.filter((r) => r.outcome === 'after_reveal' || r.outcome === 'not_solved').length;
  const sessionsPerSkill = new Map<string, Set<string>>();
  for (const r of rows) {
    if (!sessionsPerSkill.has(r.skill_id)) sessionsPerSkill.set(r.skill_id, new Set());
    sessionsPerSkill.get(r.skill_id)!.add(r.session_id);
  }
  let retrain = 0;
  sessionsPerSkill.forEach((s) => (retrain += Math.max(0, s.size - 1)));
  return {
    sessions: sessions.size,
    totalTries: rows.reduce((a, r) => a + r.tries, 0),
    itemsAnswered: n,
    firstTryPct: pct(independent, n),
    withHelpPct: pct(withHint, n),
    afterRevealPct: pct(reveal, n),
    totalMinutes: Math.round(rows.reduce((a, r) => a + (r.total_time_ms ?? 0), 0) / 60000),
    retrainCount: retrain,
  };
}

/** سلسلة أسبوعية: عدد الأسئلة ونسبة الإجابة المستقلة لكل أسبوع من أسابيع البرنامج */
export function weeklySeries(rows: OutcomeRow[], start: Date | null, weeks: number) {
  const buckets = new Map<number, { items: number; independent: number }>();
  for (const r of rows) {
    const w = programWeek(new Date(r.created_at), start, weeks);
    if (w === null) continue;
    const b = buckets.get(w) ?? { items: 0, independent: 0 };
    b.items += 1;
    if (r.outcome === 'independent') b.independent += 1;
    buckets.set(w, b);
  }
  return Array.from({ length: weeks }, (_, i) => {
    const b = buckets.get(i + 1);
    return { week: i + 1, items: b?.items ?? 0, firstTryPct: b ? pct(b.independent, b.items) : null };
  });
}

export interface ClassIndicators {
  enrolled: number;
  participants: number;
  participationPct: number | null;
  avgFirstTryPct: number | null; // متوسط نسب الطالبات (كل طالبة بوزن واحد)
  masteryDistribution: Record<MasteryStatus, number>;
  needsSupportStudents: number;
  advancedStudents: number;
}

export function classIndicators(
  enrolledIds: string[],
  rows: OutcomeRow[],
  mastery: { student_id: string; skill_id: string; status: MasteryStatus }[],
): ClassIndicators {
  const byStudent = new Map<string, OutcomeRow[]>();
  for (const r of rows) {
    if (!byStudent.has(r.student_id)) byStudent.set(r.student_id, []);
    byStudent.get(r.student_id)!.push(r);
  }
  const rates = [...byStudent.values()].map((rs) => rs.filter((r) => r.outcome === 'independent').length / rs.length);
  const dist: Record<MasteryStatus, number> = { not_started: 0, developing: 0, needs_support: 0, mastered: 0 };
  mastery.forEach((m) => (dist[m.status] += 1));
  const supportSet = new Set(mastery.filter((m) => m.status === 'needs_support').map((m) => m.student_id));
  const masteredCount = new Map<string, number>();
  mastery.filter((m) => m.status === 'mastered').forEach((m) => masteredCount.set(m.student_id, (masteredCount.get(m.student_id) ?? 0) + 1));
  const advanced = [...masteredCount.entries()].filter(([sid, c]) => c >= 2 && !supportSet.has(sid)).length;
  return {
    enrolled: enrolledIds.length,
    participants: byStudent.size,
    participationPct: pct(byStudent.size, enrolledIds.length),
    avgFirstTryPct: rates.length ? Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 1000) / 10 : null,
    masteryDistribution: dist,
    needsSupportStudents: supportSet.size,
    advancedStudents: advanced,
  };
}

/** المهارات الأصعب: الأدنى في نسبة الإجابة المستقلة (بحد أدنى من الأسئلة) */
export function hardestSkills(rows: OutcomeRow[], minItems = 5) {
  const m = new Map<string, { items: number; independent: number }>();
  for (const r of rows) {
    const b = m.get(r.skill_id) ?? { items: 0, independent: 0 };
    b.items += 1;
    if (r.outcome === 'independent') b.independent += 1;
    m.set(r.skill_id, b);
  }
  return [...m.entries()]
    .filter(([, b]) => b.items >= minItems)
    .map(([skill_id, b]) => ({ skill_id, items: b.items, firstTryPct: pct(b.independent, b.items)! }))
    .sort((a, b) => a.firstTryPct - b.firstTryPct);
}

// ---------------- القياس القبلي والبعدي ----------------
export interface PrePostRow { student_id: string; pre: number | null; post: number | null; practiceItems: number }

export function prePostSummary(rows: PrePostRow[]) {
  const paired = rows.filter((r) => r.pre !== null && r.post !== null) as Required<{ [K in keyof PrePostRow]: NonNullable<PrePostRow[K]> }>[];
  const n = paired.length;
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
  const gains = paired.map((r) => r.post - r.pre);
  const improved = gains.filter((g) => g > 0).length;
  const sd = (xs: number[]) => {
    if (xs.length < 2) return null;
    const m = mean(xs)!;
    return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
  };
  const sdGain = sd(gains);
  const meanGain = mean(gains);
  return {
    pairedStudents: n,
    missingPost: rows.filter((r) => r.pre !== null && r.post === null).length,
    meanPre: round(mean(paired.map((r) => r.pre))),
    meanPost: round(mean(paired.map((r) => r.post))),
    meanGainPoints: round(meanGain), // بالنقاط المئوية إذا كانت الدرجات نسبًا مئوية
    improvedPct: n ? round((improved / n) * 100) : null,
    // حجم الأثر للعينات المرتبطة (d_z = متوسط الفرق ÷ انحرافه المعياري) — وصفي فقط
    dz: meanGain !== null && sdGain ? round(meanGain / sdGain, 2) : null,
    // ارتباط وصفي بين كثافة التدريب ومقدار التحسن (بيرسون)
    practiceGainCorrelation: round(pearson(paired.map((r) => r.practiceItems), gains), 2),
  };
}

export function pearson(x: number[], y: number[]): number | null {
  const n = x.length;
  if (n < 3) return null;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  if (sxx === 0 || syy === 0) return null;
  return sxy / Math.sqrt(sxx * syy);
}

function round(v: number | null, d = 1): number | null {
  if (v === null || Number.isNaN(v)) return null;
  const f = 10 ** d;
  return Math.round(v * f) / f;
}
