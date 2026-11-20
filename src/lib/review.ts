import { videoLinksHTML } from './videos';

// =====================================================================
// قسم المراجعة: (1) جدول الضرب: جدول تفاعلي وتحدي الدقيقة ومراجعة الحقائق الصعبة،
// (2) القوانين والنظريات المهمة للصف الثاني المتوسط مع مثال وسؤال تحقق لكل قانون.
// يعمل دون إطار: في المنصة عبر مكوّن React، وفي المعاينة مباشرة.
// =====================================================================

export interface Law { id: string; domain: string; title: string; f: string[]; ex: string; check?: { q: string; o: string[]; a: number } }
export const DOMAINS = ['الأعداد', 'الجبر', 'الهندسة والقياس', 'البيانات والاحتمالات'];

export const LAWS: Law[] = [
  // ---------------- الأعداد ----------------
  { id: 'order', domain: 'الأعداد', title: 'ترتيب العمليات', f: ['الأقواس أولًا', 'ثم الأسس والجذور', 'ثم الضرب والقسمة بالترتيب', 'ثم الجمع والطرح بالترتيب'], ex: '3 + 4 × 2² = 3 + 4 × 4 = 3 + 16 = 19', check: { q: 'ما قيمة 10 − 2 × 3 ؟', o: ['4', '24', '16', '12'], a: 0 } },
  { id: 'props', domain: 'الأعداد', title: 'خصائص العمليات', f: ['الإبدال: أ + ب = ب + أ ، أ × ب = ب × أ', 'التجميع: (أ + ب) + جـ = أ + (ب + جـ)', 'التوزيع: أ(ب + جـ) = أ ب + أ جـ', 'المحايد: أ + 0 = أ ، أ × 1 = أ', 'النظير: أ + (−أ) = 0 ، أ × (1 ÷ أ) = 1'], ex: '6(2 + ع) = 12 + 6ع', check: { q: '5(س + 3) تساوي:', o: ['5س + 15', '5س + 3', 'س + 15', '8س'], a: 0 } },
  { id: 'integers', domain: 'الأعداد', title: 'العمليات على الأعداد الصحيحة', f: ['إشارتان متشابهتان في الضرب أو القسمة ← موجب', 'إشارتان مختلفتان ← سالب', 'طرح عدد = جمع نظيره: أ − ب = أ + (−ب)', '|أ| هي بعد العدد عن الصفر'], ex: '(−3) × (−4) = 12 ، 5 − (−2) = 7', check: { q: '(−18) ÷ 3 = ؟', o: ['−6', '6', '−15', '15'], a: 0 } },
  { id: 'fractions', domain: 'الأعداد', title: 'العمليات على الكسور', f: ['الجمع والطرح: نوحّد المقامات ثم نجمع البسوط', 'الضرب: بسط × بسط ، مقام × مقام', 'القسمة: نضرب في مقلوب المقسوم عليه', 'العدد الكسري ← كسر غير فعلي قبل الضرب والقسمة'], ex: '⅔ ÷ ¼ = ⅔ × 4 = 8/3 = 2⅔', check: { q: '½ + ⅓ = ؟', o: ['5/6', '2/5', '1/6', '2/6'], a: 0 } },
  { id: 'percent', domain: 'الأعداد', title: 'النسبة المئوية', f: ['الجزء = النسبة المئوية × الكل', 'النسبة المئوية = الجزء ÷ الكل × 100', 'نسبة التغير = (الجديد − القديم) ÷ القديم × 100', 'بعد خصم 20٪: السعر × 0.8 ، بعد زيادة 15٪: السعر × 1.15'], ex: '25٪ من 80 = 0.25 × 80 = 20', check: { q: 'كم يساوي 20٪ من 150 ؟', o: ['30', '20', '75', '130'], a: 0 } },
  { id: 'ratio', domain: 'الأعداد', title: 'النسبة والتناسب ومعدل الوحدة', f: ['التناسب: أ ÷ ب = جـ ÷ د ⇐ أ × د = ب × جـ', 'معدل الوحدة: الكمية مقابل وحدة واحدة', 'مقياس الرسم = الطول في الرسم ÷ الطول الحقيقي'], ex: '3/4 = س/12 ⇐ 4س = 36 ⇐ س = 9', check: { q: 'سيارة تقطع 240 كم في 3 ساعات. ما سرعتها في الساعة؟', o: ['80 كم', '72 كم', '720 كم', '60 كم'], a: 0 } },
  { id: 'exponents', domain: 'الأعداد', title: 'قوانين الأسس', f: ['أᵐ × أⁿ = أᵐ⁺ⁿ', 'أᵐ ÷ أⁿ = أᵐ⁻ⁿ', '(أᵐ)ⁿ = أᵐˣⁿ', 'أ⁰ = 1 (أ ≠ 0)', 'أ⁻ⁿ = 1 ÷ أⁿ'], ex: '2³ × 2⁴ = 2⁷ = 128', check: { q: '3⁵ ÷ 3² = ؟', o: ['3³', '3⁷', '3¹⁰', '1³'], a: 0 } },
  { id: 'scientific', domain: 'الأعداد', title: 'الصيغة العلمية', f: ['العدد = أ × 10ⁿ حيث 1 ≤ أ < 10', 'الأعداد الكبيرة: أس موجب', 'الأعداد الصغيرة جدًا: أس سالب'], ex: '45000 = 4.5 × 10⁴ ، 0.0032 = 3.2 × 10⁻³', check: { q: 'العدد 0.00045 بالصيغة العلمية:', o: ['4.5 × 10⁻⁴', '4.5 × 10⁴', '45 × 10⁻⁵', '0.45 × 10⁻³'], a: 0 } },
  { id: 'roots', domain: 'الأعداد', title: 'المربعات والجذور التربيعية', f: ['√(س²) = س عندما س موجب', 'مربعات مهمة: 1، 4، 9، 16، 25، 36، 49، 64، 81، 100، 121، 144، 169، 196، 225', '√أ × √ب = √(أ × ب)'], ex: '√144 = 12 لأن 12 × 12 = 144', check: { q: '√196 = ؟', o: ['14', '13', '16', '98'], a: 0 } },
  { id: 'primes', domain: 'الأعداد', title: 'الأعداد الأولية والقواسم والمضاعفات', f: ['العدد الأولي له عاملان فقط: 1 والعدد نفسه', 'العدد 1 ليس أوليًا، والعدد 2 هو العدد الأولي الزوجي الوحيد', 'ق.م.أ: أكبر عدد يقسم العددين', 'م.م.أ: أصغر عدد يقبل القسمة على العددين'], ex: 'ق.م.أ(12، 18) = 6 ، م.م.أ(4، 6) = 12', check: { q: 'المضاعف المشترك الأصغر للعددين 6 و 8:', o: ['24', '48', '2', '14'], a: 0 } },
  // ---------------- الجبر ----------------
  { id: 'equations', domain: 'الجبر', title: 'حل المعادلات', f: ['نعزل المجهول بالعمليات العكسية', 'ما نفعله في طرف نفعله في الطرف الآخر', 'نتحقق بالتعويض في المعادلة الأصلية'], ex: '3س + 5 = 20 ⇐ 3س = 15 ⇐ س = 5', check: { q: 'ما حل المعادلة 2س + 5 = 17 ؟', o: ['س = 6', 'س = 11', 'س = 8.5', 'س = 12'], a: 0 } },
  { id: 'inequalities', domain: 'الجبر', title: 'حل المتباينات', f: ['تُحل مثل المعادلات', 'عند الضرب أو القسمة على عدد سالب ينعكس اتجاه الرمز', 'الحل مجموعة من القيم تُمثَّل على خط الأعداد'], ex: '−2س > 6 ⇐ س < −3', check: { q: 'ما حل المتباينة −3س > 12 ؟', o: ['س < −4', 'س > −4', 'س < 4', 'س > 4'], a: 0 } },
  { id: 'like-terms', domain: 'الجبر', title: 'تبسيط العبارات الجبرية', f: ['نجمع الحدود المتشابهة فقط (المتغير نفسه والأس نفسه)', 'نوزّع الضرب على الأقواس أولًا'], ex: '4س + 3 − س + 2 = 3س + 5', check: { q: 'تبسيط العبارة 3س + 2 − س + 5 يساوي:', o: ['2س + 7', '4س + 7', '2س + 3', '9س'], a: 0 } },
  { id: 'slope', domain: 'الجبر', title: 'الميل', f: ['م = (ص₂ − ص₁) ÷ (س₂ − س₁)', 'الميل = التغير الرأسي ÷ التغير الأفقي', 'الخط الصاعد ميله موجب، والهابط سالب، والأفقي صفر'], ex: 'بين (1، 2) و (3، 8): م = (8 − 2) ÷ (3 − 1) = 3', check: { q: 'ميل المستقيم المار بالنقطتين (0، 1) و (2، 9):', o: ['4', '5', '8', '½'], a: 0 } },
  { id: 'line', domain: 'الجبر', title: 'معادلة المستقيم والدالة الخطية', f: ['ص = م س + ب', 'م: الميل (معدل التغير)', 'ب: المقطع الصادي (قيمة ص عندما س = 0)', 'المستقيمان المتوازيان لهما الميل نفسه'], ex: 'ص = 2س + 3: يبدأ من 3 ويزيد 2 لكل زيادة 1 في س', check: { q: 'ما المقطع الصادي للمستقيم ص = 4س − 7 ؟', o: ['−7', '4', '7', '−4'], a: 0 } },
  { id: 'direct', domain: 'الجبر', title: 'التغير الطردي والتناسب', f: ['ص = ك س ، حيث ك ثابت التغير', 'رسمه مستقيم يمر بنقطة الأصل', 'ك = ص ÷ س لأي زوج من القيم'], ex: 'ص = 12 عندما س = 3 ⇐ ك = 4 ⇐ ص = 4س', check: { q: 'إذا تغيرت ص طرديًا مع س، وكانت ص = 15 عندما س = 5، فما قيمة ص عندما س = 8 ؟', o: ['24', '18', '40', '3'], a: 0 } },
  { id: 'sequence', domain: 'الجبر', title: 'المتتابعات الحسابية', f: ['الفرق بين كل حدين متتاليين ثابت (د)', 'الحد النوني = الحد الأول + (ن − 1) × د'], ex: '3، 7، 11، ... : د = 4 ، الحد النوني = 4ن − 1', check: { q: 'ما الحد العاشر في المتتابعة 3، 7، 11، ... ؟', o: ['39', '43', '40', '35'], a: 0 } },
  // ---------------- الهندسة والقياس ----------------
  { id: 'angles', domain: 'الهندسة والقياس', title: 'علاقات الزوايا والمستقيمات المتوازية', f: ['المتتامتان: مجموعهما 90°', 'المتكاملتان: مجموعهما 180°', 'المتقابلتان بالرأس: متساويتان', 'مع مستقيمين متوازيين وقاطع: المتبادلتان متساويتان، والمتناظرتان متساويتان، والداخليتان في جهة واحدة مجموعهما 180°'], ex: 'مكملة الزاوية 65° = 180° − 65° = 115°', check: { q: 'ما قياس متممة الزاوية 35° ؟', o: ['55°', '145°', '35°', '65°'], a: 0 } },
  { id: 'triangle', domain: 'الهندسة والقياس', title: 'زوايا المثلث', f: ['مجموع زوايا المثلث = 180°', 'الزاوية الخارجية = مجموع الزاويتين الداخليتين البعيدتين', 'المثلث المتطابق الضلعين: زاويتا القاعدة متساويتان'], ex: 'زاويتان 50° و 60° ⇐ الثالثة 70°', check: { q: 'في مثلث متطابق الضلعين زاوية رأسه 40°، ما قياس كل من زاويتي القاعدة؟', o: ['70°', '40°', '140°', '50°'], a: 0 } },
  { id: 'polygon', domain: 'الهندسة والقياس', title: 'زوايا المضلعات', f: ['مجموع الزوايا الداخلية = (ن − 2) × 180°', 'الزاوية الداخلية للمضلع المنتظم = (ن − 2) × 180° ÷ ن', 'مجموع الزوايا الخارجية لأي مضلع = 360°'], ex: 'السداسي: (6 − 2) × 180° = 720°، وزاويته في المنتظم 120°', check: { q: 'ما الزاوية الخارجية للمضلع الثماني المنتظم؟', o: ['45°', '135°', '60°', '40°'], a: 0 } },
  { id: 'pythagoras', domain: 'الهندسة والقياس', title: 'نظرية فيثاغورس', f: ['في المثلث القائم: أ² + ب² = جـ²', 'جـ هو الوتر، وهو الضلع المقابل للزاوية القائمة وأطول الأضلاع', 'عكسها: إذا تحقق أ² + ب² = جـ² فالمثلث قائم', 'ثلاثيات مشهورة: (3، 4، 5) ، (5، 12، 13) ، (8، 15، 17)'], ex: 'ضلعا القائمة 6 و 8 ⇐ الوتر = √(36 + 64) = 10', check: { q: 'مثلث قائم وتره 13 وأحد ضلعيه 5. ما طول الضلع الآخر؟', o: ['12', '8', '18', '√194'], a: 0 } },
  { id: 'areas', domain: 'الهندسة والقياس', title: 'المساحات والمحيطات', f: ['المربع: م = ل² ، مح = 4ل', 'المستطيل: م = ل × ع ، مح = 2(ل + ع)', 'المثلث: م = ½ × القاعدة × الارتفاع', 'متوازي الأضلاع: م = القاعدة × الارتفاع', 'شبه المنحرف: م = ½ (ق₁ + ق₂) × ع', 'المعين: م = ½ × ق₁ × ق₂ (القطران)'], ex: 'شبه منحرف قاعدتاه 6 و 10 وارتفاعه 4: م = ½ × 16 × 4 = 32', check: { q: 'مساحة مثلث قاعدته 10 سم وارتفاعه 6 سم:', o: ['30 سم²', '60 سم²', '16 سم²', '15 سم²'], a: 0 } },
  { id: 'circle', domain: 'الهندسة والقياس', title: 'الدائرة', f: ['المحيط = 2 × ط × نق = ط × ق', 'المساحة = ط × نق²', 'ط ≈ 3.14 أو 22/7', 'القطر = 2 × نصف القطر'], ex: 'نق = 7 ، ط ≈ 22/7 ⇐ المحيط = 44 ، المساحة = 154', check: { q: 'دائرة نصف قطرها 10 سم. مساحتها تقريبًا (ط ≈ 3.14):', o: ['314 سم²', '62.8 سم²', '31.4 سم²', '100 سم²'], a: 0 } },
  { id: 'volume', domain: 'الهندسة والقياس', title: 'الحجوم', f: ['المكعب: ح = ل³', 'متوازي المستطيلات: ح = الطول × العرض × الارتفاع', 'المنشور: ح = مساحة القاعدة × الارتفاع', 'الأسطوانة: ح = ط × نق² × ع', 'الهرم: ح = ⅓ × مساحة القاعدة × الارتفاع', 'المخروط: ح = ⅓ × ط × نق² × ع'], ex: 'متوازي مستطيلات 5 × 3 × 2 ⇐ ح = 30', check: { q: 'حجم مكعب طول ضلعه 3 سم:', o: ['27 سم³', '9 سم³', '18 سم³', '54 سم³'], a: 0 } },
  { id: 'surface', domain: 'الهندسة والقياس', title: 'المساحة الكلية للمجسمات', f: ['المكعب: 6 ل²', 'متوازي المستطيلات: 2(ل ع + ل ض + ع ض)', 'الأسطوانة: الجانبية 2 ط نق ع ، والكلية 2 ط نق² + 2 ط نق ع', 'المنشور: الجانبية = محيط القاعدة × الارتفاع'], ex: 'مكعب ضلعه 2 ⇐ المساحة الكلية = 6 × 4 = 24', check: { q: 'المساحة الكلية لمتوازي مستطيلات أبعاده 3 و 2 و 1:', o: ['22', '6', '11', '12'], a: 0 } },
  { id: 'transform', domain: 'الهندسة والقياس', title: 'التحويلات الهندسية', f: ['الانسحاب (أ، ب): (س، ص) ← (س + أ، ص + ب)', 'الانعكاس حول محور السينات: (س، ص) ← (س، −ص)', 'الانعكاس حول محور الصادات: (س، ص) ← (−س، ص)', 'الدوران 180° حول الأصل: (س، ص) ← (−س، −ص)', 'التمدد بمعامل ك: (س، ص) ← (ك س، ك ص)'], ex: 'انعكاس (3، −2) حول محور السينات ← (3، 2)', check: { q: 'صورة النقطة (4، 1) بالانعكاس حول محور الصادات:', o: ['(−4، 1)', '(4، −1)', '(−4، −1)', '(1، 4)'], a: 0 } },
  { id: 'similar', domain: 'الهندسة والقياس', title: 'التشابه والتطابق', f: ['في الأشكال المتشابهة: الزوايا المتناظرة متساوية والأضلاع متناسبة', 'نسبة المحيطين = معامل التشابه ك', 'نسبة المساحتين = ك²', 'الأشكال المتطابقة: الأضلاع والزوايا المتناظرة متساوية'], ex: 'معامل التشابه 3 ومساحة الصغير 5 ⇐ مساحة الكبير 45', check: { q: 'مثلثان متشابهان معامل التشابه بينهما 2. إذا كان محيط الصغير 9، فمحيط الكبير:', o: ['18', '36', '11', '4.5'], a: 0 } },
  { id: 'coordinates', domain: 'الهندسة والقياس', title: 'المسافة ونقطة المنتصف', f: ['المسافة = √((س₂ − س₁)² + (ص₂ − ص₁)²)', 'نقطة المنتصف = ((س₁ + س₂) ÷ 2 ، (ص₁ + ص₂) ÷ 2)'], ex: 'بين (0، 0) و (3، 4): المسافة = √(9 + 16) = 5', check: { q: 'نقطة منتصف القطعة الواصلة بين (2، 4) و (6، 8):', o: ['(4، 6)', '(8، 12)', '(2، 2)', '(3، 4)'], a: 0 } },
  // ---------------- البيانات والاحتمالات ----------------
  { id: 'center', domain: 'البيانات والاحتمالات', title: 'مقاييس النزعة المركزية', f: ['المتوسط = مجموع القيم ÷ عددها', 'الوسيط: القيمة الوسطى بعد الترتيب (أو متوسط القيمتين الوسطيين)', 'المنوال: القيمة الأكثر تكرارًا', 'القيمة المتطرفة تؤثر في المتوسط أكثر من الوسيط'], ex: '2، 4، 4، 6، 9: المتوسط 5 ، الوسيط 4 ، المنوال 4', check: { q: 'ما وسيط القيم 7، 3، 9، 1، 5 ؟', o: ['5', '9', '3', '25'], a: 0 } },
  { id: 'spread', domain: 'البيانات والاحتمالات', title: 'التشتت: المدى والربيعات', f: ['المدى = أكبر قيمة − أصغر قيمة', 'الربيع الأدنى: وسيط النصف الأدنى ، الربيع الأعلى: وسيط النصف الأعلى', 'المدى الربيعي = الربيع الأعلى − الربيع الأدنى', 'القيمة المتطرفة: أقل من الربيع الأدنى − 1.5 × المدى الربيعي أو أكبر من الربيع الأعلى + 1.5 × المدى الربيعي'], ex: '3، 5، 8، 10، 14: المدى = 11', check: { q: 'ما مدى القيم 12، 4، 19، 7 ؟', o: ['15', '19', '8', '11'], a: 0 } },
  { id: 'probability', domain: 'البيانات والاحتمالات', title: 'الاحتمال البسيط والمتممة', f: ['ح(حادثة) = عدد النواتج المطلوبة ÷ عدد النواتج الممكنة', '0 ≤ ح ≤ 1', 'ح(ليس أ) = 1 − ح(أ)', 'الاحتمال التجريبي = عدد مرات الحدوث ÷ عدد المحاولات'], ex: 'مكعب الأرقام: ح(عدد زوجي) = 3/6 = ½', check: { q: 'إذا كان احتمال سقوط المطر 0.3، فاحتمال عدم سقوطه:', o: ['0.7', '0.3', '1.3', '0'], a: 0 } },
  { id: 'counting', domain: 'البيانات والاحتمالات', title: 'مبدأ العد الأساسي', f: ['عدد النواتج = حاصل ضرب عدد الخيارات في كل مرحلة', 'يُستعمل الرسم الشجري أو الجدول لعرض فضاء العينة'], ex: '3 قمصان و 4 سراويل ⇐ 12 زيًّا', check: { q: 'كم ناتجًا لرمي قطعة نقد ومكعب أرقام معًا؟', o: ['12', '8', '6', '36'], a: 0 } },
  { id: 'independent', domain: 'البيانات والاحتمالات', title: 'الحوادث المستقلة وغير المستقلة', f: ['المستقلتان: ح(أ و ب) = ح(أ) × ح(ب)', 'غير المستقلتين (السحب دون إرجاع): ح(أ و ب) = ح(أ) × ح(ب بعد أ)', 'المتنافيتان: ح(أ أو ب) = ح(أ) + ح(ب)'], ex: 'رمي قطعة نقد مرتين: ح(صورتين) = ½ × ½ = ¼', check: { q: 'في كيس 3 كرات حمراء و 2 زرقاء. سُحبت كرتان دون إرجاع. احتمال أن تكونا حمراوين:', o: ['3/10', '9/25', '6/25', '½'], a: 0 } },
  { id: 'graphs', domain: 'البيانات والاحتمالات', title: 'اختيار التمثيل البياني المناسب', f: ['القطاعات الدائرية: أجزاء من كل', 'الخطوط: التغير عبر الزمن', 'الأعمدة: مقارنة فئات', 'المدرج التكراري: بيانات عددية في فئات', 'الصندوق وطرفاه: التوزيع والتشتت والمقارنة', 'نقاط الانتشار: العلاقة بين متغيرين'], ex: 'درجات الحرارة خلال أسبوع ← تمثيل بالخطوط', check: { q: 'أي تمثيل أنسب لعرض توزيع ميزانية على أربعة بنود؟', o: ['القطاعات الدائرية', 'الخطوط', 'نقاط الانتشار', 'الصندوق وطرفاه'], a: 0 } },
];

