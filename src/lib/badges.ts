/**
 * نظام الأوسمة: فهرس ثابت وقواعد منح شفافة تعمل على إحصاءات الطالب.
 * الدالة evaluateBadges نقية وقابلة للاختبار، وتُستدعى بعد كل جلسة تدريب أو نموذج.
 */

export type Tier = 'bronze' | 'silver' | 'gold' | 'special';
export type BadgeIcon = 'star' | 'flame' | 'target' | 'crown' | 'number' | 'algebra' | 'geometry' | 'data' | 'book' | 'check' | 'trophy' | 'mountain' | 'trend' | 'calendar';
export type BadgeGroup = 'tasks' | 'mastery' | 'library' | 'persistence' | 'monthly';

export interface StudentStats {
  sessions: number;                 // جلسات التدريب المكتملة
  masteredStandards: number[];      // أرقام المعايير المتقنة (1–19)
  modelsCompleted: number;          // محاولات النماذج المسلَّمة
  bestModelPct: number;             // أعلى نسبة في نموذج
  officialModelsDone: number;       // عدد النماذج الرسمية المختلفة التي سُلِّمت
  officialModelsTotal: number;
  practiceDaysLast7: number;        // أيام تدريب مختلفة خلال آخر 7 أيام
  solvedAfterHint: number;          // أسئلة حُلت بعد تلميح
  improvements: number;             // مرات التحسن الشخصي
  month: { sessions: number; models: number; independent: number }; // إنجاز الشهر الحالي
}

export interface MonthlyGoals { sessions: number; models: number; independent: number }
export const DEFAULT_MONTHLY_GOALS: MonthlyGoals = { sessions: 8, models: 2, independent: 30 };

interface Rule { value: (s: StudentStats, g: MonthlyGoals) => number; target: (g: MonthlyGoals) => number }
export interface BadgeDef { code: string; name: string; desc: string; tier: Tier; icon: BadgeIcon; group: BadgeGroup; rule: Rule }

const DOMAIN_STD: Record<string, number[]> = {
  number: [1, 2, 3, 4, 5, 6], algebra: [7, 8, 9, 10, 11, 12], geometry: [13, 14, 15], data: [16, 17, 18, 19],
};
const masteredIn = (s: StudentStats, d: string) => DOMAIN_STD[d].filter((n) => s.masteredStandards.includes(n)).length;
const fixed = (n: number) => () => n;

export const BADGES: BadgeDef[] = [
  { code: 'first_session', name: 'الانطلاقة', desc: 'إكمال أول جلسة تدريب', tier: 'bronze', icon: 'star', group: 'tasks', rule: { value: (s) => s.sessions, target: fixed(1) } },
  { code: 'sessions_5', name: 'المثابر', desc: 'إكمال 5 جلسات تدريب', tier: 'bronze', icon: 'flame', group: 'tasks', rule: { value: (s) => s.sessions, target: fixed(5) } },
  { code: 'sessions_20', name: 'المتمرّس', desc: 'إكمال 20 جلسة تدريب', tier: 'silver', icon: 'flame', group: 'tasks', rule: { value: (s) => s.sessions, target: fixed(20) } },
  { code: 'sessions_50', name: 'صاحب الهمّة', desc: 'إكمال 50 جلسة تدريب', tier: 'gold', icon: 'flame', group: 'tasks', rule: { value: (s) => s.sessions, target: fixed(50) } },

  { code: 'std_1', name: 'أول معيار', desc: 'إتقان معيار واحد', tier: 'bronze', icon: 'target', group: 'mastery', rule: { value: (s) => s.masteredStandards.length, target: fixed(1) } },
  { code: 'std_5', name: 'خمسة معايير', desc: 'إتقان 5 معايير', tier: 'silver', icon: 'target', group: 'mastery', rule: { value: (s) => s.masteredStandards.length, target: fixed(5) } },
  { code: 'dom_number', name: 'فارس الأعداد', desc: 'إتقان معايير الأعداد الستة', tier: 'gold', icon: 'number', group: 'mastery', rule: { value: (s) => masteredIn(s, 'number'), target: fixed(6) } },
  { code: 'dom_algebra', name: 'فارس الجبر', desc: 'إتقان معايير الجبر الستة', tier: 'gold', icon: 'algebra', group: 'mastery', rule: { value: (s) => masteredIn(s, 'algebra'), target: fixed(6) } },
  { code: 'dom_geometry', name: 'فارس الهندسة', desc: 'إتقان معايير الهندسة والقياس الثلاثة', tier: 'gold', icon: 'geometry', group: 'mastery', rule: { value: (s) => masteredIn(s, 'geometry'), target: fixed(3) } },
  { code: 'dom_data', name: 'فارس البيانات', desc: 'إتقان معايير البيانات والاحتمالات الأربعة', tier: 'gold', icon: 'data', group: 'mastery', rule: { value: (s) => masteredIn(s, 'data'), target: fixed(4) } },
  { code: 'std_19', name: 'إتقان الإطار', desc: 'إتقان المعايير الـ19 كلها', tier: 'gold', icon: 'crown', group: 'mastery', rule: { value: (s) => s.masteredStandards.length, target: fixed(19) } },

  { code: 'model_1', name: 'أول نموذج', desc: 'تسليم أول نموذج اختبار', tier: 'bronze', icon: 'book', group: 'library', rule: { value: (s) => s.modelsCompleted, target: fixed(1) } },
  { code: 'model_80', name: 'نتيجة متميزة', desc: '80% فأكثر في أي نموذج', tier: 'silver', icon: 'check', group: 'library', rule: { value: (s) => Math.min(s.bestModelPct, 80), target: fixed(80) } },
  { code: 'timss_expert', name: 'خبير TIMSS', desc: 'تسليم جميع نماذج الأسئلة الرسمية', tier: 'gold', icon: 'trophy', group: 'library', rule: { value: (s) => s.officialModelsDone, target: () => 6 } },

  { code: 'persistence_3', name: 'المواظبة', desc: 'التدريب في 3 أيام مختلفة خلال أسبوع', tier: 'silver', icon: 'calendar', group: 'persistence', rule: { value: (s) => s.practiceDaysLast7, target: fixed(3) } },
  { code: 'comeback', name: 'المثابرة', desc: 'حل سؤال بعد التلميح', tier: 'bronze', icon: 'mountain', group: 'persistence', rule: { value: (s) => s.solvedAfterHint, target: fixed(1) } },
  { code: 'personal_best', name: 'التحسن الشخصي', desc: 'تجاوز نتيجتك السابقة في المهارة نفسها', tier: 'silver', icon: 'trend', group: 'persistence', rule: { value: (s) => s.improvements, target: fixed(1) } },
];

