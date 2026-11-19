// =====================================================================
// الشرح المتحرك: مشغّل يشبه الفيديو يحوّل سؤال الكراسة إلى رسوم متحركة برمجية
// (SVG + Web Animations) خطوة بخطوة، مع توقف تفاعلي لاختيار الإجابة.
// ليس فيديو مولّدًا بالذكاء الاصطناعي؛ الرسوم تُبنى في المتصفح من وصف كل مشهد.
// يعمل دون إطار: يُستعمل في المنصة عبر مكوّن React وفي المعاينة مباشرة.
// =====================================================================

export interface XItem { p: string; o: string[]; a: number; steps: string[]; fig?: string; cog?: string }
type Attrs = Record<string, string | number>;

export interface Ctx {
  svg: SVGSVGElement;
  fast: boolean;
  el(tag: string, a?: Attrs, parent?: Element): SVGElement;
  line(x1: number, y1: number, x2: number, y2: number, a?: Attrs, at?: number): SVGElement;
  poly(pts: number[][], a?: Attrs, at?: number, closed?: boolean): SVGElement;
  rect(x: number, y: number, w: number, h: number, a?: Attrs, at?: number): SVGElement;
  circle(x: number, y: number, r: number, a?: Attrs, at?: number): SVGElement;
  text(x: number, y: number, s: string, a?: Attrs, at?: number): SVGElement;
  arc(cx: number, cy: number, r: number, a0: number, a1: number, a?: Attrs, at?: number): SVGElement;
  show(el: Element, at?: number, ms?: number): void;
  pulse(el: Element, at?: number): void;
  rotate(el: Element, deg0: number, deg1: number, cx: number, cy: number, at?: number, ms?: number): void;
}
interface XStep { say: string; eq?: string; run?: (c: Ctx) => void; ask?: boolean; final?: boolean }
export interface CustomScene { init(c: Ctx): void; steps: XStep[] }

const NS = 'http://www.w3.org/2000/svg';
const C = { ink: '#262a4a', gold: '#f5b82e', aqua: '#0fa3a0', rose: '#e8466c', sky: '#4f8ef7', soft: '#eef0f8', mute: '#8a8fa8' };
const LETTERS = ['أ', 'ب', 'ج', 'د'];
const esc = (t: string) => t.replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]!);

const CSS = `
.xp{direction:rtl;font-family:inherit;color:${C.ink}}
.xp-stage{position:relative;display:grid;grid-template-columns:1.3fr 1fr;aspect-ratio:16/9;background:linear-gradient(135deg,#fffdf6,#f3f6ff);border-radius:22px;overflow:hidden;box-shadow:0 12px 30px -12px rgba(38,42,74,.35);border:1px solid rgba(38,42,74,.08)}
.xp-fig{position:relative;display:flex;align-items:center;justify-content:center;padding:14px;overflow:hidden}
.xp-fig svg.xp-main{width:100%;height:100%}
.xp-fig img.xp-img{max-width:92%;max-height:86%;border-radius:12px;background:#fff;padding:8px;box-shadow:0 6px 18px -8px rgba(38,42,74,.3);transition:transform 1.2s ease}
.xp-thumb{position:absolute;top:10px;left:10px;width:24%;background:#fff;border-radius:10px;padding:4px;box-shadow:0 4px 12px -4px rgba(38,42,74,.35);cursor:zoom-in;z-index:3}
.xp-thumb img{width:100%;display:block}.xp-thumb span{display:block;font-size:10px;color:${C.mute};text-align:center}
.xp-thumb.big{width:70%;cursor:zoom-out}
.xp-board{display:flex;flex-direction:column;gap:8px;padding:16px 14px 64px;overflow:auto;border-right:1px dashed rgba(38,42,74,.12)}
.xp-q{font-size:13px;line-height:1.8;color:${C.mute};max-height:7.5em;overflow:auto}
.xp-eq{background:#fff;border-radius:12px;padding:8px 12px;font-weight:700;line-height:1.8;box-shadow:0 3px 10px -6px rgba(38,42,74,.35);border-right:4px solid ${C.gold}}
.xp-eq.final{border-color:${C.aqua};background:#e9fbf8}
.xp-sub{position:absolute;inset-inline:12px;bottom:12px;z-index:4;background:rgba(38,42,74,.88);color:#fff;border-radius:14px;padding:9px 14px;font-weight:700;line-height:1.7;text-align:center;font-size:15px}
.xp-sub:empty{display:none}
.xp-ask{position:absolute;inset:0;z-index:5;background:rgba(255,253,246,.97);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px}
.xp-ask b{font-size:20px}.xp-ask .xp-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:min(560px,100%)}
.xp-ask button{background:#fff;border:2px solid rgba(38,42,74,.12);border-radius:14px;padding:10px 12px;font:inherit;font-weight:700;cursor:pointer;text-align:start}
.xp-ask button:hover{border-color:${C.gold}}.xp-ask button.ok{border-color:${C.aqua};background:#e9fbf8}.xp-ask button.no{border-color:${C.rose};background:#fdecef}
.xp-bar{display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap}
.xp-bar button{border:0;background:${C.ink};color:#fff;border-radius:12px;min-width:40px;height:38px;padding:0 12px;font:inherit;font-weight:800;cursor:pointer}
.xp-bar button.ghost{background:#fff;color:${C.ink};border:1px solid rgba(38,42,74,.15)}
.xp-segs{display:flex;gap:4px;flex:1;min-width:140px}
.xp-segs i{flex:1;height:8px;border-radius:9px;background:rgba(38,42,74,.12);cursor:pointer;overflow:hidden;position:relative}
.xp-segs i.done{background:${C.gold}}.xp-segs i.cur::after{content:'';position:absolute;inset:0;background:${C.gold};transform-origin:right;animation:xpfill var(--d) linear forwards}
.xp-segs i.cur.paused::after{animation-play-state:paused}
@keyframes xpfill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.xp-note{font-size:11px;color:${C.mute};margin-top:6px}
.xp-big{font-size:22px;font-weight:800;line-height:2;padding:12px;text-align:center}
.xp-big mark{background:#fff3cf;color:${C.ink};border-radius:8px;padding:0 6px;display:inline-block;animation:xppop .5s ease both}
@keyframes xppop{from{transform:scale(.4);opacity:0}to{transform:none;opacity:1}}
@media (max-width:700px){.xp-stage{grid-template-columns:1fr;aspect-ratio:auto}.xp-fig{height:250px}.xp-board{border-right:0;padding-bottom:80px}.xp-sub{font-size:13px}}
`;

function injectCss() {
  if (typeof document === 'undefined' || document.getElementById('xp-css')) return;
  const s = document.createElement('style'); s.id = 'xp-css'; s.textContent = CSS; document.head.appendChild(s);
}