const CSS = `
.rv{direction:rtl}
.rv-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.rv-tabs button,.rv-chip{border:1px solid #e6e9f2;background:#fff;border-radius:12px;padding:8px 14px;font:inherit;font-weight:800;cursor:pointer}
.rv-tabs button.on,.rv-chip.on{background:#0284c7;border-color:#0284c7;color:#fff}
.rv-card{background:#fff;border:1px solid #e6e9f2;border-radius:18px;padding:18px;box-shadow:0 1px 2px rgba(43,36,87,.05)}
.rv-grid{display:grid;grid-template-columns:repeat(13,minmax(0,1fr));gap:3px;direction:rtl;user-select:none}
.rv-grid button{aspect-ratio:1;border:0;border-radius:7px;background:hsl(var(--h,210) 90% 95%);font:inherit;font-weight:700;font-size:clamp(10px,1.6vw,15px);cursor:pointer;color:#1e2340;transition:transform .15s}
.rv-grid button:hover{transform:scale(1.18);z-index:1;box-shadow:0 4px 12px rgba(0,0,0,.12)}.rv-grid .sq{background:#fde68a;color:#92400e}
.rv-grid .h{background:linear-gradient(135deg,#0284c7,#7c3aed);color:#fff;font-weight:900}
.rv-grid .row,.rv-grid .col{background:#fbcfe8}.rv-grid .hit{background:#e11d48;color:#fff;transform:scale(1.25);box-shadow:0 6px 18px rgba(225,29,72,.45)}
.rv-big{font-size:clamp(2rem,7vw,3.4rem);font-weight:900;text-align:center;font-family:inherit;direction:ltr;unicode-bidi:isolate}
.rv-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}
.rv-opts button{border:0;background:linear-gradient(135deg,hsl(var(--h,210) 85% 55%),hsl(calc(var(--h,210) + 30) 85% 62%));color:#fff;border-radius:18px;padding:16px;font:inherit;font-size:1.7rem;font-weight:900;cursor:pointer;box-shadow:0 5px 0 rgba(0,0,0,.15);transition:transform .12s}.rv-opts button:active{transform:translateY(3px);box-shadow:0 2px 0 rgba(0,0,0,.15)}
.rv-opts button.ok{background:#10b981;transform:scale(1.06)}.rv-opts button.no{background:#e11d48;animation:rvshake .4s}
@keyframes rvshake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(5px)}}
.rv-bar{height:10px;border-radius:9px;background:#e6e9f2;overflow:hidden}.rv-bar i{display:block;height:100%;background:#0284c7;transition:width .3s linear}
.rv-stats{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:10px}.rv-stats span{background:#f4f6fb;border-radius:10px;padding:6px 12px;font-weight:800}
.rv-laws{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(290px,1fr))}
.rv-law h3{font-family:inherit;font-weight:800;font-size:1.1rem;margin:0}
.rv-law .dom{font-size:12px;color:#0369a1;font-weight:800}
.rv-law ul{margin:10px 0 0;padding:0;list-style:none;display:grid;gap:6px}
.rv-law li{background:#f6f9ff;border-radius:10px;padding:7px 10px;font-weight:700;line-height:1.8;text-align:start}
.rv-law .ex{margin-top:10px;font-size:14px;color:#475069;line-height:1.8}
.rv-law .ex b{color:#d97706}
.rv-law .act{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
.rv-law .act button{border:1px solid #e6e9f2;background:#fff;border-radius:10px;padding:6px 12px;font:inherit;font-size:13px;font-weight:800;cursor:pointer}
.rv-law .act button.done{background:#e6fbf7;border-color:#14b8a6;color:#0b6b62}
.rv-q{margin-top:10px;border-top:1px dashed #e6e9f2;padding-top:10px}
.rv-q .o{display:grid;gap:6px;margin-top:8px}.rv-q .o button{border:1px solid #e6e9f2;background:#fff;border-radius:10px;padding:8px;font:inherit;font-weight:700;text-align:start;cursor:pointer}
.rv-q .o button.ok{border-color:#14b8a6;background:#e6fbf7}.rv-q .o button.no{border-color:#e8466c;background:#fdecef}
.rv-vids{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:10px;font-size:12px;font-weight:800;color:#64748b}
.rv-vid{display:inline-block;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:800;text-decoration:none;color:#fff;background:#ef4444}
.rv-vid-asmari{background:#8b5cf6}.rv-vid-ien-yt{background:#0d9488}.rv-vid-ien{background:#0284c7}.rv-vid:hover{filter:brightness(1.1)}
.rv-search{flex:1;min-width:180px;border:1px solid #e6e9f2;border-radius:12px;padding:9px 12px;font:inherit}

.mx-hero{display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;border-radius:24px;padding:22px;color:#fff;background:linear-gradient(135deg,#7c3aed,#0284c7 55%,#06b6d4);box-shadow:0 10px 30px rgba(2,132,199,.25)}
.mx-hero h2{margin:2px 0;font-size:1.7rem;font-weight:900}.mx-hero p{margin:0;opacity:.92}.mx-kicker{font-weight:800;opacity:.85}
.mx-stats{display:flex;gap:10px;flex-wrap:wrap}.mx-stats span{background:rgba(255,255,255,.18);border-radius:16px;padding:8px 14px;text-align:center;font-size:12px;font-weight:700}.mx-stats b{display:block;font-size:1.6rem;font-weight:900}
.mx-h{margin:20px 0 10px;font-size:1.3rem;font-weight:900}
.mx-tables{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}
.mx-tile{border:0;border-radius:20px;padding:12px 6px;color:#fff;cursor:pointer;background:linear-gradient(160deg,var(--c),color-mix(in srgb,var(--c) 70%,#000));box-shadow:0 6px 0 color-mix(in srgb,var(--c) 60%,#000);display:flex;flex-direction:column;align-items:center;gap:2px;font:inherit;transition:transform .15s}
.mx-tile:hover{transform:translateY(-4px) rotate(-2deg)}.mx-n{font-size:2.2rem;font-weight:900;line-height:1}.mx-x{font-size:11px;opacity:.9}.mx-s{color:#fde047;letter-spacing:2px}.mx-s em{font-style:normal;color:rgba(255,255,255,.35)}
.mx-row{display:grid;gap:14px;margin-top:16px}@media(min-width:900px){.mx-row{grid-template-columns:1fr 1.2fr}}
.mx-row h3{margin:0 0 4px;font-size:1.2rem;font-weight:900}.mx-row p{margin:0 0 10px;color:#64748b}
.mx-chips{display:flex;flex-wrap:wrap;gap:6px}.mx-chip{border:2px solid var(--c);color:var(--c);background:#fff;border-radius:12px;min-width:40px;padding:6px 8px;font:inherit;font-weight:900;cursor:pointer}.mx-chip.on{background:var(--c);color:#fff}
.mx-go,.mx-hard{display:block;width:100%;margin-top:12px;border:0;border-radius:16px;padding:14px;font:inherit;font-size:1.1rem;font-weight:900;color:#fff;cursor:pointer;background:linear-gradient(135deg,#f97316,#e11d48);box-shadow:0 5px 0 #9f1239}
.mx-hard{background:linear-gradient(135deg,#7c3aed,#c026d3);box-shadow:0 5px 0 #6b21a8}
.mx-show{min-height:34px;font-size:1.1rem}.mx-show b{font-size:1.6rem;color:#e11d48}.mx-show span{background:#fde68a;border-radius:8px;padding:2px 8px;font-size:12px;font-weight:800}.mx-show.pop{animation:mxpop .35s}
.mx-tv{text-align:center}.mx-tvh{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px}.mx-tvh h2{margin:0;font-size:2rem;font-weight:900;color:var(--c)}.mx-tvh .mx-go{width:auto;margin:0;padding:10px 18px}
.mx-back{border:1px solid #e6e9f2;background:#fff;border-radius:12px;padding:8px 12px;font:inherit;font-weight:800;cursor:pointer}.mx-tip{color:#64748b}
.mx-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;perspective:800px}
.mx-card{position:relative;height:74px;border:0;background:none;cursor:pointer;transform-style:preserve-3d;transition:transform .5s;font:inherit}
.mx-card span{position:absolute;inset:0;display:grid;place-items:center;border-radius:16px;backface-visibility:hidden;font-size:1.4rem;font-weight:900}
.mx-card .f{background:#fff;border:3px solid var(--c);color:var(--c)}.mx-card .b{background:var(--c);color:#fff;transform:rotateY(180deg);font-size:1.9rem}.mx-card.flip{transform:rotateY(180deg)}
.mx-all{margin-top:14px;border:2px dashed var(--c);color:var(--c);background:#fff;border-radius:14px;padding:10px 18px;font:inherit;font-weight:900;cursor:pointer}
.mx-game{position:relative;max-width:560px;margin:0 auto;border-radius:28px;padding:18px;background:linear-gradient(180deg,#eef2ff,#fff);overflow:hidden}
.mx-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
.mx-ring{width:96px;height:96px}.mx-ring circle{fill:none;stroke-width:10}.mx-ring .bg{stroke:#e0e7ff}.mx-ring .fg{stroke:#6366f1;stroke-linecap:round;transform:rotate(-90deg);transform-origin:60px 60px;transition:stroke-dashoffset .2s linear}.mx-ring .fg.late{stroke:#e11d48}.mx-ring .t{font-size:30px;font-weight:900;fill:#1e1b4b}
.mx-score,.mx-combo{text-align:center;border-radius:18px;padding:8px 14px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.06)}.mx-score b,.mx-combo b{display:block;font-size:1.9rem;font-weight:900}.mx-score span,.mx-combo span{font-size:12px;font-weight:800;color:#64748b}
.mx-combo.hot{background:#ffedd5}.mx-combo.fire{background:linear-gradient(135deg,#f97316,#e11d48);color:#fff;animation:mxpulse .8s infinite}.mx-combo.fire span{color:#fff}
.mx-label{text-align:center;font-weight:900;color:#6366f1;margin:10px 0 0}.mx-q{margin:14px 0 6px}.mx-q.in{animation:mxin .3s ease-out}
.mx-fx{text-align:center;min-height:28px;font-size:1.3rem;font-weight:900;color:#f97316;margin:10px 0 0}.mx-fx.pop{animation:mxpop .4s}
.mx-conf{position:absolute;width:10px;height:10px;border-radius:3px;pointer-events:none;animation:mxconf .9s ease-out forwards}
.mx-end{position:relative;text-align:center;max-width:560px;margin:0 auto;border-radius:28px;padding:26px;background:linear-gradient(180deg,#fef3c7,#fff);overflow:hidden}
.mx-medal{font-size:4.5rem;margin:0;animation:mxpop .6s}.mx-end h2{margin:4px 0;font-size:2rem;font-weight:900}.mx-rec{font-weight:900;color:#b45309}.mx-goals{font-size:12px;color:#64748b}
@keyframes mxpop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
@keyframes mxin{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}
@keyframes mxpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes mxconf{to{transform:translate(var(--dx),var(--dy)) rotate(540deg);opacity:0}}
@media (prefers-reduced-motion:reduce){.mx-conf,.mx-combo.fire,.mx-medal,.mx-q.in,.mx-fx.pop,.mx-show.pop{animation:none}.mx-card{transition:none}}
@media print{.rv-tabs,.rv-law .act,.rv-q,.rv-tools,.rv-vids{display:none!important}.rv-law{break-inside:avoid}}
`;
/** اتجاه السطر: العبارات العددية الخالصة من اليسار إلى اليمين، وما فيه حروف عربية من اليمين */
const dirOf = (t: string) => (/[\u0621-\u064A]/.test(t) ? 'rtl' : 'ltr');
function injectCss() { if (typeof document === 'undefined' || document.getElementById('rv-css')) return; const s = document.createElement('style'); s.id = 'rv-css'; s.textContent = CSS; document.head.appendChild(s); }

