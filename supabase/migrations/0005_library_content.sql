-- =====================================================================
-- محتوى مكتبة النماذج: 4 نماذج × 6 أسئلة + نموذج شامل يختار 8 أسئلة عشوائيًا
-- الأسئلة من إعداد المنصة على نمط TIMSS للصف الثامن، وليست أسئلة TIMSS رسمية.
-- (مولَّد بالأمر: python3 scripts/gen-library-sql.py)
-- =====================================================================
insert into skills (domain_id, topic_id, code, name_ar, sort_order)
select t.domain_id, t.id, x.code, x.name_ar, 100
from (values
  ('integers', 'LIB-NUM', 'نماذج الأعداد'),
  ('expressions_equations', 'LIB-ALG', 'نماذج الجبر'),
  ('geometry_measurement', 'LIB-GEO', 'نماذج الهندسة والقياس'),
  ('data', 'LIB-DATA', 'نماذج البيانات والاحتمالات')
) as x(topic, code, name_ar)
join topic_areas t on t.code = x.topic
on conflict (code) do nothing;

insert into assessments (kind, form_label, title, domain_code, is_open, sort_order) values ('model', 'num', 'نموذج الأعداد', 'number', true, 1);
with s as (select id from skills where code = 'LIB-NUM'), a as (select id from assessments where kind = 'model' and form_label = 'num'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'knowing', 2, 'mcq', 'أيّ الأعداد الآتية هو الأكبر؟', '[{"id": "a", "text": "−0.5"}, {"id": "b", "text": "−¼"}, {"id": "c", "text": "−0.3"}, {"id": "d", "text": "−⅖"}]'::jsonb, '{"value": "b"}'::jsonb, '["نكتب الأعداد عشرية: −0.5، −0.25، −0.3، −0.4", "العدد السالب الأقرب إلى الصفر هو الأكبر", "إذن الأكبر −¼"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 1 from a, qi;
with s as (select id from skills where code = 'LIB-NUM'), a as (select id from assessments where kind = 'model' and form_label = 'num'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'اشترت ريم 3 دفاتر، سعر الدفتر الواحد 4.75 ريالات، ودفعت 20 ريالًا. كم ريالًا يتبقى لها؟', '[{"id": "a", "text": "4.25"}, {"id": "b", "text": "5.75"}, {"id": "c", "text": "6.25"}, {"id": "d", "text": "14.25"}]'::jsonb, '{"value": "b"}'::jsonb, '["ثمن الدفاتر: 3 × 4.75 = 14.25", "الباقي: 20 − 14.25 = 5.75 ريالات"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 2 from a, qi;
with s as (select id from skills where code = 'LIB-NUM'), a as (select id from assessments where kind = 'model' and form_label = 'num'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'تحتاج وصفة إلى 3 أكواب دقيق لكل 4 أكواب حليب. كم كوب دقيق يلزم لـ 10 أكواب حليب؟', '[{"id": "a", "text": "6"}, {"id": "b", "text": "7.5"}, {"id": "c", "text": "9"}, {"id": "d", "text": "13"}]'::jsonb, '{"value": "b"}'::jsonb, '["النسبة: 3 ÷ 4 = 0.75 كوب دقيق لكل كوب حليب", "0.75 × 10 = 7.5 أكواب"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 3 from a, qi;
with s as (select id from skills where code = 'LIB-NUM'), a as (select id from assessments where kind = 'model' and form_label = 'num'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'knowing', 2, 'mcq', 'ما 15% من 80 ؟', '[{"id": "a", "text": "8"}, {"id": "b", "text": "1.2"}, {"id": "c", "text": "12"}, {"id": "d", "text": "15"}]'::jsonb, '{"value": "c"}'::jsonb, '["15% = 0.15", "0.15 × 80 = 12"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 4 from a, qi;
with s as (select id from skills where code = 'LIB-NUM'), a as (select id from assessments where kind = 'model' and form_label = 'num'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'ارتفع سعر سلعة بنسبة 10%، ثم انخفض السعر الجديد بنسبة 10%. أيّ العبارات الآتية صحيحة؟', '[{"id": "a", "text": "السعر النهائي يساوي السعر الأصلي"}, {"id": "b", "text": "السعر النهائي أقل من الأصلي بنسبة 1%"}, {"id": "c", "text": "السعر النهائي أكبر من الأصلي بنسبة 1%"}, {"id": "d", "text": "السعر النهائي أقل من الأصلي بنسبة 10%"}]'::jsonb, '{"value": "b"}'::jsonb, '["نفرض السعر الأصلي 100", "بعد الارتفاع: 110", "بعد الانخفاض: 110 − 11 = 99", "99 أقل من 100 بنسبة 1%"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 5 from a, qi;
with s as (select id from skills where code = 'LIB-NUM'), a as (select id from assessments where kind = 'model' and form_label = 'num'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'كانت درجة الحرارة في مدينة −4° صباحًا، وصارت 9° ظهرًا. كم درجة ارتفعت الحرارة؟', '[{"id": "a", "text": "5"}, {"id": "b", "text": "13"}, {"id": "c", "text": "−13"}, {"id": "d", "text": "36"}]'::jsonb, '{"value": "b"}'::jsonb, '["مقدار الارتفاع = 9 − (−4)", "= 9 + 4 = 13 درجة"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 6 from a, qi;
with s as (select id from skills where code = 'LIB-NUM'), a as (select id from assessments where kind = 'model' and form_label = 'num'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'knowing', 2, 'mcq', 'أيّ الأعداد الآتية عدد أولي؟', '[{"id": "a", "text": "21"}, {"id": "b", "text": "27"}, {"id": "c", "text": "29"}, {"id": "d", "text": "33"}]'::jsonb, '{"value": "c"}'::jsonb, '["21 = 3 × 7 ، 27 = 3 × 9 ، 33 = 3 × 11", "العدد 29 لا يقبل القسمة إلا على 1 وعلى نفسه", "إذن 29 عدد أولي"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 7 from a, qi;
insert into assessments (kind, form_label, title, domain_code, is_open, sort_order) values ('model', 'alg', 'نموذج الجبر', 'algebra', true, 2);
with s as (select id from skills where code = 'LIB-ALG'), a as (select id from assessments where kind = 'model' and form_label = 'alg'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'knowing', 2, 'mcq', 'أيّ العبارات الآتية تساوي 3(س + 4)؟', '[{"id": "a", "text": "3س + 4"}, {"id": "b", "text": "3س + 12"}, {"id": "c", "text": "س + 12"}, {"id": "d", "text": "7س"}]'::jsonb, '{"value": "b"}'::jsonb, '["نوزع الضرب: 3 × س + 3 × 4", "= 3س + 12"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 1 from a, qi;
with s as (select id from skills where code = 'LIB-ALG'), a as (select id from assessments where kind = 'model' and form_label = 'alg'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'إذا كان 2س − 5 = 11، فما قيمة س؟', '[{"id": "a", "text": "3"}, {"id": "b", "text": "6"}, {"id": "c", "text": "8"}, {"id": "d", "text": "16"}]'::jsonb, '{"value": "c"}'::jsonb, '["نضيف 5 إلى الطرفين: 2س = 16", "نقسم على 2: س = 8"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 2 from a, qi;
with s as (select id from skills where code = 'LIB-ALG'), a as (select id from assessments where kind = 'model' and form_label = 'alg'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'سعر تذكرة دخول متحف 15 ريالًا للشخص، إضافة إلى رسوم ثابتة قدرها 10 ريالات للمجموعة. أيّ عبارة تمثل التكلفة الكلية لمجموعة عدد أفرادها ن؟', '[{"id": "a", "text": "15ن + 10"}, {"id": "b", "text": "10ن + 15"}, {"id": "c", "text": "25ن"}, {"id": "d", "text": "ن + 25"}]'::jsonb, '{"value": "a"}'::jsonb, '["تكلفة التذاكر: 15 × ن", "نضيف الرسوم الثابتة: 15ن + 10"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 3 from a, qi;
with s as (select id from skills where code = 'LIB-ALG'), a as (select id from assessments where kind = 'model' and form_label = 'alg'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'في النمط: 4، 7، 10، 13، ... ما الحد العشرون؟', '[{"id": "a", "text": "58"}, {"id": "b", "text": "61"}, {"id": "c", "text": "63"}, {"id": "d", "text": "64"}]'::jsonb, '{"value": "b"}'::jsonb, '["الفرق الثابت 3، والحد الأول 4", "الحد النوني = 3ن + 1", "الحد العشرون = 3 × 20 + 1 = 61"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 4 from a, qi;
with s as (select id from skills where code = 'LIB-ALG'), a as (select id from assessments where kind = 'model' and form_label = 'alg'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'knowing', 2, 'mcq', 'ما قيمة 2أ² − ب عندما أ = 3 و ب = 4 ؟', '[{"id": "a", "text": "8"}, {"id": "b", "text": "14"}, {"id": "c", "text": "20"}, {"id": "d", "text": "32"}]'::jsonb, '{"value": "b"}'::jsonb, '["أ² = 9", "2 × 9 = 18", "18 − 4 = 14"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 5 from a, qi;
with s as (select id from skills where code = 'LIB-ALG'), a as (select id from assessments where kind = 'model' and form_label = 'alg'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'القيم في الجدول: عندما س = 1 فإن ص = 5، وعندما س = 2 فإن ص = 8، وعندما س = 3 فإن ص = 11. أيّ المعادلات تمثل العلاقة؟', '[{"id": "a", "text": "ص = س + 4"}, {"id": "b", "text": "ص = 3س + 2"}, {"id": "c", "text": "ص = 2س + 3"}, {"id": "d", "text": "ص = 5س"}]'::jsonb, '{"value": "b"}'::jsonb, '["كلما زادت س بمقدار 1 زادت ص بمقدار 3", "نجرب ص = 3س + 2: 3(1) + 2 = 5 ✓ ، 3(2) + 2 = 8 ✓ ، 3(3) + 2 = 11 ✓"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 6 from a, qi;
insert into assessments (kind, form_label, title, domain_code, is_open, sort_order) values ('model', 'geo', 'نموذج الهندسة والقياس', 'geometry_measurement', true, 3);
with s as (select id from skills where code = 'LIB-GEO'), a as (select id from assessments where kind = 'model' and form_label = 'geo'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'knowing', 2, 'mcq', 'في مثلث، قياس زاويتين منه 50° و 65°. ما قياس الزاوية الثالثة؟', '[{"id": "a", "text": "55°"}, {"id": "b", "text": "65°"}, {"id": "c", "text": "75°"}, {"id": "d", "text": "115°"}]'::jsonb, '{"value": "b"}'::jsonb, '["مجموع زوايا المثلث 180°", "180 − (50 + 65) = 65°"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 1 from a, qi;
with s as (select id from skills where code = 'LIB-GEO'), a as (select id from assessments where kind = 'model' and form_label = 'geo'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'مستطيل طوله 12 سم وعرضه 5 سم. ما طول قطره بالسنتيمترات؟', '[{"id": "a", "text": "7"}, {"id": "b", "text": "13"}, {"id": "c", "text": "17"}, {"id": "d", "text": "60"}]'::jsonb, '{"value": "b"}'::jsonb, '["القطر وتر في مثلث قائم ضلعاه 12 و 5", "القطر² = 12² + 5² = 144 + 25 = 169", "القطر = 13 سم"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 2 from a, qi;
with s as (select id from skills where code = 'LIB-GEO'), a as (select id from assessments where kind = 'model' and form_label = 'geo'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'حديقة دائرية نصف قطرها 7 م. ما مساحتها تقريبًا؟ (π ≈ 22/7)', '[{"id": "a", "text": "44 م²"}, {"id": "b", "text": "49 م²"}, {"id": "c", "text": "154 م²"}, {"id": "d", "text": "308 م²"}]'::jsonb, '{"value": "c"}'::jsonb, '["المساحة = π نق²", "= 22/7 × 7 × 7", "= 154 م²"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 3 from a, qi;
with s as (select id from skills where code = 'LIB-GEO'), a as (select id from assessments where kind = 'model' and form_label = 'geo'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'knowing', 2, 'mcq', 'صندوق على شكل متوازي مستطيلات أبعاده 2 م و 3 م و 4 م. ما حجمه؟', '[{"id": "a", "text": "9 م³"}, {"id": "b", "text": "24 م³"}, {"id": "c", "text": "26 م³"}, {"id": "d", "text": "52 م³"}]'::jsonb, '{"value": "b"}'::jsonb, '["الحجم = الطول × العرض × الارتفاع", "= 2 × 3 × 4 = 24 م³"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 4 from a, qi;
with s as (select id from skills where code = 'LIB-GEO'), a as (select id from assessments where kind = 'model' and form_label = 'geo'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'true_false', 'كل مربع هو مستطيل.', '[]'::jsonb, '{"value": true}'::jsonb, '["المستطيل: شكل رباعي زواياه الأربع قوائم", "المربع زواياه الأربع قوائم أيضًا، وأضلاعه متساوية", "إذن كل مربع مستطيل، والعكس غير صحيح دائمًا"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 5 from a, qi;
with s as (select id from skills where code = 'LIB-GEO'), a as (select id from assessments where kind = 'model' and form_label = 'geo'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'زاويتان متكاملتان، قياس إحداهما ثلاثة أمثال قياس الأخرى. ما قياس الزاوية الصغرى؟', '[{"id": "a", "text": "30°"}, {"id": "b", "text": "45°"}, {"id": "c", "text": "60°"}, {"id": "d", "text": "135°"}]'::jsonb, '{"value": "b"}'::jsonb, '["الزاويتان المتكاملتان مجموعهما 180°", "س + 3س = 180", "4س = 180، إذن س = 45°"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 6 from a, qi;
with s as (select id from skills where code = 'LIB-GEO'), a as (select id from assessments where kind = 'model' and form_label = 'geo'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'مثلثان متشابهان، أطوال أضلاع الأول 3 سم و 4 سم و 5 سم، وطول أقصر ضلع في الثاني 6 سم. ما طول أطول ضلع في المثلث الثاني؟', '[{"id": "a", "text": "8 سم"}, {"id": "b", "text": "10 سم"}, {"id": "c", "text": "12 سم"}, {"id": "d", "text": "15 سم"}]'::jsonb, '{"value": "b"}'::jsonb, '["معامل التشابه = 6 ÷ 3 = 2", "أطول ضلع = 5 × 2 = 10 سم"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 7 from a, qi;
insert into assessments (kind, form_label, title, domain_code, is_open, sort_order) values ('model', 'data', 'نموذج البيانات والاحتمالات', 'data_probability', true, 4);
with s as (select id from skills where code = 'LIB-DATA'), a as (select id from assessments where kind = 'model' and form_label = 'data'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'knowing', 2, 'mcq', 'ما الوسيط للبيانات: 7، 3، 9، 4، 6 ؟', '[{"id": "a", "text": "9"}, {"id": "b", "text": "5.8"}, {"id": "c", "text": "4"}, {"id": "d", "text": "6"}]'::jsonb, '{"value": "d"}'::jsonb, '["نرتب البيانات: 3، 4، 6، 7، 9", "القيمة الوسطى هي 6"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 1 from a, qi;
with s as (select id from skills where code = 'LIB-DATA'), a as (select id from assessments where kind = 'model' and form_label = 'data'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'درجات خمس طالبات في اختبار: 80، 90، 70، 85، 75. ما المتوسط الحسابي للدرجات؟', '[{"id": "a", "text": "75"}, {"id": "b", "text": "80"}, {"id": "c", "text": "85"}, {"id": "d", "text": "400"}]'::jsonb, '{"value": "b"}'::jsonb, '["المجموع = 80 + 90 + 70 + 85 + 75 = 400", "المتوسط = 400 ÷ 5 = 80"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 2 from a, qi;
with s as (select id from skills where code = 'LIB-DATA'), a as (select id from assessments where kind = 'model' and form_label = 'data'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'knowing', 2, 'mcq', 'كيس فيه 3 كرات حمراء و 5 كرات زرقاء و 2 كرتان خضراوان. سُحبت كرة عشوائيًا. ما احتمال أن تكون زرقاء؟', '[{"id": "a", "text": "⅕"}, {"id": "b", "text": "½"}, {"id": "c", "text": "⅓"}, {"id": "d", "text": "⅝"}]'::jsonb, '{"value": "b"}'::jsonb, '["عدد الكرات الكلي = 3 + 5 + 2 = 10", "الاحتمال = 5 ÷ 10 = ½"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 3 from a, qi;
with s as (select id from skills where code = 'LIB-DATA'), a as (select id from assessments where kind = 'model' and form_label = 'data'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'أُلقي حجر نرد منتظم 5 مرات، فظهر العدد 6 في كل مرة. ما احتمال ظهور العدد 6 في الرمية السادسة؟', '[{"id": "a", "text": "أقل من ⅙"}, {"id": "b", "text": "⅙"}, {"id": "c", "text": "أكبر من ⅙"}, {"id": "d", "text": "1"}]'::jsonb, '{"value": "b"}'::jsonb, '["الرميات مستقلة، ولا تتأثر بما قبلها", "احتمال ظهور 6 في أي رمية = ⅙"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 4 from a, qi;
with s as (select id from skills where code = 'LIB-DATA'), a as (select id from assessments where kind = 'model' and form_label = 'data'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'في استطلاع شمل 200 طالبة، اختارت 35% منهن الرياضيات مادةً مفضلة. كم طالبة اختارت الرياضيات؟', '[{"id": "a", "text": "35"}, {"id": "b", "text": "65"}, {"id": "c", "text": "70"}, {"id": "d", "text": "165"}]'::jsonb, '{"value": "c"}'::jsonb, '["35% من 200 = 0.35 × 200", "= 70 طالبة"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 5 from a, qi;
with s as (select id from skills where code = 'LIB-DATA'), a as (select id from assessments where kind = 'model' and form_label = 'data'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'reasoning', 2, 'mcq', 'أُضيف العدد 30 إلى البيانات: 10، 12، 14، 16. أيّ المقاييس الآتية يتغير بالمقدار الأكبر؟', '[{"id": "a", "text": "الوسيط"}, {"id": "b", "text": "المتوسط الحسابي"}, {"id": "c", "text": "المنوال"}, {"id": "d", "text": "لا يتغير أيٌّ منها"}]'::jsonb, '{"value": "b"}'::jsonb, '["قبل الإضافة: المتوسط 13 والوسيط 13", "بعد الإضافة: المتوسط = 82 ÷ 5 = 16.4، والوسيط = 14", "المتوسط تغير 3.4 والوسيط تغير 1، فالمتوسط يتأثر أكثر بالقيمة المتطرفة"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 6 from a, qi;
with s as (select id from skills where code = 'LIB-DATA'), a as (select id from assessments where kind = 'model' and form_label = 'data'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
  select s.id, 'applying', 2, 'mcq', 'تريد مدرسة عرض نسبة الطلاب المشاركين في كل نشاط من أنشطتها الخمسة إلى مجموع الطلاب. ما التمثيل البياني الأنسب لذلك؟', '[{"id": "a", "text": "القطاعات الدائرية"}, {"id": "b", "text": "الخط البياني"}, {"id": "c", "text": "المدرج التكراري"}, {"id": "d", "text": "شكل الانتشار"}]'::jsonb, '{"value": "a"}'::jsonb, '["المطلوب مقارنة أجزاء بالكل", "القطاعات الدائرية تعرض نسبة كل جزء من الكل"]'::jsonb, 'published', 'library', 'إعداد المنصة (على نمط TIMSS)'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 7 from a, qi;
insert into assessments (kind, form_label, title, is_open, sort_order, description) values ('model', 'mix', 'نموذج شامل', true, 5, 'ثمانية أسئلة عشوائية من جميع النماذج في كل محاولة');