export const MONTHLY_BADGE = { code: 'monthly_excellence', name: 'تميّز الشهر', tier: 'special' as Tier, icon: 'crown' as BadgeIcon };

export const GROUP_AR: Record<BadgeGroup, string> = { tasks: 'المهام', mastery: 'إتقان المعايير', library: 'مكتبة النماذج', persistence: 'المواظبة', monthly: 'تميّز الشهر' };

/** تقدم الطالب نحو كل وسام (لعرض الأوسمة المقفلة مع شريط التقدم) */
export function badgeProgress(s: StudentStats, g: MonthlyGoals = DEFAULT_MONTHLY_GOALS) {
  return BADGES.map((b) => {
    const target = b.rule.target(g);
    const value = Math.min(b.rule.value(s, g), target);
    return { code: b.code, value, target, done: value >= target };
  });
}

export function monthlyProgress(s: StudentStats, g: MonthlyGoals = DEFAULT_MONTHLY_GOALS) {
  const items = [
    { key: 'sessions', label: 'جلسات تدريب', value: Math.min(s.month.sessions, g.sessions), target: g.sessions },
    { key: 'models', label: 'نماذج اختبار', value: Math.min(s.month.models, g.models), target: g.models },
    { key: 'independent', label: 'إجابات صحيحة من المحاولة الأولى', value: Math.min(s.month.independent, g.independent), target: g.independent },
  ];
  return { items, done: items.every((i) => i.value >= i.target) };
}

/** الأوسمة المستحقة الآن ولم تُمنح بعد. يُعاد وسام الشهر بمفتاح الفترة */
export function evaluateBadges(s: StudentStats, owned: Set<string>, period: string, g: MonthlyGoals = DEFAULT_MONTHLY_GOALS) {
  const fresh = badgeProgress(s, g).filter((p) => p.done && !owned.has(p.code)).map((p) => ({ code: p.code, period: null as string | null }));
  if (monthlyProgress(s, g).done && !owned.has(`${MONTHLY_BADGE.code}:${period}`)) fresh.push({ code: MONTHLY_BADGE.code, period });
  return fresh;
}

/** مفتاح الشهر الهجري واسمه (تقويم أم القرى) */
export function hijriMonth(d: Date): { key: string; name: string } {
  const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { year: 'numeric', month: 'numeric' }).formatToParts(d);
  const y = parts.find((p) => p.type === 'year')?.value.replace(/\D/g, '') ?? '';
  const m = parts.find((p) => p.type === 'month')?.value ?? '';
  const name = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { month: 'long', year: 'numeric' }).format(d);
  return { key: `${y}-${m.padStart(2, '0')}`, name };
}

// ---------------- التصميم ----------------
const TIER_COLORS: Record<Tier, [string, string, string]> = {
  bronze: ['#f3c29a', '#c47a3d', '#7a4317'],
  silver: ['#f4f8ff', '#9fb4da', '#41567f'],
  gold: ['#ffe9a3', '#f2b51b', '#9a6a00'],
  special: ['#d8ccff', '#7c5cff', '#3b2a8f'],
};