function makeCtx(svg: SVGSVGElement, fast: boolean): Ctx {
  const set = (e: Element, a: Attrs = {}) => { for (const k in a) e.setAttribute(k, String(a[k])); return e as SVGElement; };
  const el = (tag: string, a: Attrs = {}, parent: Element = svg) => { const e = set(document.createElementNS(NS, tag), a); parent.appendChild(e); return e; };
  const show = (e: Element, at = 0, ms = 500) => {
    if (fast) return;
    (e as SVGElement).style.opacity = '0';
    e.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: ms, delay: at, fill: 'forwards', easing: 'ease-out' })
      .onfinish = () => { (e as SVGElement).style.opacity = '1'; };
  };
  const draw = (e: SVGElement, at = 0, ms = 700) => {
    if (fast) return;
    const g = e as unknown as SVGGeometryElement; const len = g.getTotalLength ? g.getTotalLength() : 300;
    e.style.strokeDasharray = `${len}`; e.style.strokeDashoffset = `${len}`;
    e.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: ms, delay: at, fill: 'forwards', easing: 'ease-in-out' })
      .onfinish = () => { e.style.strokeDasharray = ''; e.style.strokeDashoffset = ''; };
  };
  const base = { stroke: C.ink, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  return {
    svg, fast, el, show,
    line: (x1, y1, x2, y2, a = {}, at = 0) => { const e = el('line', { ...base, x1, y1, x2, y2, ...a }); draw(e, at); return e; },
    poly: (pts, a = {}, at = 0, closed = true) => { const e = el(closed ? 'polygon' : 'polyline', { ...base, points: pts.map((p) => p.join(',')).join(' '), ...a }); if (a.fill && a.fill !== 'none') show(e, at); else draw(e, at); return e; },
    rect: (x, y, w, h, a = {}, at = 0) => { const e = el('rect', { ...base, x, y, width: w, height: h, rx: 2, ...a }); if (a.fill && a.fill !== 'none') show(e, at); else draw(e, at); return e; },
    circle: (x, y, r, a = {}, at = 0) => { const e = el('circle', { ...base, cx: x, cy: y, r, ...a }); if (a.fill && a.fill !== 'none') show(e, at); else draw(e, at); return e; },
    text: (x, y, s, a = {}, at = 0) => { const e = el('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-size': 18, 'font-weight': 800, fill: C.ink, ...a }); e.textContent = s; show(e, at); return e; },
    arc: (cx, cy, r, a0, a1, a = {}, at = 0) => {
      const p = (d: number) => [cx + r * Math.cos((d * Math.PI) / 180), cy - r * Math.sin((d * Math.PI) / 180)];
      const [x0, y0] = p(a0), [x1, y1] = p(a1); const large = Math.abs(a1 - a0) > 180 ? 1 : 0; const sweep = a1 > a0 ? 0 : 1;
      const e = el('path', { ...base, 'stroke-width': 2.5, d: `M${x0},${y0} A${r},${r} 0 ${large} ${sweep} ${x1},${y1}`, ...a }); draw(e, at, 500); return e;
    },
    pulse: (e, at = 0) => { if (!fast) e.animate([{ opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }], { duration: 1400, delay: at }); },
    rotate: (e, d0, d1, cx, cy, at = 0, ms = 900) => {
      const g = e as SVGElement; g.style.transformOrigin = `${cx}px ${cy}px`; g.style.transformBox = 'view-box';
      if (fast) { g.style.transform = `rotate(${d1}deg)`; return; }
      g.animate([{ transform: `rotate(${d0}deg)` }, { transform: `rotate(${d1}deg)` }], { duration: ms, delay: at, fill: 'forwards', easing: 'cubic-bezier(.3,1.3,.5,1)' }).onfinish = () => { g.style.transform = `rotate(${d1}deg)`; };
    },
  };
}

