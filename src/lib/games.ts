// الألعاب التعليمية: كلها مبنية على أسئلة كراسة الصف الثاني المتوسط وعلى مولّدات حسابية، وتعطي تصحيحًا فوريًا مع خطوات الحل.
export const GAMES = [
  { key: 'star_race', name: 'سباق النجوم', icon: '🏁', desc: 'تتقدم السيارة في المسار مع كل إجابة صحيحة.', ready: true, color: '#f59e0b' },
  { key: 'space_numbers', name: 'رحلة الفضاء والأرقام', icon: '🚀', desc: 'كوكب لكل مجال من مجالات المحتوى، وخمس محطات في كل كوكب.', ready: true, color: '#6366f1' },
  { key: 'treasure', name: 'صندوق الكنز', icon: '🧰', desc: 'خمسة أقفال تُفتح بحل مسائل تزداد صعوبة.', ready: true, color: '#d97706' },
  { key: 'maze', name: 'متاهة العمليات', icon: '🧭', desc: 'عند كل تفرع باب صحيح واحد يقود إلى المخرج.', ready: true, color: '#0d9488' },
  { key: 'wheel', name: 'عجلة التحديات', icon: '🎡', desc: 'تحدد العجلة المجال والمستوى عشوائيًا.', ready: true, color: '#e11d48' },
  { key: 'tower', name: 'بناء برج الأعداد', icon: '🏗️', desc: 'كل إجابة صحيحة تضيف طابقًا، وثلاثة أخطاء توقف البناء.', ready: true, color: '#0284c7' },
  { key: 'patterns', name: 'مطابقة الأشكال والأنماط', icon: '🔷', desc: 'مطابقة التمثيلات المتكافئة: كسور ونسب وأسس وعبارات.', ready: true, color: '#7c3aed' },
  { key: 'timed', name: 'تحدي الوقت (اختياري)', icon: '⏱️', desc: 'للمتعة فقط؛ السرعة لا تدخل في حساب الإتقان.', ready: true, color: '#16a34a' },
] as const;
export type GameKey = (typeof GAMES)[number]['key'];
export const DOMAINS = [
  { key: 'num', name: 'الأعداد', icon: '🔢', color: '#0284c7' },
  { key: 'alg', name: 'الجبر', icon: '𝑥', color: '#7c3aed' },
  { key: 'geo', name: 'الهندسة والقياس', icon: '📐', color: '#d97706' },
  { key: 'data', name: 'البيانات والاحتمالات', icon: '📊', color: '#16a34a' },
] as const;
export type DomKey = (typeof DOMAINS)[number]['key'];

/** سؤال لعبة: من الكراسة أو مولَّد */
export interface GQ { id: string; dom: DomKey | 'gen'; d: number; p: string; o: string[]; a: number; steps: string[]; fig?: string }

// ------------------------- مولّدات حسابية -------------------------
const R = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const shuffleAns = (ans: string, wrong: string[]): { o: string[]; a: number } => {
  const set = [...new Set([ans, ...wrong])].filter((x) => x !== '').slice(0, 4);
  const base = Number(ans.replace('−', '-'));
  for (let k = 1; set.length < 4; k++) { const v = num(base + k * 7); if (!set.includes(v)) set.push(v); }
  const o = set.sort(() => Math.random() - 0.5);
  return { o, a: o.indexOf(ans) };
};
const sgn = (n: number) => (n < 0 ? `(${n})`.replace('-', '−') : String(n));
const num = (n: number) => String(n).replace('-', '−');

/** سؤال عمليات مولَّد (أعداد صحيحة، ضرب، أسس، معادلة بسيطة) */
export function genOp(level = 2): GQ {
  const kind = R(0, level >= 3 ? 4 : 3);
  if (kind === 0) { const a = R(-12, 12), b = R(-12, 12), ans = a + b; return { id: `g${Math.random()}`, dom: 'gen', d: 1, p: `${sgn(a)} + ${sgn(b)} = ?`, ...shuffleAns(num(ans), [num(a - b), num(-ans), num(ans + 1)]), steps: ['عند جمع عددين بإشارتين مختلفتين نطرح ونأخذ إشارة الأكبر قيمة مطلقة.', `الناتج ${num(ans)}.`] }; }
  if (kind === 1) { const a = R(-9, 9) || 3, b = R(-9, 9) || -4, ans = a * b; return { id: `g${Math.random()}`, dom: 'gen', d: 1, p: `${sgn(a)} × ${sgn(b)} = ?`, ...shuffleAns(num(ans), [num(-ans), num(a + b), num(ans + a)]), steps: ['الإشارتان المتشابهتان تعطيان موجبًا، والمختلفتان تعطيان سالبًا.', `الناتج ${num(ans)}.`] }; }
  if (kind === 2) { const a = R(3, 12), b = R(3, 12); return { id: `g${Math.random()}`, dom: 'gen', d: 1, p: `${a} × ${b} = ?`, ...shuffleAns(String(a * b), [String(a * b + a), String(a * b - b), String((a + 1) * b)]), steps: [`${a} × ${b} = ${a * b}.`] }; }
  if (kind === 3) { const x = R(-6, 9), a = R(2, 6), b = R(-10, 10), c = a * x + b; return { id: `g${Math.random()}`, dom: 'gen', d: 2, p: `إذا كان ${a}س ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${num(c)}، فما قيمة س؟`, ...shuffleAns(num(x), [num(x + 1), num(-x), num(c - b)]), steps: [`نطرح ${num(b)} من الطرفين: ${a}س = ${num(c - b)}.`, `نقسم على ${a}: س = ${num(x)}.`] }; }
  const base = R(2, 5), e = R(2, 4), ans = base ** e;
  return { id: `g${Math.random()}`, dom: 'gen', d: 2, p: `${base}^${e} = ?`.replace(`^${e}`, ['', '', '²', '³', '⁴'][e]), ...shuffleAns(String(ans), [String(base * e), String(ans + base), String(base ** (e - 1))]), steps: [`${base} مضروب في نفسه ${e} مرات = ${ans}.`] };
}

/** أزواج متكافئة للعبة المطابقة */
export function genPairs(n = 6): { id: number; left: string; right: string }[] {
  const pool: [string, string][] = [
    ['½', '0.5'], ['¼', '25٪'], ['¾', '0.75'], ['⅕', '20٪'], ['0.1', '10٪'], ['⅓', '0.333…'], ['⅖', '0.4'], ['1½', '1.5'],
    ['2³', '8'], ['3²', '9'], ['10²', '100'], ['5⁰', '1'], ['2⁻¹', '½'], ['√49', '7'], ['√81', '9'], ['4²', '16'],
    ['2(س + 3)', '2س + 6'], ['3س + 2س', '5س'], ['س × س', 'س²'], ['4(س − 1)', '4س − 4'],
    ['زاويتان متكاملتان', 'مجموعهما 180°'], ['زاويتان متتامتان', 'مجموعهما 90°'], ['مجموع زوايا المثلث', '180°'], ['مجموع زوايا الرباعي', '360°'],
    ['احتمال المستحيل', '0'], ['احتمال المؤكد', '1'], ['3 × 10⁴', '30000'], ['4.5 × 10²', '450'],
  ];
  return [...pool].sort(() => Math.random() - 0.5).slice(0, n).map(([l, r], i) => ({ id: i, left: l, right: r }));
}

/** اتجاه النص: العبارات العددية من اليسار إلى اليمين */
export const dirOf = (t: string) => (/[\u0621-\u064A]/.test(t) ? 'rtl' : 'ltr');
