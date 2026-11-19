// =====================================================================
// «مَدى»: منقلة رياضية تدور ذراعها وتقيس الزوايا، ومساعد يجيب عن أسئلة الطلاب حول TIMSS
// وقوانين رياضيات الصف الثاني المتوسط من قاعدة معلومات معدّة مسبقًا
// (مطابقة كلمات مفتاحية، وليست نموذج ذكاء اصطناعي توليديًا).
// يعمل دون إطار: في المنصة عبر مكوّنات React، وفي المعاينة مباشرة.
// =====================================================================


const CSS = `
.mp{position:relative;display:inline-flex;flex-direction:column;align-items:center;width:var(--s);user-select:none}
.mp-body{display:block;width:var(--s);height:var(--s);will-change:transform}
.mp-body svg{width:100%;height:100%;overflow:visible}
.mp-shadow{width:55%;height:8px;margin-top:-4px;border-radius:50%;background:rgba(38,42,74,.16);filter:blur(2px)}
.mp-name{margin-top:6px;font-weight:900;font-size:15px;color:#262a4a}
.mp-glow{transition:opacity .4s}
.mada-launch{position:fixed;left:18px;bottom:18px;z-index:60;display:flex;align-items:flex-end;gap:8px;direction:rtl}
.mada-launch button.mada-btn{border:0;background:transparent;cursor:pointer;padding:0}
.mada-hello{background:#fff;border-radius:16px 16px 4px 16px;padding:8px 12px;font-weight:800;font-size:13px;box-shadow:0 8px 20px -8px rgba(38,42,74,.35);max-width:210px;line-height:1.7}
.mada-panel{position:fixed;left:18px;bottom:110px;z-index:61;width:min(380px,calc(100vw - 36px));height:min(560px,calc(100vh - 140px));display:flex;flex-direction:column;background:#fff;border-radius:22px;box-shadow:0 20px 50px -15px rgba(38,42,74,.45);overflow:hidden;direction:rtl;border:1px solid rgba(38,42,74,.08)}
.mada-head{display:flex;align-items:center;gap:10px;padding:12px 14px;background:linear-gradient(135deg,#f3f6ff,#fffdf6);border-bottom:1px solid rgba(38,42,74,.08)}
.mada-head b{font-size:16px}.mada-head p{margin:0;font-size:12px;color:#8a8fa8}
.mada-head button{margin-inline-start:auto;border:0;background:rgba(38,42,74,.07);border-radius:10px;width:32px;height:32px;cursor:pointer;font-size:16px}
.mada-log{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#fbfcff}
.mada-msg{max-width:88%;padding:10px 12px;border-radius:16px;line-height:1.85;font-size:14px;white-space:pre-line}
.mada-msg.bot{align-self:flex-start;background:#fff;border:1px solid rgba(38,42,74,.08);border-start-start-radius:4px}
.mada-msg.me{align-self:flex-end;background:#262a4a;color:#fff;border-start-end-radius:4px}
.mada-msg .src{display:block;margin-top:6px;font-size:11px;color:#8a8fa8}
.mada-msg .src a{color:#0fa3a0}
.mada-chips{display:flex;flex-wrap:wrap;gap:6px}
.mada-chips button{border:1px solid rgba(38,42,74,.14);background:#fff;border-radius:999px;padding:5px 10px;font:inherit;font-size:12px;font-weight:700;cursor:pointer}
.mada-chips button:hover{border-color:#f5b82e}
.mada-form{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(38,42,74,.08)}
.mada-form input{flex:1;border:1px solid rgba(38,42,74,.15);border-radius:12px;padding:9px 12px;font:inherit}
.mada-form button{border:0;background:#f5b82e;border-radius:12px;padding:0 14px;font:inherit;font-weight:800;cursor:pointer}
.mada-note{font-size:10.5px;color:#8a8fa8;text-align:center;padding:0 10px 8px}
`;
function injectCss() {
  if (typeof document === 'undefined' || document.getElementById('mada-css')) return;
  const s = document.createElement('style'); s.id = 'mada-css'; s.textContent = CSS; document.head.appendChild(s);
}

