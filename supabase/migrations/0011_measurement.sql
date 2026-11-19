-- =====================================================================
-- القياس القبلي والبعدي: نموذجان متكافئان، سؤال لكل معيار من المعايير الـ19.
-- أسئلتهما في بنك منفصل (measure) لا يظهر في التدريب ولا في المكتبة.
-- يُفتح القبلي مباشرة، ويفتح المعلم البعدي في نهاية البرنامج. محاولة واحدة لكل طالب.
-- (مولَّد بالأمر: python3 scripts/gen-booklet-sql.py)
-- =====================================================================
alter table questions drop constraint if exists questions_bank_check;
alter table questions add constraint questions_bank_check check (bank in ('practice', 'library', 'measure'));
alter table assessments add column if not exists description text;
insert into assessments (kind, form_label, title, is_open, sort_order, description) values
  ('pre', 'نموذج أ', 'القياس القبلي', true, 0, 'تحديد المستوى قبل بدء التدريب'),
  ('post', 'نموذج ب', 'القياس البعدي', false, 1, 'قياس التقدم في نهاية البرنامج');
with s as (select id from skills where code = 'G8-S01'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 3, 'mcq', 'ثلاث آلات تعمل في دورات منتظمة: الأولى كل 16 ثانية، والثانية كل 24 ثانية، والثالثة كل 36 ثانية. بدأت الثلاث معًا الساعة 8:00 صباحًا. كم مرة أخرى تعمل الثلاث في اللحظة نفسها خلال الساعة التالية؟', null, '[{"id": "a", "text": "25"}, {"id": "b", "text": "24"}, {"id": "c", "text": "36"}, {"id": "d", "text": "16"}]'::jsonb, '{"value": "a"}'::jsonb, '["المضاعف المشترك الأصغر للأعداد 16 و 24 و 36 هو 144 ثانية.", "الساعة 3600 ثانية، و 3600 ÷ 144 = 25 مرة."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 15'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 1 from a, qi;
with s as (select id from skills where code = 'G8-S01'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'لدى رنا بطاقات عليها الأرقام 3، 4، 5، 6، 7، 8. تريد تكوين أصغر عدد من ثلاث منازل بحيث يمكن استخدام الرقم الواحد مرتين كحد أقصى. ما العدد؟', null, '[{"id": "a", "text": "345"}, {"id": "b", "text": "334"}, {"id": "c", "text": "333"}, {"id": "d", "text": "343"}]'::jsonb, '{"value": "b"}'::jsonb, '["أصغر رقم 3، ويمكن تكراره مرتين فقط.", "العدد 333 غير مسموح، فالأصغر 334."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 23'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 1 from a, qi;
with s as (select id from skills where code = 'G8-S02'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'إذا كان مجموع خمسة أعداد صحيحة متتالية يساوي −35، فما العدد الأصغر بينها؟', null, '[{"id": "a", "text": "−9"}, {"id": "b", "text": "−8"}, {"id": "c", "text": "−7"}, {"id": "d", "text": "−5"}]'::jsonb, '{"value": "a"}'::jsonb, '["العدد الأوسط = −35 ÷ 5 = −7.", "الأعداد: −9، −8، −7، −6، −5، وأصغرها −9."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 4'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 2 from a, qi;
with s as (select id from skills where code = 'G8-S02'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'يهبط غواص إلى عمق 18 مترًا تحت سطح البحر، ويقف حارس على برج ارتفاعه 12 مترًا فوق سطح البحر. أي التعبيرات يمثّل المسافة العمودية الصحيحة بينهما؟', null, '[{"id": "a", "text": "12 + (−18)"}, {"id": "b", "text": "12 + |−18|"}, {"id": "c", "text": "18 − 12"}, {"id": "d", "text": "|12| − |−18|"}]'::jsonb, '{"value": "b"}'::jsonb, '["موقع الغواص −18 وموقع الحارس 12.", "المسافة = 12 + |−18| = 30 مترًا."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 4'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 2 from a, qi;
with s as (select id from skills where code = 'G8-S03'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 3, 'mcq', 'في مسح حول مهنة المستقبل كانت نسب الاختيار: الهندسة 21/100، الطب 7/25، التمريض 9/50، الطيران ⅕، التدريس 9/100، التجارة 1/25. ما ترتيب المهن من الأكثر اختيارًا إلى الأقل؟', null, '[{"id": "a", "text": "هندسة، طيران، طب، تدريس، تجارة، تمريض"}, {"id": "b", "text": "تمريض، طب، تدريس، هندسة، طيران، تجارة"}, {"id": "c", "text": "طب، هندسة، طيران، تمريض، تدريس، تجارة"}, {"id": "d", "text": "تجارة، تدريس، هندسة، طيران، تمريض، طب"}]'::jsonb, '{"value": "c"}'::jsonb, '["نحوّل الكسور إلى مقام 100: هندسة 21، طب 28، تمريض 18، طيران 20، تدريس 9، تجارة 4.", "الترتيب التنازلي: طب، هندسة، طيران، تمريض، تدريس، تجارة."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 8'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 3 from a, qi;
with s as (select id from skills where code = 'G8-S03'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'أي دائرة نسبة مساحة الجزء المظلل منها إلى مساحتها الكلية تساوي نسبة الجزء المظلل في الشكل العلوي إلى مساحته الكلية؟', '/booklet/g45-6.png', '[{"id": "a", "text": "الدائرة أ"}, {"id": "b", "text": "الدائرة ب"}, {"id": "c", "text": "الدائرة ج"}, {"id": "d", "text": "الدائرة د"}]'::jsonb, '{"value": "c"}'::jsonb, '["الشكل العلوي مقسم إلى 8 مثلثات متطابقة، المظلل منها 5، أي ⅝.", "الدائرة ج مظلل منها ⅝ (225°)."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 45'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 3 from a, qi;
with s as (select id from skills where code = 'G8-S04'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 3, 'mcq', 'لدى نورة 2½ لتر من العصير، استخدمت منه 0.75 لتر، ثم أضافت كمية تساوي ⅔ الكمية المتبقية، ووزعت الناتج على أكواب سعة كل منها ¼ لتر. كم كوبًا تملؤه بالكامل؟', null, '[{"id": "a", "text": "11"}, {"id": "b", "text": "12"}, {"id": "c", "text": "10"}, {"id": "d", "text": "7"}]'::jsonb, '{"value": "a"}'::jsonb, '["المتبقي: 2.5 − 0.75 = 1.75 لتر.", "المضاف: ⅔ × 1.75 ≈ 1.17 لتر، فالمجموع ≈ 2.92 لتر.", "2.92 ÷ 0.25 ≈ 11.7، فتمتلئ 11 كوبًا بالكامل."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 15'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 4 from a, qi;
with s as (select id from skills where code = 'G8-S04'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'knowing', 1, 'mcq', 'كم خُمسًا في العدد 50 ؟', null, '[{"id": "a", "text": "5"}, {"id": "b", "text": "10"}, {"id": "c", "text": "50"}, {"id": "d", "text": "250"}]'::jsonb, '{"value": "d"}'::jsonb, '["في الواحد الصحيح 5 أخماس.", "50 × 5 = 250 خُمسًا."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 17'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 4 from a, qi;
with s as (select id from skills where code = 'G8-S05'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'لكل 6 أشخاص يفضلون فاكهة البرتقال هناك 9 أشخاص لا يفضلونها. كم شخصًا لا يفضلها من بين 45 شخصًا؟', null, '[{"id": "a", "text": "27"}, {"id": "b", "text": "18"}, {"id": "c", "text": "30"}, {"id": "d", "text": "36"}]'::jsonb, '{"value": "a"}'::jsonb, '["في كل مجموعة من 15 شخصًا: 9 لا يفضلونها.", "9/15 = س/45 ⇐ س = 27."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 31'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 5 from a, qi;
with s as (select id from skills where code = 'G8-S05'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'في الخريطة، طول ضلع المربع الواحد يمثل 8.5 م. كم يبعد الملعب عن المسجد بالمتر؟', '/booklet/g48-6.png', '[{"id": "a", "text": "15"}, {"id": "b", "text": "32"}, {"id": "c", "text": "34"}, {"id": "d", "text": "60"}]'::jsonb, '{"value": "c"}'::jsonb, '["المسافة بين المسجد والملعب 4 وحدات على الشبكة.", "4 × 8.5 = 34 م."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 48'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 5 from a, qi;
with s as (select id from skills where code = 'G8-S06'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'استغرق 3 عمال 30 يومًا لحياكة سجادة يدوية. كم عاملًا يلزم لحياكة سجادة مماثلة خلال 20 يومًا إذا عمل الجميع بالمعدل نفسه؟', null, '[{"id": "a", "text": "5 عمال (لأن الحاجة 4.5 عامل، ولا يمكن أخذ نصف عامل)"}, {"id": "b", "text": "2 عاملان"}, {"id": "c", "text": "4 عمال"}, {"id": "d", "text": "6 عمال"}]'::jsonb, '{"value": "a"}'::jsonb, '["العمل الكلي 3 × 30 = 90 يوم عمل.", "90 ÷ 20 = 4.5، وعدد العمال عدد صحيح، فيلزم 5 عمال لإنهائها خلال 20 يومًا.", "العلاقة عكسية: كلما قلت الأيام زاد عدد العمال."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 34'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 6 from a, qi;
with s as (select id from skills where code = 'G8-S06'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'يجري عداء 216 م في 18 ثانية. إذا استمر بالمعدل نفسه، فكم دقيقة تقريبًا يحتاج لقطع 780 م؟', null, '[{"id": "a", "text": "دقيقة واحدة"}, {"id": "b", "text": "دقيقتان"}, {"id": "c", "text": "3 دقائق"}, {"id": "d", "text": "5 دقائق"}]'::jsonb, '{"value": "a"}'::jsonb, '["المعدل 216 ÷ 18 = 12 م/ث.", "780 ÷ 12 = 65 ثانية ≈ دقيقة واحدة."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 51'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 6 from a, qi;
with s as (select id from skills where code = 'G8-S07'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 1, 'mcq', 'إذا كان 2أ + 2ب = 36، فما قيمة أ + ب + 7 ؟', null, '[{"id": "a", "text": "11"}, {"id": "b", "text": "18"}, {"id": "c", "text": "25"}, {"id": "d", "text": "28"}]'::jsonb, '{"value": "c"}'::jsonb, '["أ + ب = 36 ÷ 2 = 18.", "18 + 7 = 25."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 33'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 7 from a, qi;
with s as (select id from skills where code = 'G8-S07'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'استخدم الصيغة ص = 100 − 100 ÷ (ع + 1) لإيجاد قيمة ص عندما ع = 9.', null, '[{"id": "a", "text": "100"}, {"id": "b", "text": "90"}, {"id": "c", "text": "80"}, {"id": "d", "text": "10"}]'::jsonb, '{"value": "b"}'::jsonb, '["ع + 1 = 10، و 100 ÷ 10 = 10.", "ص = 100 − 10 = 90."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 33'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 7 from a, qi;
with s as (select id from skills where code = 'G8-S08'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 3, 'mcq', 'يوضح الشكل حديقة مستطيلة بعداها (س + 5) م و 2س م، وفيها شريط أبيض مستطيل عرضه 2 م يمتد بطول الحديقة لدورة مياه. أي العبارات تمثل مساحة الجزء المظلل بالمتر المربع؟', '/booklet/a32-10.png', '[{"id": "a", "text": "2س² + 6س"}, {"id": "b", "text": "2س² + 10س"}, {"id": "c", "text": "2س² + 6"}, {"id": "d", "text": "2س² + 10س − 2"}]'::jsonb, '{"value": "a"}'::jsonb, '["مساحة الحديقة: 2س(س + 5) = 2س² + 10س.", "مساحة الشريط: 2 × 2س = 4س.", "المظلل: 2س² + 10س − 4س = 2س² + 6س."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 32'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 8 from a, qi;
with s as (select id from skills where code = 'G8-S08'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 1, 'mcq', 'مستطيل طوله (س + 3) وعرضه س. ما مساحته؟', null, '[{"id": "a", "text": "س² + 3س"}, {"id": "b", "text": "س² + 3"}, {"id": "c", "text": "2س + 3"}, {"id": "d", "text": "3س + 3"}]'::jsonb, '{"value": "a"}'::jsonb, '["المساحة = س(س + 3) = س² + 3س."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 34'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 8 from a, qi;
with s as (select id from skills where code = 'G8-S09'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 1, 'mcq', 'شارك في موكب م من الأولاد و ن من البنات، وكل منهم يحمل بالونين. أي العبارات تمثل العدد الإجمالي للبالونات؟', null, '[{"id": "a", "text": "2(م + ن)"}, {"id": "b", "text": "2 + (م + ن)"}, {"id": "c", "text": "2م + ن"}, {"id": "d", "text": "م + 2ن"}]'::jsonb, '{"value": "a"}'::jsonb, '["عدد المشاركين م + ن، وكل منهم يحمل 2.", "الإجمالي 2(م + ن)."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 20'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 9 from a, qi;
with s as (select id from skills where code = 'G8-S09'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 1, 'mcq', 'ميزان متزن: في إحدى كفتيه ثقل كتلته 900 غ، وفي الأخرى ثقل كتلته 400 غ وجسم كتلته س. أي المعادلات تمثل الموقف؟', null, '[{"id": "a", "text": "400 − س = 900"}, {"id": "b", "text": "400 + س = 900"}, {"id": "c", "text": "400 × س = 900"}, {"id": "d", "text": "400 ÷ س = 900"}]'::jsonb, '{"value": "b"}'::jsonb, '["الميزان متزن، فمجموع ما في الكفة الثانية يساوي ما في الأولى.", "400 + س = 900."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 30'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 9 from a, qi;
with s as (select id from skills where code = 'G8-S10'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 1, 'mcq', 'يصنع خالد إطارًا للوحة ارتفاعها يزيد على مثلي عرضها بمقدار 2 م. إذا كان ارتفاعها 4 أمتار، فما عرضها؟', null, '[{"id": "a", "text": "4 م"}, {"id": "b", "text": "3 م"}, {"id": "c", "text": "2 م"}, {"id": "d", "text": "1 م"}]'::jsonb, '{"value": "d"}'::jsonb, '["2ع + 2 = 4 ⇐ 2ع = 2 ⇐ ع = 1 م."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 33'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 10 from a, qi;
with s as (select id from skills where code = 'G8-S10'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'إذا كانت الأعداد 18، 22، 2س − 14، 30 أعدادًا زوجية مرتبة تصاعديًا بفرق ثابت، فما قيمة س؟', null, '[{"id": "a", "text": "20"}, {"id": "b", "text": "13"}, {"id": "c", "text": "26"}, {"id": "d", "text": "18"}]'::jsonb, '{"value": "a"}'::jsonb, '["الفرق الثابت 4، فالعدد الثالث 26.", "2س − 14 = 26 ⇐ 2س = 40 ⇐ س = 20."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 34'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 10 from a, qi;
with s as (select id from skills where code = 'G8-S11'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'كان مع خالد في بداية العام 420 ريالًا، ويدّخر 20 ريالًا كل أسبوع. هل يتناسب المبلغ الإجمالي مع عدد الأسابيع؟', null, '[{"id": "a", "text": "لا؛ لأن المبلغ لا يساوي صفرًا عند الأسبوع صفر، فنسبة المبلغ إلى عدد الأسابيع غير ثابتة"}, {"id": "b", "text": "نعم؛ لأن المبلغ يزيد بمقدار ثابت كل أسبوع"}, {"id": "c", "text": "نعم؛ لأن العلاقة خطية"}, {"id": "d", "text": "لا؛ لأن المبلغ يتناقص مع الزمن"}]'::jsonb, '{"value": "a"}'::jsonb, '["العلاقة: ص = 20س + 420، وهي خطية لكنها لا تمر بنقطة الأصل.", "بعد أسبوع 440 ÷ 1 = 440، وبعد أسبوعين 460 ÷ 2 = 230، فالنسبة غير ثابتة."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 31'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 11 from a, qi;
with s as (select id from skills where code = 'G8-S11'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'أي الخيارات يصف كيفية الحصول على العدد الثاني من الأول في الأزواج: (4، 6)، (6، 10)، (8، 14)؟', null, '[{"id": "a", "text": "أضف 2"}, {"id": "b", "text": "اضرب في 2"}, {"id": "c", "text": "اضرب في 2 ثم أضف 2"}, {"id": "d", "text": "اضرب في 2 ثم اطرح 2"}]'::jsonb, '{"value": "d"}'::jsonb, '["4 × 2 − 2 = 6، و 6 × 2 − 2 = 10، و 8 × 2 − 2 = 14."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 33'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 11 from a, qi;
with s as (select id from skills where code = 'G8-S12'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'ما الحد النوني في النمط: ½، ⅔، ¾، ⅘، ⅚، ... ؟', null, '[{"id": "a", "text": "ن ÷ (ن + 1)"}, {"id": "b", "text": "(ن + 1) ÷ ن"}, {"id": "c", "text": "ن ÷ (2ن)"}, {"id": "d", "text": "1 ÷ (ن + 1)"}]'::jsonb, '{"value": "a"}'::jsonb, '["الحد الأول ½: البسط 1 = ن والمقام 2 = ن + 1.", "الحد النوني ن ÷ (ن + 1)."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 31'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 12 from a, qi;
with s as (select id from skills where code = 'G8-S12'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 3, 'mcq', 'يكوّن سعد أشكالًا مربعة ن × ن: البلاط الداخلي أسود وعدده (ن − 2)²، والإطار الخارجي أحمر (الشكل 3×3 فيه 8 حمراء، و 4×4 فيه 12، و 5×5 فيه 16). ما عدد البلاط الأحمر في الشكل ن × ن؟', '/booklet/a35-10.png', '[{"id": "a", "text": "4ن − 4"}, {"id": "b", "text": "4ن"}, {"id": "c", "text": "ن² − 4"}, {"id": "d", "text": "2ن + 2"}]'::jsonb, '{"value": "a"}'::jsonb, '["عدد البلاط الكلي ن²، والأحمر = ن² − (ن − 2)².", "ن² − (ن² − 4ن + 4) = 4ن − 4. تحقق: ن = 5 ⇐ 16."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 35'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 12 from a, qi;
with s as (select id from skills where code = 'G8-S13'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'إذا كان قاطع عموديًا على أحد مستقيمين متوازيين، فهل يكون عموديًا على المستقيم الآخر؟', null, '[{"id": "a", "text": "دائمًا؛ لأن الزاويتين المتناظرتين متطابقتان، فتكون الزاوية مع الآخر 90° أيضًا"}, {"id": "b", "text": "أحيانًا؛ حسب المسافة بين المستقيمين"}, {"id": "c", "text": "لا يكون أبدًا"}, {"id": "d", "text": "أحيانًا؛ حسب طول القاطع"}]'::jsonb, '{"value": "a"}'::jsonb, '["الزوايا المتناظرة الناتجة عن قاطع لمستقيمين متوازيين متطابقة.", "الزاوية مع المستقيم الأول 90°، فتناظرها مع الثاني 90° أيضًا."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 52'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 13 from a, qi;
with s as (select id from skills where code = 'G8-S13'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 3, 'mcq', 'حسب المعطيات في الشكل (مستقيمان متوازيان، والزاوية المنعكسة عند الرأس العلوي 327°، والزاوية 71°)، أوجد قيمة س.', '/booklet/g54-6.png', '[{"id": "a", "text": "38"}, {"id": "b", "text": "71"}, {"id": "c", "text": "109"}, {"id": "d", "text": "142"}]'::jsonb, '{"value": "d"}'::jsonb, '["زاوية الرأس العلوي في المثلث 360° − 327° = 33°، وزاوية المثلث عند القاعدة اليمنى 180° − 71° = 109°.", "زاوية المثلث عند القاعدة اليسرى 180° − 33° − 109° = 38°.", "س تكمل الزاوية المناظرة لها على المستقيم العلوي: س = 180° − 38° = 142°."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 54'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 13 from a, qi;
with s as (select id from skills where code = 'G8-S14'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'ما عدد أضلاع مضلع منتظم قياس زاويته الداخلية 160°؟', null, '[{"id": "a", "text": "18"}, {"id": "b", "text": "16"}, {"id": "c", "text": "9"}, {"id": "d", "text": "20"}]'::jsonb, '{"value": "a"}'::jsonb, '["الزاوية الخارجية = 180° − 160° = 20°.", "مجموع الزوايا الخارجية 360°، فعدد الأضلاع 360 ÷ 20 = 18."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 55'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 14 from a, qi;
with s as (select id from skills where code = 'G8-S14'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 3, 'mcq', 'شبه منحرف قاعدتاه 8 سم و 4 سم وارتفاعه 6 سم، وفيه مثلث أبيض قاعدته القاعدة الصغرى ورأسه في منتصف القاعدة الكبرى. ما مساحة الجزء المظلل؟', '/booklet/g55-10.png', '[{"id": "a", "text": "24 سم²"}, {"id": "b", "text": "36 سم²"}, {"id": "c", "text": "12 سم²"}, {"id": "d", "text": "30 سم²"}]'::jsonb, '{"value": "a"}'::jsonb, '["مساحة شبه المنحرف ½ × (8 + 4) × 6 = 36 سم².", "مساحة المثلث الأبيض ½ × 4 × 6 = 12 سم².", "المظلل 36 − 12 = 24 سم²."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 55'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 14 from a, qi;
with s as (select id from skills where code = 'G8-S15'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'المثلث س ص ع (ضلعا القائمة 3 و 4) يشابه المثلث ك ل م الذي يناظر فيه الضلعَ 3 ضلعٌ طوله 9. ما محيط المثلث ك ل م؟', '/booklet/g53-1.png', '[{"id": "a", "text": "21"}, {"id": "b", "text": "24"}, {"id": "c", "text": "36"}, {"id": "d", "text": "50"}]'::jsonb, '{"value": "c"}'::jsonb, '["وتر المثلث الصغير √(3² + 4²) = 5، ومحيطه 12.", "معامل التشابه 9 ÷ 3 = 3، فمحيط ك ل م = 12 × 3 = 36."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 53'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 15 from a, qi;
with s as (select id from skills where code = 'G8-S15'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 3, 'mcq', 'المثلث أ متطابق الضلعين، رأسه (4، 9) وأحد رأسي قاعدته (1، −3). المثلث ب انعكاس للمثلث أ حول محور الصادات. ما إحداثيات النقطة جـ (رأس القاعدة الأبعد عن المحور في المثلث ب)؟', '/booklet/g53-3.png', '[{"id": "a", "text": "(−1، −3)"}, {"id": "b", "text": "(−1، 3)"}, {"id": "c", "text": "(−3، −7)"}, {"id": "d", "text": "(−7، −3)"}]'::jsonb, '{"value": "d"}'::jsonb, '["المثلث أ متماثل حول المستقيم س = 4، فرأس قاعدته الآخر (7، −3).", "الانعكاس حول محور الصادات يغير إشارة س: (7، −3) ← (−7، −3)."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 53'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 15 from a, qi;
with s as (select id from skills where code = 'G8-S16'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 1, 'mcq', 'استعمل التمثيل لتحديد نوع العلاقة بين ساعات التدريب الأسبوعية ودرجة الإتقان.', '/booklet/d61-5.png', '[{"id": "a", "text": "علاقة طردية"}, {"id": "b", "text": "علاقة عكسية"}, {"id": "c", "text": "لا توجد علاقة ظاهرة"}, {"id": "d", "text": "علاقة دائرية"}]'::jsonb, '{"value": "a"}'::jsonb, '["كلما زادت ساعات التدريب زادت درجة الإتقان.", "النقاط تتجه إلى الأعلى من اليسار إلى اليمين، فالعلاقة طردية."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 61'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 16 from a, qi;
with s as (select id from skills where code = 'G8-S16'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'يمثل الرسم إنجاز ثلاثة فصول (أ، ب، جـ) في ثلاثة مجالات: القراءة والعلوم والتقنية. أي العبارات صحيحة؟ (1) المجموع الكلي للفصل ب يساوي 25. (2) جزء العلوم في الفصل جـ يساوي 11. (3) مجموع الفصل أ يساوي 22. (4) المجموع الكلي للفصل جـ يساوي 20.', '/booklet/d61-6.png', '[{"id": "a", "text": "(1) و (2) فقط"}, {"id": "b", "text": "(1) و (3) فقط"}, {"id": "c", "text": "(2) و (4) فقط"}, {"id": "d", "text": "(3) و (4) فقط"}]'::jsonb, '{"value": "a"}'::jsonb, '["الفصل ب: 12 + 8 + 5 = 25، والفصل جـ: 9 + 11 + 4 = 24.", "الفصل أ: 10 + 7 + 3 = 20."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 61'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 16 from a, qi;
with s as (select id from skills where code = 'G8-S17'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'أجرت جماعة الصحة استبانة عن رضا الطلاب عن المقصف، وجمعت الإجابات من الواقفين عند باب المقصف فقط. قال أحد الطلاب: «تمثل النتائج جميع طلاب المدرسة». ما التقويم الأدق؟', null, '[{"id": "a", "text": "صحيح؛ لأن المشاركين يعرفون المقصف"}, {"id": "b", "text": "خطأ؛ مكان الاختيار قد يسبب تحيزًا"}, {"id": "c", "text": "صحيح؛ لأن الاستبانة قصيرة"}, {"id": "d", "text": "لا يؤثر أسلوب اختيار العينة في النتائج"}]'::jsonb, '{"value": "b"}'::jsonb, '["الواقفون عند المقصف هم غالبًا من يستخدمونه، فلا يمثلون جميع الطلاب.", "العينة متحيزة بسبب مكان الاختيار."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 65'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 17 from a, qi;
with s as (select id from skills where code = 'G8-S17'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'سُئل 480 طالبًا عن رياضاتهم المفضلة: الهوكي 60، كرة القدم 180، التنس 120، كرة السلة 120. عند تمثيل البيانات بالقطاعات الدائرية، ما قياس زاوية قطاع كرة القدم؟', null, '[{"id": "a", "text": "135°"}, {"id": "b", "text": "180°"}, {"id": "c", "text": "90°"}, {"id": "d", "text": "45°"}]'::jsonb, '{"value": "a"}'::jsonb, '["نسبة كرة القدم 180 ÷ 480 = ⅜.", "زاوية القطاع ⅜ × 360° = 135°."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 66'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 17 from a, qi;
with s as (select id from skills where code = 'G8-S18'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 3, 'mcq', 'يعرض التمثيل بالصندوق وطرفيه نتائج فصلين في اختبار مهاري. أي الفصلين أكثر اتساقًا في النتائج؟', '/booklet/d66-8.png', '[{"id": "a", "text": "الفصل أ؛ لأن الوسيط متساوٍ تقريبًا في الفصلين، لكن مدى الفصل أ ومداه الربيعي أصغر"}, {"id": "b", "text": "الفصل ب؛ لأن مداه أكبر"}, {"id": "c", "text": "الفصل ب؛ لأن وسيطه أعلى بكثير"}, {"id": "d", "text": "الفصلان متساويان في الاتساق لتساوي الوسيط"}]'::jsonb, '{"value": "a"}'::jsonb, '["الوسيط في الفصلين قريب من 50.", "بيانات الفصل أ أقل انتشارًا (صندوق أقصر وطرفان أقصر)، فهو أكثر اتساقًا."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 66'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 18 from a, qi;
with s as (select id from skills where code = 'G8-S18'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 3, 'mcq', 'درجات سبعة طلاب في مهمة: 12، 13، 14، 14، 15، 16، 40. ماذا يحدث للمتوسط والمدى إذا حُذفت الدرجة 40؟', null, '[{"id": "a", "text": "ينخفض المتوسط من 17.7 تقريبًا إلى 14، وينخفض المدى من 28 إلى 4"}, {"id": "b", "text": "يبقى المتوسط 14 وينخفض المدى إلى 4"}, {"id": "c", "text": "ينخفض المتوسط إلى 14 ويبقى المدى 28"}, {"id": "d", "text": "لا يتغير أي منهما"}]'::jsonb, '{"value": "a"}'::jsonb, '["قبل الحذف: المتوسط 124 ÷ 7 ≈ 17.7، والمدى 40 − 12 = 28.", "بعد الحذف: المتوسط 84 ÷ 6 = 14، والمدى 16 − 12 = 4. والوسيط (14) هو الأنسب لوصف الأداء المعتاد."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 66'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 18 from a, qi;
with s as (select id from skills where code = 'G8-S19'), a as (select id from assessments where kind = 'post' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'عشر بطاقات متساوية مرقمة من 1 إلى 10. ما احتمال سحب بطاقة تحمل عددًا زوجيًا أو من مضاعفات 3؟', null, '[{"id": "a", "text": "7/10"}, {"id": "b", "text": "8/10"}, {"id": "c", "text": "½"}, {"id": "d", "text": "3/10"}]'::jsonb, '{"value": "a"}'::jsonb, '["الزوجية: 2، 4، 6، 8، 10، ومضاعفات 3: 3، 6، 9.", "الاتحاد دون تكرار العدد 6: {2، 3، 4، 6، 8، 9، 10}، أي 7 من 10."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 70'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 19 from a, qi;
with s as (select id from skills where code = 'G8-S19'), a as (select id from assessments where kind = 'pre' order by created_at limit 1),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, media_url, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'يختار الطالب في المقصف وجبة واحدة من 3 ومشروبًا واحدًا من 2 وحلوى واحدة من 2. كم طلبًا مختلفًا يمكن تكوينه، وما احتمال اختيار طلب مفضل واحد بالصدفة؟', null, '[{"id": "a", "text": "12 طلبًا، والاحتمال 1/12"}, {"id": "b", "text": "7 طلبات، والاحتمال 1/7"}, {"id": "c", "text": "12 طلبًا، والاحتمال 1/7"}, {"id": "d", "text": "18 طلبًا، والاحتمال 1/18"}]'::jsonb, '{"value": "a"}'::jsonb, '["بمبدأ العد الأساسي: 3 × 2 × 2 = 12.", "الاحتمال 1/12، وإذا أُضيف مشروب ثالث يصبح العدد 18 والاحتمال 1/18."]'::jsonb, 'published', 'measure', 'كراسة تدريبات الصف الثاني متوسط (إعداد معلمات الرياضيات)، ص 70'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 19 from a, qi;