export interface ReviewStore { get(): ReviewData; set(d: ReviewData): void; onStars?(n: number): void; play?(k: 'ok' | 'no'): void }
export interface ReviewData { multBest: Record<string, number>; multWrong: Record<string, number>; multTotal: number; lawsDone: string[]; tableStats: Record<string, { ok: number; total: number }> }
export const emptyReview = (): ReviewData => ({ multBest: {}, multWrong: {}, multTotal: 0, lawsDone: [], tableStats: {} });
const shuffle = <T,>(a: T[]) => a.map((x) => [Math.random(), x] as const).sort((x, y) => x[0] - y[0]).map((x) => x[1]);

/** يرسم قسم المراجعة داخل العنصر المعطى */
export function mountReview(root: HTMLElement, store: ReviewStore, start: 'mult' | 'laws' = 'mult'): () => void {
  injectCss();
  let tab = start, timer: ReturnType<typeof setInterval> | undefined;
  const D = () => Object.assign(emptyReview(), store.get());
  const save = (d: ReviewData) => store.set(d);
  const stop = () => { if (timer) clearInterval(timer); timer = undefined; };

  function frame() {
    stop();
    root.innerHTML = `<div class="rv"><div class="rv-tabs"><button data-tab="mult" class="${tab === 'mult' ? 'on' : ''}">جدول الضرب</button><button data-tab="laws" class="${tab === 'laws' ? 'on' : ''}">القوانين والنظريات</button></div><div class="rv-body"></div></div>`;
    root.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((b) => (b.onclick = () => { tab = b.dataset.tab as typeof tab; frame(); }));
    const body = root.querySelector('.rv-body') as HTMLElement;
    if (tab === 'mult') multHome(body); else laws(body);
  }

  // ---------------- جدول الضرب ----------------
  let tables: number[] = [];
  const TCOL = (n: number) => `hsl(${(n * 29) % 360} 80% 52%)`;
  const starsOf = (s?: { ok: number; total: number }) => (!s || s.total < 5 ? 0 : s.ok / s.total >= 0.95 ? 3 : s.ok / s.total >= 0.8 ? 2 : s.ok / s.total >= 0.6 ? 1 : 0);
  const burst = (host: HTMLElement, n = 14) => {
    const r = host.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i'); p.className = 'mx-conf';
      p.style.left = `${r.width / 2}px`; p.style.top = `${r.height / 2}px`;
      p.style.background = `hsl(${Math.random() * 360} 90% 60%)`;
      p.style.setProperty('--dx', `${(Math.random() - 0.5) * 320}px`); p.style.setProperty('--dy', `${-60 - Math.random() * 180}px`);
      host.appendChild(p); setTimeout(() => p.remove(), 900);
    }
  };

  function multHome(body: HTMLElement) {
    const d = D(), hard = Object.entries(d.multWrong).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
    const best = Math.max(0, ...Object.values(d.multBest));
    body.innerHTML = `
      <div class="mx-hero"><div><p class="mx-kicker">جدول الضرب</p><h2>كم جدولًا تتقنين؟</h2><p>جداول ملونة، وتحدي الدقيقة، وسلسلة إجابات تشعل النجوم.</p></div>
        <div class="mx-stats"><span><b>${best}</b>أفضل نتيجة</span><span><b>${d.multTotal}</b>إجابة صحيحة</span><span><b>${Object.values(d.tableStats).filter((s) => starsOf(s) === 3).length}</b>جداول بثلاث نجوم</span></div></div>
      <h3 class="mx-h">الجداول</h3>
      <div class="mx-tables">${Array.from({ length: 11 }, (_, k) => k + 2).map((n) => { const st = starsOf(d.tableStats[n]); return `<button class="mx-tile" data-open="${n}" style="--c:${TCOL(n)}"><span class="mx-n">${n}</span><span class="mx-x" dir="ltr">× 1 … 12</span><span class="mx-s">${'★'.repeat(st)}<em>${'★'.repeat(3 - st)}</em></span></button>`; }).join('')}</div>
      <div class="mx-row">
        <div class="rv-card mx-chal"><h3>⚡ تحدي الدقيقة</h3><p>اختيار جدول أو أكثر، أو تحدٍّ مختلط من كل الجداول.</p>
          <div class="mx-chips">${Array.from({ length: 11 }, (_, k) => k + 2).map((n) => `<button class="mx-chip ${tables.includes(n) ? 'on' : ''}" data-t="${n}" style="--c:${TCOL(n)}">${n}</button>`).join('')}</div>
          <button class="mx-go">بدء التحدي ${tables.length ? `(${tables.join('، ')})` : '(مختلط)'}</button>
          ${hard.length ? `<button class="mx-hard">🎯 مراجعة الحقائق الصعبة (${hard.length})</button>` : ''}</div>
        <div class="rv-card"><h3>🧮 الجدول التفاعلي</h3><p class="mx-show" aria-live="polite">الضغط على أي خانة يُظهر حاصل الضرب</p><div class="rv-grid"></div></div>
      </div>`;
    const grid = body.querySelector('.rv-grid') as HTMLElement, show = body.querySelector('.mx-show') as HTMLElement;
    let html = '<button class="h">×</button>';
    for (let c = 1; c <= 12; c++) html += `<button class="h" data-c="${c}">${c}</button>`;
    for (let r = 1; r <= 12; r++) { html += `<button class="h" data-r="${r}">${r}</button>`; for (let c = 1; c <= 12; c++) html += `<button data-r="${r}" data-c="${c}" class="${r === c ? 'sq' : ''}" style="--h:${(r * c * 2.4) % 360}">${r * c}</button>`; }
    grid.innerHTML = html;
    grid.onclick = (e) => {
      const b = (e.target as HTMLElement).closest('button'); if (!b) return;
      const r = +(b.dataset.r ?? 0), c = +(b.dataset.c ?? 0);
      grid.querySelectorAll('button').forEach((x) => { x.classList.remove('row', 'col', 'hit'); const xr = +(x.dataset.r ?? 0), xc = +(x.dataset.c ?? 0);
        if (r && c && !x.classList.contains('h')) { if (xr === r && xc <= c) x.classList.add('row'); if (xc === c && xr <= r) x.classList.add('col'); if (xr === r && xc === c) x.classList.add('hit'); } });
      if (r && c) { show.innerHTML = `<b dir="ltr">${r} × ${c} = ${r * c}</b>${r === c ? ' <span>مربع كامل</span>' : ''}`; show.classList.remove('pop'); void show.offsetWidth; show.classList.add('pop'); store.play?.('ok'); }
    };
    body.querySelectorAll<HTMLButtonElement>('[data-open]').forEach((b) => (b.onclick = () => tableView(body, +b.dataset.open!)));
    body.querySelectorAll<HTMLButtonElement>('[data-t]').forEach((b) => (b.onclick = () => { const n = +b.dataset.t!; tables = tables.includes(n) ? tables.filter((x) => x !== n) : [...tables, n].sort((a, b2) => a - b2); multHome(body); }));
    (body.querySelector('.mx-go') as HTMLButtonElement).onclick = () => game(body, false);
    const hb = body.querySelector('.mx-hard') as HTMLButtonElement | null; if (hb) hb.onclick = () => game(body, true);
  }
  const key = () => (tables.length ? tables.join('-') : 'mix');

  /** جدول واحد: بطاقات تنقلب لكشف الناتج، ثم تحدي هذا الجدول */
  function tableView(body: HTMLElement, n: number) {
    const c = TCOL(n);
    body.innerHTML = `<div class="mx-tv" style="--c:${c}"><div class="mx-tvh"><button class="mx-back">→ الجداول</button><h2>جدول ${n}</h2><button class="mx-go mx-tgo">⚡ تحدي جدول ${n}</button></div>
      <p class="mx-tip">الضغط على البطاقة يقلبها ويكشف الناتج.</p>
      <div class="mx-cards">${Array.from({ length: 12 }, (_, k) => k + 1).map((k) => `<button class="mx-card" data-k="${k}"><span class="f" dir="ltr">${n} × ${k}</span><span class="b" dir="ltr">${n * k}</span></button>`).join('')}</div>
      <button class="mx-all">كشف الكل</button></div>`;
    body.querySelectorAll<HTMLButtonElement>('.mx-card').forEach((b) => (b.onclick = () => { b.classList.toggle('flip'); store.play?.('ok'); }));
    (body.querySelector('.mx-all') as HTMLButtonElement).onclick = () => body.querySelectorAll('.mx-card').forEach((b, i) => setTimeout(() => b.classList.add('flip'), i * 70));
    (body.querySelector('.mx-back') as HTMLButtonElement).onclick = () => multHome(body);
    (body.querySelector('.mx-tgo') as HTMLButtonElement).onclick = () => { tables = [n]; game(body, false); };
  }

  function game(body: HTMLElement, hardMode: boolean) {
    const d0 = D(), hardFacts = Object.entries(d0.multWrong).filter(([, n]) => n > 0).map(([f]) => f.split(' × ').map(Number));
    let score = 0, streak = 0, best = 0, wrong = 0, left = 60, answered = false;
    const end = Date.now() + 60000, C = 2 * Math.PI * 52;
    body.innerHTML = `<div class="mx-game"><div class="mx-top">
        <svg class="mx-ring" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="bg"/><circle cx="60" cy="60" r="52" class="fg" style="stroke-dasharray:${C};stroke-dashoffset:0"/><text x="60" y="68" text-anchor="middle" class="t">60</text></svg>
        <div class="mx-score"><b>0</b><span>صحيحة</span></div>
        <div class="mx-combo"><b>0</b><span>🔥 سلسلة</span></div></div>
      <p class="mx-label">${hardMode ? '🎯 الحقائق الصعبة' : tables.length ? `جدول ${tables.join('، ')}` : 'تحدٍّ مختلط'}</p>
      <p class="rv-big mx-q"></p><div class="rv-opts"></div><p class="mx-fx"></p>
      <div style="text-align:center;margin-top:10px"><button class="rv-chip rv-quit">إنهاء</button></div></div>`;
    const G = body.querySelector('.mx-game') as HTMLElement;
    const upd = () => { (G.querySelector('.mx-score b') as HTMLElement).textContent = String(score); const cb = G.querySelector('.mx-combo') as HTMLElement; (cb.querySelector('b') as HTMLElement).textContent = String(streak); cb.classList.toggle('hot', streak >= 3); cb.classList.toggle('fire', streak >= 6); };
    const next = () => {
      let a: number, b: number;
      if (hardMode && hardFacts.length) [a, b] = hardFacts[Math.floor(Math.random() * hardFacts.length)];
      else { a = tables.length ? tables[Math.floor(Math.random() * tables.length)] : 2 + Math.floor(Math.random() * 11); b = 1 + Math.floor(Math.random() * 12); }
      const table = a; if (Math.random() < 0.5) [a, b] = [b, a];
      const missing = !hardMode && Math.random() < 0.25, ans = missing ? b : a * b;
      const pool = new Set<number>([ans]);
      const near = missing ? [ans + 1, ans - 1, ans + 2, ans - 2, a, ans + 3] : [ans + a, ans - a, ans + b, ans - b, (a + 1) * b, a * (b + 1), ans + 10, ans - 1];
      for (const x of shuffle(near)) { if (pool.size >= 4) break; if (x > 0) pool.add(x); }
      while (pool.size < 4) pool.add(ans + pool.size * 3);
      answered = false;
      const q = G.querySelector('.mx-q') as HTMLElement; q.textContent = missing ? `${a} × ? = ${a * b}` : `${a} × ${b} = ?`; q.classList.remove('in'); void q.offsetWidth; q.classList.add('in');
      const box = G.querySelector('.rv-opts') as HTMLElement;
      box.innerHTML = shuffle([...pool]).map((o, i) => `<button data-v="${o}" style="--h:${i * 90 + 200}">${o}</button>`).join('');
      box.onclick = (e) => {
        const btn = (e.target as HTMLElement).closest('button'); if (!btn || answered || left <= 0) return; answered = true;
        const ok = +btn.dataset.v! === ans, fact = `${Math.min(a, b)} × ${Math.max(a, b)}`, d = D(), ts = (d.tableStats[table] ??= { ok: 0, total: 0 });
        ts.total++; const fx = G.querySelector('.mx-fx') as HTMLElement;
        if (ok) { score++; streak++; best = Math.max(best, streak); d.multTotal++; ts.ok++; if (d.multWrong[fact]) d.multWrong[fact]--; btn.classList.add('ok'); store.play?.('ok');
          fx.textContent = streak >= 10 ? '🌟 أسطوري!' : streak >= 6 ? '🔥 مشتعلة!' : streak >= 3 ? '⚡ سلسلة رائعة' : '+1'; if (streak % 5 === 0) burst(G, 22); }
        else { wrong++; streak = 0; d.multWrong[fact] = (d.multWrong[fact] ?? 0) + 2; btn.classList.add('no'); box.querySelector(`[data-v="${ans}"]`)?.classList.add('ok'); store.play?.('no'); fx.textContent = `${a} × ${b} = ${a * b}`; }
        fx.classList.remove('pop'); void fx.offsetWidth; fx.classList.add('pop');
        save(d); upd();
        setTimeout(() => { if (left > 0) next(); }, ok ? 280 : 1000);
      };
    };
    upd(); next();
    const finish = () => {
      stop(); const d = D(), k = hardMode ? 'hard' : key(), prev = d.multBest[k] ?? 0, rec = score > prev;
      if (rec) d.multBest[k] = score; save(d); if (score >= 5) store.onStars?.(Math.floor(score / 5));
      const medal = score >= 30 ? ['🥇', 'ذهبية'] : score >= 20 ? ['🥈', 'فضية'] : score >= 10 ? ['🥉', 'برونزية'] : ['🌱', 'بداية جيدة'];
      body.innerHTML = `<div class="mx-end"><p class="mx-medal">${medal[0]}</p><h2>${score} إجابة صحيحة</h2><p>ميدالية ${medal[1]}</p>
        <div class="rv-stats"><span>✗ ${wrong}</span><span>أطول سلسلة 🔥 ${best}</span>${score >= 5 ? `<span>+${Math.floor(score / 5)} ★</span>` : ''}</div>
        <p class="mx-rec">${rec ? '🏆 رقم قياسي جديد!' : `أفضل نتيجة: ${prev}`}</p>
        <p class="mx-goals">البرونزية من 10 · الفضية من 20 · الذهبية من 30</p>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap"><button class="mx-go rv-again">⚡ تحدٍّ جديد</button><button class="rv-chip rv-back">جدول الضرب</button></div></div>`;
      if (rec || score >= 10) burst(body.querySelector('.mx-end') as HTMLElement, 30);
      (body.querySelector('.rv-again') as HTMLButtonElement).onclick = () => game(body, hardMode);
      (body.querySelector('.rv-back') as HTMLButtonElement).onclick = () => multHome(body);
    };
    (G.querySelector('.rv-quit') as HTMLButtonElement).onclick = finish;
    timer = setInterval(() => {
      left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      const t = G.querySelector('.mx-ring .t'); if (t) t.textContent = String(left);
      const fg = G.querySelector('.mx-ring .fg') as SVGCircleElement | null; if (fg) { fg.style.strokeDashoffset = String(C * (1 - left / 60)); fg.classList.toggle('late', left <= 10); }
      if (left <= 0) finish();
    }, 200);
  }

  // ---------------- القوانين والنظريات ----------------
  let dom = 'الكل', q = '';
  function laws(body: HTMLElement) {
    const d = D();
    const list = LAWS.filter((l) => (dom === 'الكل' || l.domain === dom) && (!q || (l.title + l.f.join(' ') + l.ex).includes(q)));
    body.innerHTML = `<div class="rv-tools" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px">${['الكل', ...DOMAINS].map((x) => `<button class="rv-chip ${x === dom ? 'on' : ''}" data-d="${x}">${x}</button>`).join('')}
      <input class="rv-search" placeholder="بحث: فيثاغورس، الدائرة، الميل…" value="${q}"><button class="rv-chip rv-print">طباعة الملخص</button></div>
      <p style="margin:0 0 12px;color:#475069;font-weight:700">راجعت ${d.lawsDone.length} من ${LAWS.length} قانونًا</p>
      <div class="rv-bar" style="margin-bottom:16px"><i style="width:${(d.lawsDone.length / LAWS.length) * 100}%"></i></div>
      <div class="rv-laws">${list.map((l) => `<article class="rv-card rv-law" data-id="${l.id}"><span class="dom">${l.domain}</span><h3>${l.title}</h3><ul>${l.f.map((x) => `<li dir="${dirOf(x)}">${x}</li>`).join('')}</ul>
        <p class="ex"><b>مثال:</b> <bdi dir="${dirOf(l.ex)}" style="display:inline-block">${l.ex}</bdi></p><div class="rv-vids"><span>شروحات:</span>${videoLinksHTML(l.title)}</div><div class="act">${l.check ? '<button class="try">سؤال تحقق</button>' : ''}<button class="mark ${d.lawsDone.includes(l.id) ? 'done' : ''}">${d.lawsDone.includes(l.id) ? '✓ راجعته' : 'تمت المراجعة'}</button></div><div class="rv-q" hidden></div></article>`).join('') || '<p>لا توجد نتائج.</p>'}</div>`;
    body.querySelectorAll<HTMLButtonElement>('[data-d]').forEach((b) => (b.onclick = () => { dom = b.dataset.d!; laws(body); }));
    const inp = body.querySelector('.rv-search') as HTMLInputElement;
    inp.oninput = () => { q = inp.value.trim(); const pos = inp.selectionStart; laws(body); const n = body.querySelector('.rv-search') as HTMLInputElement; n.focus(); n.setSelectionRange(pos, pos); };
    (body.querySelector('.rv-print') as HTMLButtonElement).onclick = () => window.print();
    body.querySelectorAll<HTMLElement>('.rv-law').forEach((card) => {
      const l = LAWS.find((x) => x.id === card.dataset.id)!;
      (card.querySelector('.mark') as HTMLButtonElement).onclick = () => { const dd = D(); dd.lawsDone = dd.lawsDone.includes(l.id) ? dd.lawsDone.filter((x) => x !== l.id) : [...dd.lawsDone, l.id]; save(dd); laws(body); };
      const t = card.querySelector('.try') as HTMLButtonElement | null;
      if (t && l.check) t.onclick = () => {
        const box = card.querySelector('.rv-q') as HTMLElement; box.hidden = false;
        const order = shuffle(l.check!.o.map((o, i) => [o, i] as const));
        box.innerHTML = `<b>${l.check!.q}</b><div class="o">${order.map(([o, i]) => `<button data-i="${i}">${o}</button>`).join('')}</div><p class="fb" style="margin:8px 0 0;font-weight:800"></p>`;
        box.querySelector('.o')!.addEventListener('click', (e) => {
          const b = (e.target as HTMLElement).closest('button'); if (!b || box.dataset.done) return; box.dataset.done = '1';
          const ok = +b.dataset.i! === l.check!.a; b.classList.add(ok ? 'ok' : 'no'); box.querySelector(`[data-i="${l.check!.a}"]`)?.classList.add('ok');
          (box.querySelector('.fb') as HTMLElement).textContent = ok ? 'إجابة صحيحة.' : `الإجابة الصحيحة: ${l.check!.o[l.check!.a]}`; store.play?.(ok ? 'ok' : 'no');
          if (ok) { const dd = D(); if (!dd.lawsDone.includes(l.id)) { dd.lawsDone.push(l.id); save(dd); } }
        });
      };
    });
  }

  frame();
  return () => { stop(); root.innerHTML = ''; };
}