export type Mood = 'idle' | 'correct' | 'hint' | 'reveal';
const TONE: Record<Mood, [string, string]> = { idle: ['#eaf0ff', '#3f63d8'], correct: ['#e3f8f4', '#12a08f'], hint: ['#fff4d6', '#c98a08'], reveal: ['#fdebef', '#cf4167'] };
const ANGLE: Record<Mood, number> = { idle: 45, correct: 90, hint: 120, reveal: 60 };
const CX = 60, CY = 78;
const pt = (r: number, d: number) => [CX + r * Math.cos((d * Math.PI) / 180), CY - r * Math.sin((d * Math.PI) / 180)].map((v) => +v.toFixed(2));
const sector = (d: number) => { const [x, y] = pt(36, d); return `M${CX} ${CY} L${CX + 36} ${CY} A36 36 0 0 0 ${x} ${y} Z`; };

/** «مَدى»: منقلة رياضية بوجه بسيط، ذراعها تدور وتقيس الزوايا (تصميم مسطّح) */
export function planetHTML(size = 120, mood: Mood = 'idle', named = false): string {
  injectCss();
  const [bg, ink] = TONE[mood] ?? TONE.idle, d = ANGLE[mood] ?? 45;
  let ticks = '';
  for (let k = 0; k <= 180; k += 10) { const [x1, y1] = pt(52, k), [x2, y2] = pt(k % 30 ? 47 : 43, k); ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-width="${k % 30 ? 1.4 : 2.2}" stroke-linecap="round"/>`; }
  const [ax, ay] = pt(50, d);
  const mouth = mood === 'correct' ? 'M53 63 Q60 70 67 63' : mood === 'reveal' ? 'M55 65 Q60 62 65 65' : 'M54 63 Q60 67 66 63';
  const ey = mood === 'hint' ? 51 : 53;
  return `<span class="mp mp-${mood}" style="--s:${size}px" role="img" aria-label="مَدى"><span class="mp-body" style="height:calc(var(--s) * .84)"><svg viewBox="0 0 120 100">
    <path d="M8 ${CY} A52 52 0 0 1 112 ${CY} Z" fill="${bg}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M24 ${CY} A36 36 0 0 1 96 ${CY}" fill="none" stroke="${ink}" stroke-opacity=".25" stroke-width="1.5"/>
    ${ticks}
    <path class="mp-sec" d="${sector(d)}" fill="#f5b82e" fill-opacity=".28"/>
    <g class="mp-face"><circle cx="52" cy="${ey}" r="3.2" fill="#1d2140"/><circle cx="68" cy="${ey}" r="3.2" fill="#1d2140"/><path d="${mouth}" stroke="#1d2140" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>
    <line class="mp-arm" x1="${CX}" y1="${CY}" x2="${ax}" y2="${ay}" stroke="#f5b82e" stroke-width="4.5" stroke-linecap="round"/>
    <circle class="mp-tip" cx="${ax}" cy="${ay}" r="3.6" fill="#f5b82e" stroke="#fff" stroke-width="1.5"/>
    <circle cx="${CX}" cy="${CY}" r="4" fill="${ink}"/>
    <text class="mp-deg" x="${CX}" y="95" text-anchor="middle" font-size="11" font-weight="800" fill="${ink}" font-family="Tajawal,system-ui,sans-serif">${d}°</text>
    ${mood === 'hint' ? `<text x="100" y="22" font-size="18" font-weight="900" fill="${ink}">؟</text>` : mood === 'correct' ? `<path d="M96 14 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z" fill="#f5b82e"/>` : ''}
  </svg></span><span class="mp-shadow"></span>${named ? '<span class="mp-name">مَدى</span>' : ''}</span>`;
}

/** حركة «مَدى»: الذراع تقيس زوايا مختلفة بالتتابع، والمنقلة تتنقل بهدوء وتميل نحو المؤشر، والنقر يجعلها تقيس زاوية قائمة مع قفزة */
export function planetLive(root: HTMLElement | null, opt: { roam?: number } = {}): () => void {
  if (!root || root.dataset.live) return () => {};
  root.dataset.live = '1';
  const body = root.querySelector('.mp-body') as HTMLElement | null, shadow = root.querySelector('.mp-shadow') as HTMLElement | null;
  const arm = root.querySelector('.mp-arm'), tip = root.querySelector('.mp-tip'), sec = root.querySelector('.mp-sec'), deg = root.querySelector('.mp-deg');
  if (!body || !arm) return () => {};
  const S = body.getBoundingClientRect().width || 100, roam = opt.roam ?? 0.25;
  const calm = () => document.documentElement.classList.contains('calm') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TARGETS = [30, 60, 90, 120, 150, 180, 135, 45, 90, 0];
  let ang = 45, target = 60, ti = 0, nextAt = performance.now() + 1500, hop = 0, hopV = 0, tilt = 0, raf = 0;
  let pointer: { x: number; y: number; at: number } | null = null;
  const t0 = performance.now();
  const onMove = (e: PointerEvent) => { pointer = { x: e.clientX, y: e.clientY, at: performance.now() }; };
  const onClick = () => { target = 90; nextAt = performance.now() + 2600; hopV = S * 0.07; };
  window.addEventListener('pointermove', onMove); root.addEventListener('click', onClick);
  const draw = () => {
    const [x, y] = pt(50, ang);
    arm.setAttribute('x2', String(x)); arm.setAttribute('y2', String(y));
    tip?.setAttribute('cx', String(x)); tip?.setAttribute('cy', String(y));
    sec?.setAttribute('d', sector(Math.max(0.5, ang)));
    if (deg) deg.textContent = `${Math.round(ang)}°`;
  };
  const frame = (now: number) => {
    const t = (now - t0) / 1000, still = calm();
    if (!still && now > nextAt) { ti = (ti + 1) % TARGETS.length; target = TARGETS[ti]; nextAt = now + 2300; }
    ang += (target - ang) * 0.06; draw();
    let lean = 0;
    if (pointer && now - pointer.at < 2500) { const r = body.getBoundingClientRect(); lean = Math.max(-8, Math.min(8, (pointer.x - (r.left + r.width / 2)) / 30)); }
    tilt += (lean - tilt) * 0.06;
    hop += hopV; hopV -= S * 0.009; if (hop < 0) { hop = 0; hopV = 0; }
    const wx = still ? 0 : (Math.sin(t * 0.33) + 0.3 * Math.sin(t * 1.1)) * S * roam;
    const wy = still ? 0 : Math.sin(t * 0.55) * S * roam * 0.25 - hop;
    body.style.transform = `translate(${wx}px, ${wy}px) rotate(${tilt}deg)`;
    if (shadow) shadow.style.transform = `translateX(${wx}px) scale(${Math.max(0.6, 1 - hop / (S * 0.8))})`;
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); root.removeEventListener('click', onClick); };
}

// ---------------------------------------------------------------------
// قاعدة معلومات المساعد
// ---------------------------------------------------------------------
interface KB { k: string[]; q: string; a: string; src?: [string, string] }
const TIMSS_SRC: [string, string] = ['نتائج TIMSS 2023 — IEA', 'https://timss2023.org/results'];
export const KB_ITEMS: KB[] = [
  { q: 'من أنت؟', k: ['اسمك', 'من انت', 'مين انت', 'مرحبا', 'السلام', 'هلا', 'عرف بنفسك', 'مدى'],
    a: 'مرحبًا، أنا مدى، مساعدك في الرياضيات واختبار TIMSS. أشرح لك القوانين المهمة للصف الثاني المتوسط، وأجيب عن أسئلتك حول اختبار TIMSS ونتائج المملكة.' },
  { q: 'ما اختبار TIMSS؟', k: ['ما تيمز', 'ماهو تيمز', 'تعريف تيمز', 'ما اختبار', 'تيمز', 'timss', 'الاتجاهات الدولية'],
    a: 'TIMSS دراسة دولية تديرها الرابطة الدولية لتقييم التحصيل التربوي (IEA)، تقيس تحصيل طلاب الصف الرابع والصف الثامن (الثاني المتوسط) في الرياضيات والعلوم، وتقارن النتائج بين الدول. تُجرى كل أربع سنوات على عينة عشوائية من المدارس.',
    src: ['وزارة التعليم', 'https://moe.gov.sa/ar/updates-and-media/updates/trends-studies'] },
  { q: 'متى بدأ اختبار TIMSS؟', k: ['متى بدا', 'بداية', 'بدات', 'اول مرة', 'تاريخ', 'متى', 'دورات', 'كل كم'],
    a: 'بدأت دورات TIMSS عام 1995، ثم تكررت كل أربع سنوات: 1999، 2003، 2007، 2011، 2015، 2019، 2023. والدورة القادمة 2027، وهي التي يستعد لها طلاب هذا البرنامج.',
    src: ['وزارة التعليم', 'https://moe.gov.sa/ar/updates-and-media/updates/timss-2019-1'] },
  { q: 'كم نتيجة المملكة في TIMSS؟', k: ['نتيجه المملكه', 'نتيجه السعوديه', 'المملكه', 'السعوديه', 'نتيجتنا', 'كم حصلت', 'درجه المملكه', 'ترتيب'],
    a: 'في TIMSS 2023 حصل طلاب الصف الثاني المتوسط في المملكة على متوسط 397 نقطة في الرياضيات، والمتوسط الدولي 478 نقطة.\nوحسب المستوى المعرفي: المعرفة 393، والتطبيق 390، والاستدلال 379، فالاستدلال هو الأضعف.\nوارتفعت نتيجة الصف الثاني المتوسط 3 نقاط عن دورة 2019.', src: TIMSS_SRC },
  { q: 'ما الذي نحتاج إلى تحقيقه؟', k: ['نحتاج', 'الهدف', 'نحقق', 'المطلوب منا', 'نوصل', 'المستويات', 'المعايير الدوليه', 'النقاط المطلوبه'],
    a: 'تُقسم نتائج TIMSS إلى مستويات دولية: 400 نقطة (منخفض)، و475 (متوسط)، و550 (مرتفع)، و625 (متقدم).\nنتيجة المملكة 397 قريبة من حد المستوى المنخفض. والهدف الذي يعمل عليه هذا البرنامج: أن يصل أكبر عدد من الطلاب إلى المستوى المتوسط (475) فما فوق، مع التركيز على أسئلة الاستدلال لأنها الأضعف.\nهذا هدف تعليمي للبرنامج، وليس رقمًا رسميًا معلنًا.', src: TIMSS_SRC },
  { q: 'ما مجالات اختبار TIMSS 2027؟', k: ['مجالات', 'محتوى', 'نسب', 'اوزان', 'ايش يجي', 'وش يجي', 'المستوى المعرفي', 'المعرفه التطبيق الاستدلال'],
    a: 'مجالات المحتوى للصف الثامن: الأعداد 30٪، والجبر 30٪، والهندسة والقياس 20٪، والبيانات والاحتمالات 20٪.\nوالمستويات المعرفية: المعرفة 35٪، والتطبيق 40٪، والاستدلال 25٪.',
    src: ['إطار TIMSS 2027 للتقييم — IEA', 'https://timss2027.org/frameworks/'] },
  { q: 'كيف أستعد لاختبار TIMSS؟', k: ['استعد', 'استعداد', 'نصائح', 'كيف اذاكر', 'كيف اتدرب', 'طريقه'],
    a: 'قراءة السؤال كاملًا وتحديد المطلوب قبل الحساب.\nرسم الشكل أو كتابة المعطيات عند الحاجة.\nتجربة الإجابة بالتعويض للتحقق منها.\nالتدرب على أسئلة الاستدلال التي تحتاج إلى تفسير، لا إلى حفظ القانون فقط.\nحل نماذج المكتبة وأسئلة الكراسة، ومراجعة شرح كل سؤال خاطئ.' },
  { q: 'مساحة المربع ومحيطه', k: ['مربع'], a: 'المربع الذي طول ضلعه ل:\nالمساحة = ل²\nالمحيط = 4ل\nمثال: ضلع 5 سم ← المساحة 25 سم²، والمحيط 20 سم.' },
  { q: 'مساحة المستطيل ومحيطه', k: ['مستطيل'], a: 'المستطيل الذي طوله ل وعرضه ع:\nالمساحة = ل × ع\nالمحيط = 2(ل + ع)\nمثال: 8 سم و 3 سم ← المساحة 24 سم²، والمحيط 22 سم.' },
  { q: 'مساحة المثلث', k: ['مثلث', 'المثلث'], a: 'مساحة المثلث = ½ × القاعدة × الارتفاع\nمجموع قياسات زوايا المثلث = 180°\nالارتفاع عمودي على القاعدة.' },
  { q: 'مساحة متوازي الأضلاع', k: ['متوازي الاضلاع'], a: 'مساحة متوازي الأضلاع = القاعدة × الارتفاع\nكل ضلعين متقابلين متساويان ومتوازيان، والزاويتان المتقابلتان متساويتان.' },
  { q: 'مساحة شبه المنحرف', k: ['شبه المنحرف', 'شبه منحرف'], a: 'مساحة شبه المنحرف = ½ × (القاعدة الأولى + القاعدة الثانية) × الارتفاع' },
  { q: 'مساحة المعين', k: ['معين'], a: 'مساحة المعين = ½ × القطر الأول × القطر الثاني\nأو: القاعدة × الارتفاع.' },
  { q: 'محيط الدائرة ومساحتها', k: ['دائره', 'دائرة', 'ط', 'باي', 'نصف القطر', 'محيط الدائره'], a: 'الدائرة التي نصف قطرها نق:\nالمحيط = 2 × ط × نق = ط × القطر\nالمساحة = ط × نق²\nط ≈ 3.14 أو 22/7.' },
  { q: 'نظرية فيثاغورس', k: ['فيثاغورس', 'فيثاغورث', 'الوتر', 'قائم الزاويه'], a: 'في المثلث القائم الزاوية: مربع الوتر = مجموع مربعي الضلعين الآخرين\nأ² + ب² = جـ² (جـ هو الوتر المقابل للزاوية القائمة)\nثلاثيات مشهورة: (3، 4، 5) و (6، 8، 10) و (5، 12، 13).\nمثال: ضلعا القائمة 6 و 8 ← الوتر √(36 + 64) = √100 = 10.' },
  { q: 'الأحجام', k: ['حجم', 'الحجوم', 'مكعب', 'متوازي المستطيلات', 'منشور', 'اسطوانه', 'هرم', 'مخروط', 'كره'],
    a: 'المكعب: ل³\nمتوازي المستطيلات: الطول × العرض × الارتفاع\nالمنشور: مساحة القاعدة × الارتفاع\nالأسطوانة: ط × نق² × ع\nالهرم: ⅓ × مساحة القاعدة × الارتفاع\nالمخروط: ⅓ × ط × نق² × ع\nالكرة: 4/3 × ط × نق³' },
  { q: 'المساحة الكلية للمجسمات', k: ['المساحه الكليه', 'المساحه الجانبيه', 'سطح'],
    a: 'متوازي المستطيلات: 2(ل ع + ل ض + ع ض)\nالمكعب: 6 ل²\nالأسطوانة: الجانبية 2 ط نق ع، والكلية 2 ط نق² + 2 ط نق ع\nالمنشور: الجانبية = محيط القاعدة × الارتفاع.' },
  { q: 'زوايا المضلعات', k: ['زوايا المضلع', 'مضلع', 'سداسي', 'خماسي', 'الزاويه الخارجيه', 'مجموع الزوايا', 'رباعي'],
    a: 'مجموع زوايا المضلع الداخلية = (ن − 2) × 180°، حيث ن عدد الأضلاع.\nالرباعي 360°، والخماسي 540°، والسداسي 720°.\nالزاوية الداخلية للمضلع المنتظم = (ن − 2) × 180° ÷ ن\nمجموع الزوايا الخارجية لأي مضلع = 360°، والخارجية للمنتظم = 360° ÷ ن.' },
  { q: 'الزوايا والمستقيمات المتوازية', k: ['متوازيين', 'متوازيه', 'قاطع', 'متبادله', 'متناظره', 'متتامتان', 'متكاملتان', 'متقابلتان بالراس', 'زوايا', 'زاويه'],
    a: 'المتتامتان مجموعهما 90°، والمتكاملتان مجموعهما 180°.\nالمتقابلتان بالرأس متساويتان.\nإذا قطع مستقيمٌ مستقيمين متوازيين: المتبادلتان متساويتان، والمتناظرتان متساويتان، والداخليتان في جهة واحدة مجموعهما 180°.' },
  { q: 'الميل ومعادلة المستقيم', k: ['ميل', 'معادله المستقيم', 'المقطع', 'داله خطيه', 'خطيه'],
    a: 'الميل م = (ص₂ − ص₁) ÷ (س₂ − س₁) = التغير في ص ÷ التغير في س\nمعادلة المستقيم: ص = م س + ب، حيث ب المقطع الصادي (قيمة ص عندما س = 0).\nالخطان المتوازيان لهما الميل نفسه.\nالعلاقة التناسبية خطٌّ يمر بنقطة الأصل (ب = 0).' },
  { q: 'قوانين الأسس', k: ['اسس', 'الاسس', 'اس', 'قوه', 'قوى'],
    a: 'أᵐ × أⁿ = أᵐ⁺ⁿ\nأᵐ ÷ أⁿ = أᵐ⁻ⁿ\n(أᵐ)ⁿ = أᵐˣⁿ\nأ⁰ = 1 (أ ≠ 0)\nأ⁻ⁿ = 1 ÷ أⁿ\nمثال: 2³ × 2⁴ = 2⁷ = 128.' },
  { q: 'الصيغة العلمية', k: ['الصيغه العلميه', 'علميه'], a: 'الصيغة العلمية: أ × 10ⁿ، حيث 1 ≤ أ < 10.\nمثال: 45000 = 4.5 × 10⁴، و 0.0032 = 3.2 × 10⁻³.' },
  { q: 'الجذور التربيعية', k: ['جذر', 'الجذر', 'تربيعي'], a: 'الجذر التربيعي للعدد هو العدد الذي مربعه يساوي ذلك العدد: √49 = 7.\nمربعات مهمة: 1، 4، 9، 16، 25، 36، 49، 64، 81، 100، 121، 144، 169، 196، 225.' },
  { q: 'الأعداد الأولية والقواسم والمضاعفات', k: ['اولي', 'اوليه', 'قاسم', 'قواسم', 'مضاعف', 'ق م ا', 'م م ا'],
    a: 'العدد الأولي له عاملان فقط: 1 والعدد نفسه (2، 3، 5، 7، 11، 13، ...). والعدد 1 ليس أوليًا.\nالقاسم المشترك الأكبر: أكبر عدد يقسم العددين.\nالمضاعف المشترك الأصغر: أصغر عدد يقبل القسمة على العددين، ويُستعمل في مسائل الأحداث المتكررة معًا.' },
  { q: 'خصائص العمليات وترتيبها', k: ['خاصيه', 'خصائص', 'توزيع', 'ابدال', 'تجميع', 'ترتيب العمليات', 'محايد', 'نظير'],
    a: 'الإبدال: أ + ب = ب + أ ، أ × ب = ب × أ\nالتجميع: (أ + ب) + جـ = أ + (ب + جـ)\nالتوزيع: أ(ب + جـ) = أ ب + أ جـ\nالمحايد الجمعي 0، والضربي 1. النظير الجمعي للعدد أ هو −أ، والضربي 1 ÷ أ.\nترتيب العمليات: الأقواس، ثم الأسس، ثم الضرب والقسمة من اليمين، ثم الجمع والطرح.' },
  { q: 'النسبة المئوية', k: ['نسبه مئويه', 'مئويه', 'خصم', 'تخفيض', 'زياده', 'ربح', 'تغير مئوي', '٪'],
    a: 'الجزء = النسبة المئوية × الكل\nالنسبة المئوية = الجزء ÷ الكل × 100\nنسبة التغير = (الجديد − القديم) ÷ القديم × 100\nالسعر بعد خصم 20٪ = السعر × 0.8، وبعد زيادة 15٪ = السعر × 1.15.' },
  { q: 'النسبة والتناسب', k: ['تناسب', 'نسبه', 'مقياس الرسم', 'معدل', 'طردي', 'عكسي'],
    a: 'التناسب: أ ÷ ب = جـ ÷ د ⇐ أ × د = ب × جـ (الضرب التبادلي).\nمعدل الوحدة: الكمية مقابل وحدة واحدة، مثل 60 كم في الساعة.\nمقياس الرسم: الطول في الرسم ÷ الطول الحقيقي.\nالتغير الطردي ص = ك س، وفي العكسي يبقى حاصل الضرب ثابتًا.' },
  { q: 'المتوسط والوسيط والمنوال والمدى', k: ['متوسط', 'وسيط', 'منوال', 'المدى', 'ربيع', 'متطرفه', 'نزعه مركزيه', 'تشتت'],
    a: 'المتوسط = مجموع القيم ÷ عددها\nالوسيط: القيمة الوسطى بعد الترتيب (أو متوسط القيمتين الوسطيين)\nالمنوال: القيمة الأكثر تكرارًا\nالمدى = أكبر قيمة − أصغر قيمة\nالمدى الربيعي = الربيع الأعلى − الربيع الأدنى\nالقيمة المتطرفة تؤثر في المتوسط أكثر من الوسيط.' },
  { q: 'الاحتمالات', k: ['احتمال', 'احتمالات', 'مبدا العد', 'مستقله', 'متنافيه', 'فضاء العينه'],
    a: 'الاحتمال = عدد النواتج المطلوبة ÷ عدد النواتج الممكنة، وقيمته بين 0 و 1.\nمبدأ العد: عدد النواتج = حاصل ضرب عدد الخيارات في كل مرحلة.\nالحادثتان المستقلتان: ح(أ و ب) = ح(أ) × ح(ب).\nالمتنافيتان: ح(أ أو ب) = ح(أ) + ح(ب).\nالاحتمال التجريبي = عدد مرات الحدوث ÷ عدد المحاولات.' },
  { q: 'التحويلات الهندسية', k: ['تحويل', 'انعكاس', 'انسحاب', 'دوران', 'تمدد', 'تشابه', 'تطابق', 'متشابه'],
    a: 'الانسحاب (أ، ب): (س، ص) ← (س + أ، ص + ب)\nالانعكاس حول محور السينات: (س، ص) ← (س، −ص)، وحول محور الصادات: (−س، ص)\nالدوران 180° حول الأصل: (−س، −ص)\nالتمدد بمعامل ك: (ك س، ك ص)\nفي المضلعين المتشابهين: نسبة المحيطين = معامل التشابه، ونسبة المساحتين = مربعه.' },
  { q: 'المسافة بين نقطتين ونقطة المنتصف', k: ['المسافه بين', 'نقطه المنتصف', 'منتصف', 'احداثي', 'المستوى الاحداثي'],
    a: 'المسافة بين (س₁، ص₁) و (س₂، ص₂) = √((س₂ − س₁)² + (ص₂ − ص₁)²)\nنقطة المنتصف = ((س₁ + س₂) ÷ 2 ، (ص₁ + ص₂) ÷ 2)' },
  { q: 'حل المعادلات والمتباينات', k: ['معادله', 'متباينه', 'حل المعادله', 'المجهول'],
    a: 'نعزل المجهول بالعمليات العكسية على الطرفين.\nمثال: 3س + 5 = 20 ⇐ 3س = 15 ⇐ س = 5.\nفي المتباينة يبقى الحل كذلك، لكن عند الضرب أو القسمة على عدد سالب ينعكس اتجاه الرمز: −2س > 6 ⇐ س < −3.' },
];

const norm = (t: string) => t.toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[؟?!.,،]/g, ' ').replace(/\s+/g, ' ').trim();
export function askMada(text: string): KB | null {
  const t = ' ' + norm(text) + ' ';
  let best: KB | null = null, score = 0;
  for (const it of KB_ITEMS) {
    let s = 0;
    for (const k of it.k) { const nk = norm(k); if (nk.length <= 2 ? t.includes(' ' + nk + ' ') : t.includes(nk)) s += nk.length; }
    if (norm(it.q) === norm(text)) s += 100;
    if (s > score) { score = s; best = it; }
  }
  return score ? best : null;
}

const SUGGEST = ['ما اختبار TIMSS؟', 'متى بدأ اختبار TIMSS؟', 'كم نتيجة المملكة في TIMSS؟', 'ما الذي نحتاج إلى تحقيقه؟', 'ما مجالات اختبار TIMSS 2027؟', 'نظرية فيثاغورس', 'محيط الدائرة ومساحتها', 'مساحة المربع ومحيطه', 'الأحجام', 'قوانين الأسس', 'الميل ومعادلة المستقيم', 'المتوسط والوسيط والمنوال والمدى'];
const esc = (t: string) => t.replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]!);

/** زر «مَدى» العائم ونافذة المحادثة */
export function mountMadaAssistant(host: HTMLElement = document.body): () => void {
  injectCss();
  const wrap = document.createElement('div'); wrap.className = 'mada-launch';
  const firstTime = (() => { try { const v = localStorage.getItem('mada_hello'); localStorage.setItem('mada_hello', '1'); return !v; } catch { return true; } })();
  wrap.innerHTML = `<button class="mada-btn" aria-label="فتح مساعد مدى">${planetHTML(82)}</button>${firstTime ? '<div class="mada-hello">مرحبًا، أنا مدى، مساعدك في الرياضيات واختبار TIMSS.</div>' : ''}`;
  host.appendChild(wrap);
  const stop = planetLive(wrap.querySelector('.mada-btn') as HTMLElement, { roam: 0.12 });
  setTimeout(() => wrap.querySelector('.mada-hello')?.remove(), 7000);
  let panel: HTMLElement | null = null;
  const open = () => {
    wrap.querySelector('.mada-hello')?.remove();
    if (panel) { panel.remove(); panel = null; return; }
    panel = document.createElement('div'); panel.className = 'mada-panel';
    panel.innerHTML = `<div class="mada-head">${planetHTML(42)}<div><b>مَدى</b><p>مساعدك في الرياضيات واختبار TIMSS</p></div><button aria-label="إغلاق">✕</button></div>
      <div class="mada-log"></div>
      <form class="mada-form"><input placeholder="اكتب سؤالك، مثل: مساحة الدائرة" aria-label="سؤالك"><button>إرسال</button></form>
      <p class="mada-note">يجيب مدى من معلومات أعدّها فريق المنصة مع مصادرها.</p>`;
    host.appendChild(panel);
    const log = panel.querySelector('.mada-log') as HTMLElement, input = panel.querySelector('input') as HTMLInputElement;
    const say = (html: string, who: 'bot' | 'me') => { const d = document.createElement('div'); d.className = 'mada-msg ' + who; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; };
    const chips = (list: string[]) => { const d = document.createElement('div'); d.className = 'mada-chips'; d.innerHTML = list.map((s) => `<button type="button">${esc(s)}</button>`).join(''); log.appendChild(d); log.scrollTop = log.scrollHeight; };
    const answer = (text: string) => {
      if (!text.trim()) return;
      say(esc(text), 'me');
      const hit = askMada(text);
      setTimeout(() => {
        if (hit) say(`<b>${esc(hit.q)}</b>\n${esc(hit.a)}${hit.src ? `<span class="src">المصدر: <a href="${hit.src[1]}" target="_blank" rel="noreferrer">${esc(hit.src[0])}</a></span>` : ''}`, 'bot');
        else { say('لم أجد إجابة لهذا السؤال في معلوماتي. هذه موضوعات أستطيع شرحها:', 'bot'); chips(SUGGEST.slice(0, 8)); }
      }, 350);
    };
    say('مرحبًا، أنا مدى، مساعدك في الرياضيات واختبار TIMSS.\nأستطيع إخبارك عن اختبار TIMSS ونتائج المملكة، وشرح القوانين المهمة للصف الثاني المتوسط. اختر سؤالًا أو اكتب سؤالك:', 'bot');
    chips(SUGGEST);
    log.addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest('.mada-chips button'); if (b) answer(b.textContent ?? ''); });
    (panel.querySelector('form') as HTMLFormElement).onsubmit = (e) => { e.preventDefault(); answer(input.value); input.value = ''; };
    (panel.querySelector('.mada-head button') as HTMLButtonElement).onclick = open;
    input.focus();
  };
  (wrap.querySelector('.mada-btn') as HTMLButtonElement).onclick = open;
  return () => { stop(); wrap.remove(); panel?.remove(); };
}