// ---------------------------------------------------------------------
// مشاهد مرسومة خصيصًا لأسئلة الكراسة (المفتاح = اسم شكل السؤال)
// ---------------------------------------------------------------------
const W = 480, H = 320;
function matchSquares(c: Ctx, n: number, x0: number, y0: number, s: number, at = 0, gap = 90) {
  for (let i = 0; i < n; i++) {
    const x = x0 + i * s, t = at + i * gap * 3;
    if (i === 0) c.line(x, y0, x, y0 + s, { stroke: C.gold, 'stroke-width': 6 }, t);
    c.line(x, y0, x + s, y0, { stroke: C.gold, 'stroke-width': 6 }, t + gap);
    c.line(x, y0 + s, x + s, y0 + s, { stroke: C.gold, 'stroke-width': 6 }, t + gap * 2);
    c.line(x + s, y0, x + s, y0 + s, { stroke: C.gold, 'stroke-width': 6 }, t + gap * 3);
  }
}
function spinner(c: Ctx, cx: number, cy: number, r: number, n: number, hl: (k: number) => string | null) {
  const cols = ['#f6b26b', '#7fc8a9', '#c86b85', '#8f86d6', '#e4d3a0', '#4fb0c6', '#f08a5d', '#9ccb6a'];
  const g = c.el('g', {});
  const secs: SVGElement[] = [];
  for (let k = 0; k < n; k++) {
    const a0 = 90 - (k * 360) / n, a1 = 90 - ((k + 1) * 360) / n;
    const p = (d: number) => [cx + r * Math.cos((d * Math.PI) / 180), cy - r * Math.sin((d * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    const e = c.el('path', { d: `M${cx},${cy} L${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1} Z`, fill: hl(k + 1) ?? cols[k % cols.length], stroke: '#fff', 'stroke-width': 3 }, g);
    secs.push(e);
    const [tx, ty] = p((a0 + a1) / 2).map((v, i) => (i ? cy + (v - cy) * 0.62 : cx + (v - cx) * 0.62));
    const t = c.el('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-size': 20, 'font-weight': 900, fill: C.ink }, g); t.textContent = String(k + 1);
  }
  return { g, secs };
}

export const SCENES: Record<string, CustomScene> = {
  'n06-1': {
    init(c) { c.line(40, 170, 440, 170); for (let i = 0; i <= 16; i++) { const x = 40 + i * 25; c.line(x, 162, x, 178, { 'stroke-width': i % 8 ? 2 : 3 }); } c.text(40, 200, '0'); c.text(440, 200, '1'); },
    steps: [
      { say: 'نقسم المسافة من 0 إلى 1 إلى ستة عشر جزءًا متساويًا، لأن 0.4375 = 7 ÷ 16.', eq: '0.4375 = 4375 ÷ 10000 = 7/16', run: (c) => { c.text(240, 120, '0.4375 = 7/16', { fill: C.aqua, 'font-size': 24 }); } },
      { say: 'نحدد ⅜ أي 6 من 16، ونحدد ½ أي 8 من 16.', eq: '⅜ = 6/16 ، ½ = 8/16', run: (c) => { c.text(190, 140, '⅜', { fill: C.sky }); c.circle(190, 170, 6, { fill: C.sky, stroke: 'none' }); c.text(240, 140, '½', { fill: C.sky }, 200); c.circle(240, 170, 6, { fill: C.sky, stroke: 'none' }, 200); } },
      { say: 'العدد 7/16 يقع في منتصف المسافة بين ⅜ و ½.', run: (c) => { const p = c.circle(215, 170, 10, { fill: C.rose, stroke: '#fff' }); c.text(215, 215, '7/16', { fill: C.rose }); c.pulse(p, 400); } },
      { say: 'توقف وفكّر: أي نقطة في الشكل تمثل هذا العدد؟', ask: true },
    ],
  },
  'n08-1': {
    init(c) { for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) c.rect(140 + k * 40, 70 + r * 40, 40, 40, { 'stroke-width': 2 }); },
    steps: [
      { say: 'نعدّ مربعات الشكل كلها: أربعة صفوف في كل صف خمسة، أي 20 مربعًا.', eq: '4 × 5 = 20', run: (c) => c.text(240, 255, '20 مربعًا', { fill: C.sky }) },
      { say: 'نعدّ المربعات المظللة: ستة.', eq: 'المظلل = 6', run: (c) => { for (let i = 0; i < 6; i++) c.rect(140 + (i % 5) * 40 + 2, 70 + Math.floor(i / 5) * 40 + 2, 36, 36, { fill: C.gold, stroke: 'none', opacity: 0.85 }, i * 220); } },
      { say: 'الكسر 6 من 20، ونضرب البسط والمقام في 5 ليصبح المقام 100.', eq: '6/20 = 30/100', run: (c) => c.text(240, 285, '6/20 = 30/100', { fill: C.aqua, 'font-size': 22 }) },
      { say: 'توقف وفكّر: ما الكسر العشري المناظر؟', ask: true },
    ],
  },
  'n12-6': {
    init(c) {
      const T = (r: number, k: number, up: boolean) => { const s = 60, x = 240 - (r + 1) * 30 + k * 30, y = 40 + r * 60;
        return up ? [[x, y + 60], [x + s, y + 60], [x + s / 2, y]] : [[x, y], [x + s, y], [x + s / 2, y + 60]]; };
      for (let r = 0; r < 4; r++) for (let k = 0; k < 2 * r + 1; k++) { const up = k % 2 === 0; c.poly(T(r, k, up), { 'stroke-width': 2, fill: up ? 'rgba(245,184,46,.0)' : 'none', 'data-up': up ? 1 : 0, class: up ? 'up' : 'dn' }); }
    },
    steps: [
      { say: 'الشكل مقسم إلى مثلثات صغيرة متطابقة: في الصفوف 1 و 3 و 5 و 7 مثلثًا، أي 16 مثلثًا.', eq: '1 + 3 + 5 + 7 = 16' },
      { say: 'المثلثات المظللة هي المتجهة إلى الأعلى: 1 + 2 + 3 + 4 = 10.', eq: 'المظلل = 10', run: (c) => { c.svg.querySelectorAll('.up').forEach((e, i) => { e.setAttribute('fill', C.gold); c.show(e, i * 120); }); } },
      { say: 'وغير المظللة 16 − 10 = 6، فالنسبة 10 إلى 6 أي 5 إلى 3.', eq: '10 : 6 = 5 : 3', run: (c) => c.text(240, 300, '10 : 6 = 5 : 3', { fill: C.aqua, 'font-size': 22 }) },
      { say: 'توقف وفكّر: ما النسبة المطلوبة؟', ask: true },
    ],
  },
  'a17-3': {
    init(c) { c.text(240, 30, 'نبني الشكل عودًا عودًا', { fill: C.mute, 'font-size': 15 }); },
    steps: [
      { say: 'نبني ثلاثة مربعات متجاورة: الأول يحتاج 4 أعواد، وكل مربع جديد يحتاج 3 أعواد فقط.', eq: 'المربعات: 4 + 3 + 3 = 10', run: (c) => matchSquares(c, 3, 80, 110, 80, 0, 80) },
      { say: 'ثم نضيف المثلث في النهاية بعودين، فيصبح المجموع 12 عودًا.', eq: '10 + 2 = 12 ✓', run: (c) => { c.line(320, 110, 380, 150, { stroke: C.rose, 'stroke-width': 6 }); c.line(380, 150, 320, 190, { stroke: C.rose, 'stroke-width': 6 }, 300); } },
      { say: 'القاعدة: n مربعًا تحتاج 3n + 1 عودًا، والمثلث عودان، أي 3n + 3.', eq: '3n + 3 = 48', run: (c) => c.text(240, 250, '3n + 3 = 48', { fill: C.aqua, 'font-size': 26 }) },
      { say: 'نحل المعادلة: 3n = 45، إذن n = 15.', eq: 'n = 15', run: (c) => c.text(240, 290, 'n = 15', { fill: C.rose, 'font-size': 26 }) },
      { say: 'توقف وفكّر: كم مربعًا في الشكل الذي يحتاج 48 عودًا؟', ask: true },
    ],
  },
  'a20-5': {
    init() { /* يُبنى في الخطوات */ },
    steps: [
      { say: 'المثلث الأول يحتاج 3 أعواد، وكل مثلث جديد يشارك ضلعًا مع السابق فيحتاج عودين.', eq: '3, 5, 7, 9, 11', run: (c) => {
        for (let i = 0; i < 5; i++) { const x = 60 + i * 36, up = i % 2 === 0, t = i * 350;
          if (up) { if (i === 0) c.line(x, 180, x + 36, 110, { stroke: C.gold, 'stroke-width': 6 }, t); c.line(x + 36, 110, x + 72, 180, { stroke: C.gold, 'stroke-width': 6 }, t + 120); c.line(x, 180, x + 72, 180, { stroke: C.gold, 'stroke-width': 6 }, t + 240); }
          else { c.line(x + 36, 180, x + 72, 110, { stroke: C.gold, 'stroke-width': 6 }, t + 120); c.line(x, 110, x + 72, 110, { stroke: C.gold, 'stroke-width': 6 }, t + 240); } } } },
      { say: 'خمسة مثلثات تحتاج 11 عودًا، فالقاعدة: عدد الأعواد = 2n + 1.', eq: '2 × 5 + 1 = 11 ✓', run: (c) => c.text(240, 230, '2n + 1', { fill: C.aqua, 'font-size': 28 }) },
      { say: 'لدينا 63 عودًا: 2n + 1 = 63، إذن n = 31.', eq: '2n = 62 ⇐ n = 31', run: (c) => c.text(240, 280, '2n + 1 = 63 ⇐ n = 31', { fill: C.rose, 'font-size': 22 }) },
      { say: 'توقف وفكّر: كم مثلثًا يمكن عمله؟', ask: true },
    ],
  },
  'a26-4': {
    init() { /* يُبنى في الخطوات */ },
    steps: [
      { say: 'البيت الأول: مربع ومثلث فوقه، أي 6 أعواد.', eq: 'الشكل 1 = 6', run: (c) => { matchSquares(c, 1, 60, 150, 60); c.line(60, 150, 90, 100, { stroke: C.rose, 'stroke-width': 6 }, 500); c.line(90, 100, 120, 150, { stroke: C.rose, 'stroke-width': 6 }, 650); } },
      { say: 'كل بيت جديد يشارك الجدار، فيضيف 5 أعواد فقط.', eq: '6، 11، 16، ...', run: (c) => { for (let i = 1; i < 3; i++) { const x = 60 + i * 60, t = i * 900;
        c.line(x, 150, x + 60, 150, { stroke: C.gold, 'stroke-width': 6 }, t); c.line(x, 210, x + 60, 210, { stroke: C.gold, 'stroke-width': 6 }, t + 120); c.line(x + 60, 150, x + 60, 210, { stroke: C.gold, 'stroke-width': 6 }, t + 240);
        c.line(x, 150, x + 30, 100, { stroke: C.rose, 'stroke-width': 6 }, t + 360); c.line(x + 30, 100, x + 60, 150, { stroke: C.rose, 'stroke-width': 6 }, t + 480); } } },
      { say: 'القاعدة: الشكل رقم n يحتاج 5n + 1 عودًا.', eq: '5n + 1', run: (c) => c.text(360, 160, '5n + 1', { fill: C.aqua, 'font-size': 28 }) },
      { say: 'الشكل العاشر: 5 × 10 + 1 = 51 عودًا.', eq: '5 × 10 + 1 = 51', run: (c) => c.text(240, 280, '5 × 10 + 1 = 51', { fill: C.rose, 'font-size': 24 }) },
      { say: 'توقف وفكّر: كم عودًا يلزم للشكل 10؟', ask: true },
    ],
  },
  'a28-9': {
    init(c) { c.text(240, 24, 'ميزانان', { fill: C.mute, 'font-size': 15 }); },
    steps: [
      { say: 'في الميزان الأول: قطعة واحدة مقابل أثقال مجموعها 13 جرامًا، وكفة الأثقال هي الأثقل.', eq: '6 + 3 + 2 + 2 = 13', run: (c) => {
        c.poly([[120, 200], [105, 230], [135, 230]], { fill: C.ink }); const g = c.el('g', {});
        c.el('line', { x1: 40, y1: 200, x2: 200, y2: 200, stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
        c.el('circle', { cx: 60, cy: 186, r: 12, fill: C.gold }, g); const t = c.el('text', { x: 60, y: 190, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900 }, g); t.textContent = 'س';
        c.el('rect', { x: 150, y: 172, width: 40, height: 26, rx: 4, fill: C.sky }, g); const t2 = c.el('text', { x: 170, y: 190, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#fff' }, g); t2.textContent = '13';
        c.rotate(g, 0, 10, 120, 200, 400); } },
      { say: 'الكفة التي فيها 13 جرامًا نزلت، إذن كتلة القطعة أقل من 13.', eq: 'س < 13', run: (c) => c.text(120, 270, 'س < 13', { fill: C.rose, 'font-size': 24 }) },
      { say: 'في الميزان الثاني: ثلاث قطع مقابل 18 جرامًا، وكفة القطع هي الأثقل.', eq: '3س > 18', run: (c) => {
        c.poly([[360, 200], [345, 230], [375, 230]], { fill: C.ink }); const g = c.el('g', {});
        c.el('line', { x1: 280, y1: 200, x2: 440, y2: 200, stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
        for (let i = 0; i < 3; i++) c.el('circle', { cx: 290 + i * 24, cy: 186, r: 11, fill: C.gold }, g);
        c.el('rect', { x: 390, y: 172, width: 40, height: 26, rx: 4, fill: C.sky }, g); const t2 = c.el('text', { x: 410, y: 190, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#fff' }, g); t2.textContent = '18';
        c.rotate(g, 0, -10, 360, 200, 400); } },
      { say: 'نقسم على 3: س أكبر من 6. نجمع الشرطين معًا.', eq: '6 < س < 13', run: (c) => { c.text(360, 270, 'س > 6', { fill: C.rose, 'font-size': 24 }); c.text(240, 305, '6 < س < 13', { fill: C.aqua, 'font-size': 26 }, 500); } },
      { say: 'توقف وفكّر: ما المتباينة الصحيحة؟', ask: true },
    ],
  },
  'a18-8': {
    init(c) { c.line(60, 280, 440, 280, { 'stroke-width': 2 }); c.line(60, 280, 60, 30, { 'stroke-width': 2 }); for (let i = 1; i <= 6; i++) { c.text(60 + i * 60, 298, String(i), { 'font-size': 13 }); c.line(55, 280 - i * 40, 65, 280 - i * 40, { 'stroke-width': 2 }); c.text(40, 280 - i * 40, String(i * 10), { 'font-size': 13 }); } c.text(250, 316, 'الزمن', { 'font-size': 12, fill: C.mute }); },
    steps: [
      { say: 'نقرأ الرسم: الخزان يبدأ بـ 10 لترات، ويزيد 5 لترات في كل وحدة زمنية.', eq: 'ص = 5س + 10', run: (c) => { c.line(60, 240, 420, 120, { stroke: C.sky, 'stroke-width': 4 }); c.circle(60, 240, 7, { fill: C.gold, stroke: 'none' }, 600); c.text(330, 135, 'ص = 5س + 10', { fill: C.sky, 'font-size': 16 }, 700); } },
      { say: 'المضخة الجديدة بضعف المعدل: 10 لترات في كل وحدة، والبداية تبقى 10 لترات.', eq: 'الميل: 5 ← 10', run: (c) => { c.line(60, 240, 360, 40, { stroke: C.rose, 'stroke-width': 4 }); c.text(230, 70, 'ص = 10س + 10', { fill: C.rose, 'font-size': 16 }, 700); } },
      { say: 'الخطان يبدآن من النقطة نفسها، لكن الجديد أشد انحدارًا.', eq: 'ص = 10س + 10' },
      { say: 'توقف وفكّر: ما الدالة الجديدة؟', ask: true },
    ],
  },
  'g37-2': {
    init(c) { c.line(40, 80, 440, 80, { 'stroke-width': 3 }); c.line(40, 250, 440, 250, { 'stroke-width': 3 }); c.line(240, 80, 97, 250); c.line(240, 80, 383, 250); c.text(460, 80, '∥', { 'font-size': 20 }); c.text(460, 250, '∥', { 'font-size': 20 }); },
    steps: [
      { say: 'الزاوية المعطاة 50° بين المستقيم العلوي والضلع الأيسر للمثلث.', eq: 'الزاوية المعطاة = 50°', run: (c) => { c.arc(240, 80, 34, 180, 230, { stroke: C.gold, 'stroke-width': 4 }); c.text(186, 98, '50°', { fill: C.gold }); } },
      { say: 'بالتبادل بين المستقيمين المتوازيين: زاوية القاعدة اليسرى تساوي 50° أيضًا.', eq: 'زاوية القاعدة اليسرى = 50°', run: (c) => { c.arc(97, 250, 34, 0, 50, { stroke: C.gold, 'stroke-width': 4 }); c.text(150, 236, '50°', { fill: C.gold }); } },
      { say: 'المثلث متطابق الضلعين، فزاويتا القاعدة متساويتان: الأخرى 50°.', eq: 'زاوية القاعدة اليمنى = 50°', run: (c) => { c.arc(383, 250, 34, 130, 180, { stroke: C.aqua, 'stroke-width': 4 }); c.text(330, 236, '50°', { fill: C.aqua }); } },
      { say: 'وبالتبادل مرة أخرى: الزاوية ص عند المستقيم العلوي تساوي 50°.', eq: 'ص = 50°', run: (c) => { c.arc(240, 80, 34, -50, 0, { stroke: C.rose, 'stroke-width': 4 }); c.text(292, 98, 'ص', { fill: C.rose }); } },
      { say: 'توقف وفكّر: ما قياس الزاوية ص؟', ask: true },
    ],
  },
  'g38-7': {
    init(c) { c.line(40, 280, 440, 280, { stroke: '#7a9a5c', 'stroke-width': 4 }); c.rect(300, 40, 26, 240, { fill: '#b58b5a', stroke: 'none' }); c.circle(313, 40, 36, { fill: '#7fc8a9', stroke: 'none' }); },
    steps: [
      { say: 'السلم والشجرة والأرض تكوّن مثلثًا قائم الزاوية، والسلم هو الوتر.', eq: 'الوتر = 10 أقدام', run: (c) => { c.line(140, 280, 300, 67, { stroke: C.gold, 'stroke-width': 7 }); c.text(200, 160, '10', { fill: C.gold }); c.rect(286, 266, 14, 14, { 'stroke-width': 2 }); } },
      { say: 'بُعد قاعدة السلم عن الشجرة 6 أقدام.', eq: 'الضلع الأفقي = 6', run: (c) => { c.line(140, 296, 300, 296, { stroke: C.sky, 'stroke-width': 3 }); c.text(220, 312, '6', { fill: C.sky }); } },
      { say: 'نظرية فيثاغورس: مربع الارتفاع = 10² − 6² = 100 − 36 = 64.', eq: 'ع² = 100 − 36 = 64', run: (c) => { c.line(316, 67, 316, 280, { stroke: C.rose, 'stroke-width': 4 }); c.text(345, 175, 'ع', { fill: C.rose }); } },
      { say: 'الجذر التربيعي للعدد 64 هو 8، فالسلم يصل إلى ارتفاع 8 أقدام.', eq: 'ع = √64 = 8', run: (c) => c.text(385, 175, '= 8', { fill: C.rose, 'font-size': 24 }) },
      { say: 'توقف وفكّر: إلى أي ارتفاع وصل السلم؟', ask: true },
    ],
  },
  'g43-10': {
    init(c) { c.rect(135, 30, 210, 210, { fill: '#dde8ff', stroke: C.ink }); },
    steps: [
      { say: 'مساحة المربع الكبير 49 م²، إذن طول ضلعه 7 م.', eq: '√49 = 7', run: (c) => c.text(240, 262, '7 م', { fill: C.sky }) },
      { say: 'المربع الصغير يبعد 2 م عن كل ضلع، فنطرح 2 من كل جهة.', eq: '7 − 2 − 2 = 3', run: (c) => { c.line(135, 135, 195, 135, { stroke: C.rose }); c.text(165, 120, '2', { fill: C.rose }); c.line(285, 135, 345, 135, { stroke: C.rose }, 300); c.text(315, 120, '2', { fill: C.rose }, 300); c.rect(195, 90, 90, 90, { fill: C.gold, stroke: C.ink }, 600); } },
      { say: 'ضلع المربع الصغير 3 م، فمساحته 3 × 3 = 9 م².', eq: '3² = 9 م²', run: (c) => c.text(240, 135, '9', { 'font-size': 26 }) },
      { say: 'توقف وفكّر: ما مساحة المربع الصغير؟', ask: true },
    ],
  },
  'g44-4': {
    init(c) { c.rect(90, 90, 300, 150, { fill: '#dde8ff' }); c.text(240, 262, '20 سم', { 'font-size': 14 }); c.text(70, 165, '10', { 'font-size': 14 }); },
    steps: [
      { say: 'مساحة المستطيل كاملًا: 20 × 10 = 200 سم².', eq: '20 × 10 = 200', run: (c) => c.text(240, 165, '200', { 'font-size': 26 }) },
      { say: 'نقتطع نصف دائرة من كل طرف، نصف قطرها 5 سم.', run: (c) => { c.el('path', { d: 'M90,90 A75,75 0 0 1 90,240', fill: '#fffdf6', stroke: C.rose, 'stroke-width': 3 }); c.el('path', { d: 'M390,90 A75,75 0 0 0 390,240', fill: '#fffdf6', stroke: C.rose, 'stroke-width': 3 }); } },
      { say: 'نصفا الدائرتين معًا دائرة كاملة مساحتها ط × 5² ≈ 78.5 سم².', eq: 'ط × 25 ≈ 78.5', run: (c) => c.text(240, 60, 'نصفان = دائرة واحدة', { fill: C.rose, 'font-size': 16 }) },
      { say: 'مساحة الشكل: 200 − 78.5 = 121.5 سم².', eq: '200 − 78.5 = 121.5', run: (c) => c.text(240, 295, '121.5 سم²', { fill: C.aqua, 'font-size': 24 }) },
      { say: 'توقف وفكّر: ما مساحة الشكل؟', ask: true },
    ],
  },
  'g52-8': {
    init(c) { c.circle(240, 160, 125, { stroke: C.ink }); c.rect(140, 85, 200, 150, { fill: '#dde8ff' }); c.text(240, 255, '8', { 'font-size': 15 }); c.text(125, 160, '6', { 'font-size': 15 }); },
    steps: [
      { say: 'رؤوس المستطيل على الدائرة، فقطر المستطيل هو قطر الدائرة.', run: (c) => c.line(140, 235, 340, 85, { stroke: C.rose, 'stroke-width': 4 }) },
      { say: 'طول القطر بنظرية فيثاغورس: √(8² + 6²) = √100 = 10 سم.', eq: '√(64 + 36) = 10', run: (c) => c.text(270, 150, '10', { fill: C.rose, 'font-size': 22 }) },
      { say: 'نصف القطر 5 سم، فمساحة الدائرة ط × 25 ≈ 78.5 سم².', eq: '3.14 × 25 ≈ 78.5', run: (c) => { c.circle(240, 160, 6, { fill: C.ink, stroke: 'none' }); c.text(240, 300, 'م ≈ 78.5 سم²', { fill: C.aqua, 'font-size': 22 }); } },
      { say: 'توقف وفكّر: ما مساحة الدائرة؟', ask: true },
    ],
  },
  'g51-6': {
    init(c) { const pts = Array.from({ length: 6 }, (_, k) => [220 + 95 * Math.cos((k * 60 * Math.PI) / 180), 160 - 95 * Math.sin((k * 60 * Math.PI) / 180)]); c.poly(pts, { fill: '#dde8ff' }); },
    steps: [
      { say: 'مجموع زوايا السداسي الداخلية (6 − 2) × 180° = 720°.', eq: '(6 − 2) × 180 = 720' },
      { say: 'السداسي منتظم، فكل زاوية داخلية 720 ÷ 6 = 120°.', eq: '720 ÷ 6 = 120°', run: (c) => { c.arc(315, 160, 30, 120, 240, { stroke: C.sky, 'stroke-width': 4 }); c.text(270, 160, '120°', { fill: C.sky, 'font-size': 15 }); } },
      { say: 'نمد أحد الأضلاع؛ الزاوية الخارجية تكمل الداخلية إلى 180°.', eq: '180 − 120 = 60°', run: (c) => { c.line(315, 160, 370, 255, { stroke: C.rose, 'stroke-dasharray': '6 6' }); c.arc(315, 160, 34, 240, 300, { stroke: C.rose, 'stroke-width': 4 }, 400); c.text(350, 210, '1', { fill: C.rose }, 500); } },
      { say: 'توقف وفكّر: ما قياس الزاوية 1؟', ask: true },
    ],
  },
  'd57-1': {
    init(c) { const v = [5, 10, 20, 35, 25, 15], lb = ['10', '20', '30', '40', '50', '60']; c.line(60, 280, 440, 280, { 'stroke-width': 2 });
      v.forEach((h, i) => { c.rect(70 + i * 60, 280 - h * 6.5, 56, h * 6.5, { fill: '#c9d6f7', stroke: C.ink, 'stroke-width': 1.5, class: 'bar' + i }, i * 120); c.text(98 + i * 60, 298, lb[i] + '–' + (+lb[i] + 9), { 'font-size': 11 }); c.text(98 + i * 60, 268 - h * 6.5, String(h), { 'font-size': 13 }); }); },
    steps: [
      { say: 'كل عمود يمثل عدد الطلاب في فئة زمنية. «50 دقيقة على الأقل» تعني 50 دقيقة فأكثر.', eq: '50 فأكثر' },
      { say: 'العمودان المطلوبان: الفئة 50 إلى 59 وفيها 25 طالبًا، والفئة 60 إلى 69 وفيها 15 طالبًا.', eq: '25 و 15', run: (c) => { ['.bar4', '.bar5'].forEach((s, i) => { const e = c.svg.querySelector(s)!; e.setAttribute('fill', C.gold); c.pulse(e, i * 300); }); } },
      { say: 'نجمعهما: 25 + 15 = 40 طالبًا.', eq: '25 + 15 = 40', run: (c) => c.text(380, 70, '40 طالبًا', { fill: C.aqua, 'font-size': 22 }) },
      { say: 'توقف وفكّر: كم طالبًا استغرق 50 دقيقة على الأقل؟', ask: true },
    ],
  },
  'd58-5': {
    init(c) { for (let k = 0; k < 10; k++) { const a0 = 90 - k * 36, a1 = a0 - 36, p = (d: number) => [240 + 120 * Math.cos((d * Math.PI) / 180), 160 - 120 * Math.sin((d * Math.PI) / 180)]; const [x0, y0] = p(a0), [x1, y1] = p(a1);
      c.el('path', { d: `M240,160 L${x0},${y0} A120,120 0 0 1 ${x1},${y1} Z`, fill: '#e3e8f7', stroke: '#fff', 'stroke-width': 3, class: 'sl' + k }); } },
    steps: [
      { say: 'نقسم الدائرة إلى 10 أجزاء متساوية، كل جزء 10٪ من الطلاب.', eq: '10٪ من 250 = 25', run: (c) => c.text(240, 300, 'كل جزء = 25 طالبًا', { fill: C.sky, 'font-size': 16 }) },
      { say: 'الرياضة 30٪، أي ثلاثة أجزاء.', eq: '30٪ = 3 أجزاء', run: (c) => { for (let k = 0; k < 3; k++) { const e = c.svg.querySelector('.sl' + k)!; e.setAttribute('fill', C.gold); c.show(e, k * 300); } } },
      { say: 'ثلاثة أجزاء × 25 = 75 طالبًا.', eq: '3 × 25 = 75', run: (c) => c.text(240, 24, '75 طالبًا', { fill: C.aqua, 'font-size': 22 }) },
      { say: 'توقف وفكّر: كم طالبًا يفضل الرياضة؟', ask: true },
    ],
  },
  'd67-1': {
    init(c) { spinner(c, 240, 165, 120, 6, () => null); c.poly([[240, 30], [228, 8], [252, 8]], { fill: C.ink }); },
    steps: [
      { say: 'القرص فيه ستة أقسام متساوية، فعدد النواتج الممكنة 6.', eq: 'النواتج = 6' },
      { say: 'الأعداد الزوجية: 2 و 4 و 6، أي ثلاثة نواتج.', eq: '{2، 4، 6}', run: (c) => { const s = spinner(c, 240, 165, 120, 6, (k) => (k % 2 ? '#e3e8f7' : C.gold)); c.show(s.g, 0, 700); } },
      { say: 'الاحتمال = 3 ÷ 6 = ½.', eq: '3/6 = ½', run: (c) => c.text(420, 300, 'ح = ½', { fill: C.aqua, 'font-size': 24 }) },
      { say: 'توقف وفكّر: ما احتمال أن يشير السهم إلى عدد زوجي؟', ask: true },
    ],
  },
  'd69-4': {
    init(c) { spinner(c, 240, 165, 120, 6, () => '#e3e8f7'); c.poly([[240, 30], [228, 8], [252, 8]], { fill: C.ink }); },
    steps: [
      { say: 'الحادث (أ): عدد زوجي، أي 2 و 4 و 6.', eq: 'أ = {2، 4، 6}', run: (c) => { const s = spinner(c, 240, 165, 120, 6, (k) => (k % 2 ? '#e3e8f7' : C.gold)); c.show(s.g, 0, 600); } },
      { say: 'الحادث (ب): عدد أكبر من 4، أي 5 و 6.', eq: 'ب = {5، 6}', run: (c) => { const s = spinner(c, 240, 165, 120, 6, (k) => (k === 5 || k === 6 ? C.rose : k % 2 ? '#e3e8f7' : C.gold)); c.show(s.g, 0, 600); } },
      { say: '(أ) أو (ب) يعني أي عدد من الحادثين دون تكرار: 2 و 4 و 5 و 6.', eq: '{2، 4، 5، 6} = 4 نواتج', run: (c) => { const s = spinner(c, 240, 165, 120, 6, (k) => ([2, 4, 5, 6].includes(k) ? C.aqua : '#e3e8f7')); c.show(s.g, 0, 600); } },
      { say: 'الاحتمال 4 ÷ 6 = ⅔.', eq: '4/6 = ⅔', run: (c) => c.text(420, 300, 'ح = ⅔', { fill: C.aqua, 'font-size': 24 }) },
      { say: 'توقف وفكّر: ما احتمال (أ) أو (ب)؟', ask: true },
    ],
  },
  'd63-2': {
    init(c) { c.line(50, 250, 430, 250, { 'stroke-width': 2 }); for (let v = 1; v <= 10; v++) { c.line(50 + v * 36, 245, 50 + v * 36, 255, { 'stroke-width': 2 }); c.text(50 + v * 36, 272, String(v), { 'font-size': 13 }); } },
    steps: [
      { say: 'نضع نقطة فوق كل قيمة: 2، 4، 4، 5، 5، 5، 6، 6، 7، 9، 10.', eq: '11 قيمة', run: (c) => { const d = [2, 4, 4, 5, 5, 5, 6, 6, 7, 9, 10]; const h: Record<number, number> = {}; d.forEach((v, i) => { h[v] = (h[v] ?? 0) + 1; c.circle(50 + v * 36, 250 - h[v] * 26, 10, { fill: v === 5 ? C.gold : C.sky, stroke: 'none' }, i * 150); }); } },
      { say: 'المنوال هو الأكثر تكرارًا: 5. والوسيط هو القيمة السادسة بعد الترتيب: 5 أيضًا.', eq: 'المنوال = 5 ، الوسيط = 5', run: (c) => c.text(230, 120, 'الوسيط = المنوال = 5', { fill: C.gold, 'font-size': 18 }) },
      { say: 'المدى = أكبر قيمة − أصغر قيمة = 10 − 2 = 8.', eq: '10 − 2 = 8', run: (c) => { c.line(122, 290, 410, 290, { stroke: C.rose, 'stroke-width': 3 }); c.text(266, 308, 'المدى = 8', { fill: C.rose, 'font-size': 16 }); } },
      { say: 'والمتوسط = 63 ÷ 11 ≈ 5.7، وليس 6.', eq: '63 ÷ 11 ≈ 5.7' },
      { say: 'توقف وفكّر: أي العبارات صحيحة؟', ask: true },
    ],
  },
};

// ---------------------------------------------------------------------
// المشغّل
// ---------------------------------------------------------------------
export function mountExplainer(root: HTMLElement, item: XItem, opt: { figBase?: string } = {}) {
  injectCss();
  const custom = item.fig ? SCENES[item.fig] : undefined;
  const figSrc = item.fig ? `${opt.figBase ?? '/booklet/'}${item.fig}.png` : '';
  const ansTxt = `${LETTERS[item.a]}) ${item.o[item.a]}`;
  const steps: XStep[] = [];
  if (custom) steps.push(...custom.steps.filter((s) => !s.ask));
  else {
    steps.push({ say: item.fig ? 'لنقرأ السؤال ونتأمل الشكل جيدًا.' : 'لنقرأ السؤال ونحدد المعطيات والمطلوب.' });
    item.steps.slice(0, Math.max(1, item.steps.length - 1)).forEach((s) => steps.push({ say: s, eq: s }));
  }
  steps.push({ say: 'توقف وفكّر: ما الإجابة الصحيحة؟', ask: true });
  if (!custom && item.steps.length > 1) steps.push({ say: item.steps[item.steps.length - 1], eq: item.steps[item.steps.length - 1] });
  steps.push({ say: `الإجابة الصحيحة: ${ansTxt}`, eq: `الإجابة: ${ansTxt}`, final: true });

  root.innerHTML = `<div class="xp"><div class="xp-stage">
    <div class="xp-fig"></div>
    <div class="xp-board"><div class="xp-q"></div></div>
    <div class="xp-sub"></div></div>
    <div class="xp-bar"><button class="xp-play" aria-label="تشغيل">▶</button><button class="ghost xp-prev" aria-label="الخطوة السابقة">→</button><button class="ghost xp-next" aria-label="الخطوة التالية">←</button>
    <div class="xp-segs">${steps.map(() => '<i></i>').join('')}</div>
    <button class="ghost xp-speed">×1</button><button class="ghost xp-voice" hidden>🔊</button><button class="ghost xp-full" aria-label="ملء الشاشة">⛶</button></div>
    <p class="xp-note">رسوم متحركة تفاعلية مبنية من السؤال والحل، وليست فيديو مولّدًا بالذكاء الاصطناعي.</p></div>`;
  const $ = <T extends Element>(s: string) => root.querySelector(s) as T;
  const stage = $<HTMLElement>('.xp-stage'), fig = $<HTMLElement>('.xp-fig'), board = $<HTMLElement>('.xp-board'), sub = $<HTMLElement>('.xp-sub');
  const segs = [...root.querySelectorAll<HTMLElement>('.xp-segs i')], playBtn = $<HTMLButtonElement>('.xp-play');
  $<HTMLElement>('.xp-q').textContent = item.p;

  let applied = -1;
  let cur = 0, playing = false, timer: ReturnType<typeof setTimeout> | undefined, speed = 1, voiceOn = false, ctx: Ctx | null = null;
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
  let voice: SpeechSynthesisVoice | undefined;
  const pickVoice = () => { voice = synth?.getVoices().find((v) => v.lang.toLowerCase().startsWith('ar')); $<HTMLButtonElement>('.xp-voice').hidden = !voice; };
  if (synth) { pickVoice(); synth.addEventListener?.('voiceschanged', pickVoice); }

  function resetStage() {
    board.querySelectorAll('.xp-eq').forEach((e) => e.remove());
    stage.querySelector('.xp-ask')?.remove();
    fig.innerHTML = '';
    if (custom) {
      const svg = document.createElementNS(NS, 'svg') as SVGSVGElement; svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'xp-main'); fig.appendChild(svg);
      ctx = makeCtx(svg, true); custom.init(ctx);
      const th = document.createElement('div'); th.className = 'xp-thumb'; th.innerHTML = `<img src="${figSrc}" alt=""><span>الشكل في الكراسة</span>`; th.onclick = () => th.classList.toggle('big'); fig.appendChild(th);
    } else if (figSrc) fig.innerHTML = `<img class="xp-img" src="${figSrc}" alt="الشكل المرافق للسؤال">`;
    else { let n = 0; fig.innerHTML = `<div class="xp-big" style="font-size:18px">${esc(item.p).replace(/[0-9٠-٩]+(?:[.,][0-9]+)?(?:\/[0-9]+)?|[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g, (m) => `<mark style="animation-delay:${0.3 + 0.25 * n++}s">${m}</mark>`)}</div>`; board.querySelector<HTMLElement>('.xp-q')!.style.display = 'none'; }
  }
  function addEq(text: string, final: boolean, fast: boolean) {
    const d = document.createElement('div'); d.className = 'xp-eq' + (final ? ' final' : ''); d.textContent = text; board.appendChild(d);
    if (!fast) d.animate([{ clipPath: 'inset(0 0 0 100%)', opacity: 0.4 }, { clipPath: 'inset(0 0 0 0)', opacity: 1 }], { duration: 900 / speed, easing: 'ease-out' });
    board.scrollTop = board.scrollHeight;
  }
  function apply(i: number, fast: boolean) {
    const s = steps[i];
    if (ctx) ctx.fast = fast;
    if (s.run && ctx) s.run(ctx);
    if (s.eq) addEq(s.eq, !!s.final, fast);
    if (!custom && !figSrc && !fast && s.eq) { fig.innerHTML = `<div class="xp-big">${esc(s.eq)}</div>`; fig.firstElementChild!.animate([{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 1100 / speed, easing: 'ease-out' }); }
    if (!custom && figSrc && !fast) { const im = fig.querySelector<HTMLElement>('.xp-img'); if (im) { im.style.transform = i % 2 ? 'scale(1.06)' : 'scale(1)'; } }
  }
  function speak(t: string, done: () => void) {
    if (!voiceOn || !synth || !voice) return done();
    synth.cancel(); const u = new SpeechSynthesisUtterance(t); u.voice = voice; u.lang = voice.lang; u.rate = speed;
    u.onend = done; u.onerror = done; synth.speak(u);
  }
  function setSegs() {
    segs.forEach((e, k) => { e.className = k < cur ? 'done' : k === cur ? 'cur' + (playing ? '' : ' paused') : ''; });
  }
  function ask() {
    const box = document.createElement('div'); box.className = 'xp-ask';
    box.innerHTML = `<b>توقف وفكّر: ما الإجابة؟</b><div class="xp-opts">${item.o.map((o, k) => `<button data-k="${k}">${LETTERS[k]}) ${o}</button>`).join('')}</div><span class="xp-fb"></span>`;
    stage.appendChild(box);
    box.onclick = (e) => {
      const b = (e.target as HTMLElement).closest('button'); if (!b || box.dataset.done) return;
      box.dataset.done = '1'; const k = +b.dataset.k!;
      box.querySelectorAll('button').forEach((x, j) => { if (j === item.a) x.classList.add('ok'); else if (j === k) x.classList.add('no'); });
      (box.querySelector('.xp-fb') as HTMLElement).textContent = k === item.a ? 'أحسنت! لنكمل الشرح.' : 'لا بأس، لنكمل الحل ونرى السبب.';
      setTimeout(() => { box.remove(); go(cur + 1, true); }, 1600);
    };
  }
  function run(i: number) {
    clearTimeout(timer); synth?.cancel();
    cur = i; const s = steps[i]; sub.textContent = s.ask ? '' : s.say;
    if (applied !== i) { apply(i, false); applied = i; }
    const dur = Math.max(2600, s.say.length * 75) / speed;
    segs[i]?.style.setProperty('--d', `${dur}ms`); setSegs();
    if (s.ask) { playing = false; playBtn.textContent = '▶'; setSegs(); if (!stage.querySelector('.xp-ask')) ask(); return; }
    if (!playing) return;
    let t = false, v = false; const next = () => { if (t && v && playing) { if (cur < steps.length - 1) run(cur + 1); else { playing = false; playBtn.textContent = '↻'; setSegs(); } } };
    timer = setTimeout(() => { t = true; next(); }, dur);
    speak(s.say, () => { v = true; next(); });
  }
  function go(i: number, play = playing) {
    i = Math.max(0, Math.min(steps.length - 1, i));
    resetStage(); applied = -1; for (let k = 0; k < i; k++) if (!steps[k].ask) apply(k, true);
    playing = play; playBtn.textContent = playing ? '❚❚' : '▶'; run(i);
  }
  playBtn.onclick = () => {
    if (playBtn.textContent === '↻') return go(0, true);
    if (steps[cur].ask && stage.querySelector('.xp-ask')) return;
    playing = !playing; playBtn.textContent = playing ? '❚❚' : '▶';
    if (playing) run(cur); else { clearTimeout(timer); synth?.cancel(); setSegs(); }
  };
  $<HTMLButtonElement>('.xp-next').onclick = () => go(cur + 1, false);
  $<HTMLButtonElement>('.xp-prev').onclick = () => go(cur - 1, false);
  segs.forEach((e, k) => (e.onclick = () => go(k, false)));
  $<HTMLButtonElement>('.xp-speed').onclick = (e) => { speed = speed === 1 ? 1.5 : speed === 1.5 ? 0.75 : 1; (e.target as HTMLElement).textContent = '×' + speed; };
  $<HTMLButtonElement>('.xp-voice').onclick = (e) => { voiceOn = !voiceOn; (e.target as HTMLElement).style.background = voiceOn ? C.gold : ''; if (!voiceOn) synth?.cancel(); };
  $<HTMLButtonElement>('.xp-full').onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else root.requestFullscreen?.(); };
  go(0, false);
  return { destroy() { clearTimeout(timer); synth?.cancel(); root.innerHTML = ''; }, play() { if (!playing) playBtn.click(); } };
}

export const hasCustomScene = (fig?: string) => !!(fig && SCENES[fig]);