const ICONS: Record<BadgeIcon, string> = {
  star: '<path d="M0 -15 L4.4 -4.8 L15 -4.6 L6.6 2.2 L9.4 13 L0 7 L-9.4 13 L-6.6 2.2 L-15 -4.6 L-4.4 -4.8 Z" fill="currentColor"/>',
  flame: '<path d="M0 -16 C6 -8 12 -3 9 6 C7 12 2 15 0 15 C-2 15 -8 12 -9 5 C-10 -1 -5 -4 -3 -9 C-1 -5 1 -3 2 -2 C3 -6 2 -11 0 -16 Z" fill="currentColor"/>',
  target: '<circle r="14" fill="none" stroke="currentColor" stroke-width="3"/><circle r="8" fill="none" stroke="currentColor" stroke-width="3"/><circle r="3" fill="currentColor"/>',
  crown: '<path d="M-15 8 L-13 -9 L-6 -1 L0 -13 L6 -1 L13 -9 L15 8 Z" fill="currentColor"/><rect x="-15" y="10" width="30" height="4" rx="1.5" fill="currentColor"/>',
  number: '<text y="6" text-anchor="middle" font-size="17" font-weight="900" fill="currentColor" font-family="Tajawal, sans-serif">123</text>',
  algebra: '<text y="8" text-anchor="middle" font-size="24" font-weight="900" fill="currentColor" font-family="Tajawal, sans-serif">س²</text>',
  geometry: '<path d="M0 -14 L14 11 L-14 11 Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><circle cx="0" cy="3" r="4" fill="currentColor"/>',
  data: '<rect x="-13" y="0" width="7" height="12" rx="1.5" fill="currentColor"/><rect x="-3.5" y="-7" width="7" height="19" rx="1.5" fill="currentColor"/><rect x="6" y="-14" width="7" height="26" rx="1.5" fill="currentColor"/>',
  book: '<path d="M-14 -11 C-8 -13 -3 -12 0 -9 C3 -12 8 -13 14 -11 L14 11 C8 9 3 10 0 13 C-3 10 -8 9 -14 11 Z" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/><path d="M0 -9 V13" stroke="currentColor" stroke-width="2.4"/>',
  check: '<path d="M-12 1 L-4 9 L13 -9" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>',
  trophy: '<path d="M-9 -13 H9 V-3 C9 4 4 7 0 7 C-4 7 -9 4 -9 -3 Z" fill="currentColor"/><path d="M-9 -10 H-14 C-14 -3 -11 0 -8 0 M9 -10 H14 C14 -3 11 0 8 0" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="-2" y="7" width="4" height="5" fill="currentColor"/><rect x="-8" y="12" width="16" height="3.5" rx="1" fill="currentColor"/>',
  mountain: '<path d="M-15 12 L-4 -8 L2 2 L6 -3 L15 12 Z" fill="currentColor"/><path d="M-4 -8 L-1 -3 L-6 -2 Z" fill="#fff" opacity=".7"/>',
  trend: '<path d="M-14 10 L-5 1 L1 6 L13 -8" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 -9 H14 V0" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>',
  calendar: '<rect x="-13" y="-11" width="26" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="2.8"/><path d="M-13 -4 H13" stroke="currentColor" stroke-width="2.8"/><path d="M-6 -15 V-8 M6 -15 V-8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><circle cx="-5" cy="4" r="2.2" fill="currentColor"/><circle cx="2" cy="4" r="2.2" fill="currentColor"/>',
};

let svgSeq = 0;
/** وسام على هيئة ميدالية سداسية بشريط؛ المقفل يظهر رماديًا */
export function badgeSVG(icon: BadgeIcon, tier: Tier, earned: boolean, size = 88): string {
  const [light, mid, dark] = earned ? TIER_COLORS[tier] : ['#f3f4f7', '#e1e4ea', '#b9bfca'];
  const id = `bdg${++svgSeq}${icon}${tier}`; // معرّف فريد لكل نسخة حتى لا يتعطل التدرج اللوني
  return `<svg width="${size}" height="${size * 1.18}" viewBox="-50 -50 100 118" role="img">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${light}"/><stop offset=".55" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs>
  <path d="M-20 26 L-26 64 L-14 56 L-6 66 L-2 30 Z" fill="${earned ? (tier === 'special' ? '#ff86b5' : '#3fdcc8') : '#d5d9e0'}"/>
  <path d="M20 26 L26 64 L14 56 L6 66 L2 30 Z" fill="${earned ? (tier === 'special' ? '#ffd04d' : '#6aa8ff') : '#d5d9e0'}"/>
  <path d="M0 -46 L40 -23 L40 23 L0 46 L-40 23 L-40 -23 Z" fill="url(#${id})" stroke="${dark}" stroke-width="2"/>
  <path d="M0 -36 L31 -18 L31 18 L0 36 L-31 18 L-31 -18 Z" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
  <g color="${earned ? '#ffffff' : '#c4c9d3'}" style="${earned ? 'filter:drop-shadow(0 1px 1px rgba(0,0,0,.25))' : ''}">${ICONS[icon]}</g>
  ${earned ? '' : '<g transform="translate(26 30)"><circle r="11" fill="#fff" stroke="#b9bfca" stroke-width="2"/><rect x="-5" y="-1" width="10" height="8" rx="1.5" fill="#8b93a3"/><path d="M-3 -1 V-4 A3 3 0 0 1 3 -4 V-1" fill="none" stroke="#8b93a3" stroke-width="2"/></g>'}
</svg>`;
}
