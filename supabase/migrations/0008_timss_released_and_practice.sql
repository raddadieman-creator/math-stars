-- =====================================================================
-- (1) خمسة نماذج من أسئلة TIMSS 1999 و2003 المنشورة للصف الثامن، مترجمة ومقتبسة بتصرف،
--     مع رقم السؤال الأصلي في حقل المصدر. الاستخدام: تعليمي غير تجاري مع ذكر المصدر (IEA).
-- (2) أسئلة تدريب أصيلة من إعداد المنصة لاستكمال تغطية المعايير الفرعية الـ19.
-- (مولَّد بالأمر: python3 scripts/gen-library-sql.py)
-- =====================================================================
insert into assessments (kind, form_label, title, is_open, sort_order, source_label, source_url) values ('model', 't03a', 'TIMSS 2003 — الجبر', true, 11, 'مقتبس ومترجم بتصرف من أسئلة TIMSS 2003 المنشورة للصف الثامن. TIMSS 2003 Assessment © IEA، للاستخدام التعليمي غير التجاري', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf');
with s as (select id from skills where code = 'G8-S07'), a as (select id from assessments where kind = 'model' and form_label = 't03a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'إذا كانت س = −3، فما قيمة −3س؟', '[{"id": "a", "text": "−9"}, {"id": "b", "text": "−6"}, {"id": "c", "text": "−1"}, {"id": "d", "text": "1"}, {"id": "e", "text": "9"}]'::jsonb, '{"value": "e"}'::jsonb, '["−3 × (−3)", "ناتج ضرب عددين سالبين موجب = 9"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M012042', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 1 from a, qi;
with s as (select id from skills where code = 'G8-S08'), a as (select id from assessments where kind = 'model' and form_label = 't03a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'أيّ العبارات الآتية تساوي 2س − 3ص + 7س + 5ص؟', '[{"id": "a", "text": "5س + 2ص"}, {"id": "b", "text": "5س + 8ص"}, {"id": "c", "text": "9س + 2ص"}, {"id": "d", "text": "9س + 8ص"}]'::jsonb, '{"value": "c"}'::jsonb, '["نجمع الحدود المتشابهة: 2س + 7س = 9س", "−3ص + 5ص = 2ص", "الناتج 9س + 2ص"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M032036', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 2 from a, qi;
with s as (select id from skills where code = 'G8-S09'), a as (select id from assessments where kind = 'model' and form_label = 't03a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'كتب سامي المعادلة ك + (ك + 2) + (ك + 4) = 84 لإيجاد ثلاثة أعداد زوجية متتالية مجموعها 84. ماذا يمثل ك؟', '[{"id": "a", "text": "أصغر الأعداد الزوجية الثلاثة"}, {"id": "b", "text": "العدد الزوجي الأوسط"}, {"id": "c", "text": "أكبر الأعداد الزوجية الثلاثة"}, {"id": "d", "text": "متوسط الأعداد الزوجية الثلاثة"}]'::jsonb, '{"value": "a"}'::jsonb, '["الأعداد هي ك، ك + 2، ك + 4", "أصغرها ك"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M022002', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 3 from a, qi;
with s as (select id from skills where code = 'G8-S09'), a as (select id from assessments where kind = 'model' and form_label = 't03a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'عند غانم ضعف عدد الكتب التي عند بدر، وعند جابر ستة كتب أكثر مما عند بدر. إذا كان عند بدر س كتابًا، فأيّ العبارات تمثل مجموع كتب الثلاثة؟', '[{"id": "a", "text": "3س + 6"}, {"id": "b", "text": "3س + 8"}, {"id": "c", "text": "4س + 6"}, {"id": "d", "text": "5س + 6"}, {"id": "e", "text": "8س + 2"}]'::jsonb, '{"value": "c"}'::jsonb, '["غانم 2س، بدر س، جابر س + 6", "المجموع = 2س + س + س + 6 = 4س + 6"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M022251', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 4 from a, qi;
with s as (select id from skills where code = 'G8-S09'), a as (select id from assessments where kind = 'model' and form_label = 't03a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'دفعت كريمة س ريالًا ثمنًا لثلاث علب عصير. ما ثمن العلبة الواحدة؟', '[{"id": "a", "text": "3 ÷ س"}, {"id": "b", "text": "س ÷ 3"}, {"id": "c", "text": "3 + س"}, {"id": "d", "text": "3س"}]'::jsonb, '{"value": "b"}'::jsonb, '["ثمن العلبة = الثمن الكلي ÷ عدد العلب", "= س ÷ 3"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M032044', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 5 from a, qi;
with s as (select id from skills where code = 'G8-S07'), a as (select id from assessments where kind = 'model' and form_label = 't03a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'إذا كانت ل = 4 عندما ك = 6 و م = 24، فأيّ العلاقات الآتية صحيحة؟', '[{"id": "a", "text": "ل = م ÷ ك"}, {"id": "b", "text": "ل = ك ÷ م"}, {"id": "c", "text": "ل = ك × م"}, {"id": "d", "text": "ل = ك + م"}, {"id": "e", "text": "ل = م − ك"}]'::jsonb, '{"value": "a"}'::jsonb, '["نعوض: 24 ÷ 6 = 4 ✓", "بقية العلاقات لا تعطي 4"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M022196', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 6 from a, qi;
with s as (select id from skills where code = 'G8-S10'), a as (select id from assessments where kind = 'model' and form_label = 't03a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'إذا كان س + 3ص = 11 و 2س + 3ص = 13، فما قيمة ص؟', '[{"id": "a", "text": "3"}, {"id": "b", "text": "2"}, {"id": "c", "text": "−2"}, {"id": "d", "text": "−3"}]'::jsonb, '{"value": "a"}'::jsonb, '["بطرح المعادلة الأولى من الثانية: س = 2", "2 + 3ص = 11، إذن 3ص = 9", "ص = 3"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M032728', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 7 from a, qi;
with s as (select id from skills where code = 'G8-S10'), a as (select id from assessments where kind = 'model' and form_label = 't03a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'إذا كان س − ص = 5 و س ÷ 2 = 3، فما قيمة ص؟', '[{"id": "a", "text": "6"}, {"id": "b", "text": "1"}, {"id": "c", "text": "−1"}, {"id": "d", "text": "−7"}]'::jsonb, '{"value": "b"}'::jsonb, '["من المعادلة الثانية: س = 6", "6 − ص = 5، إذن ص = 1"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M032208', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 8 from a, qi;
with s as (select id from skills where code = 'G8-S08'), a as (select id from assessments where kind = 'model' and form_label = 't03a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'إذا كان أ ÷ ب = 70، فما قيمة أ ÷ (2ب)؟', '[{"id": "a", "text": "35"}, {"id": "b", "text": "68"}, {"id": "c", "text": "72"}, {"id": "d", "text": "140"}]'::jsonb, '{"value": "a"}'::jsonb, '["مضاعفة المقام تنصف قيمة الكسر", "70 ÷ 2 = 35"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M032210', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 9 from a, qi;
with s as (select id from skills where code = 'G8-S11'), a as (select id from assessments where kind = 'model' and form_label = 't03a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'reasoning', 2, 'mcq', 'في الأزواج المرتبة (3، 6)، (6، 15)، (8، 21)، أيّ القواعد الآتية تعطي العدد الثاني من العدد الأول؟', '[{"id": "a", "text": "أضف 3"}, {"id": "b", "text": "اطرح 3"}, {"id": "c", "text": "اضرب في 2"}, {"id": "d", "text": "اضرب في 2 ثم أضف 3"}, {"id": "e", "text": "اضرب في 3 ثم اطرح 3"}]'::jsonb, '{"value": "e"}'::jsonb, '["نجرب: 3 × 3 − 3 = 6 ✓", "6 × 3 − 3 = 15 ✓", "8 × 3 − 3 = 21 ✓"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M012029', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 10 from a, qi;
insert into assessments (kind, form_label, title, is_open, sort_order, source_label, source_url) values ('model', 't03b', 'TIMSS 2003 — الأعداد والقياس والبيانات', true, 12, 'مقتبس ومترجم بتصرف من أسئلة TIMSS 2003 المنشورة للصف الثامن. TIMSS 2003 Assessment © IEA، للاستخدام التعليمي غير التجاري', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf');
with s as (select id from skills where code = 'G8-S05'), a as (select id from assessments where kind = 'model' and form_label = 't03b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'إذا كان 12 ÷ ن = 36 ÷ 21، فما قيمة ن؟', '[{"id": "a", "text": "3"}, {"id": "b", "text": "7"}, {"id": "c", "text": "36"}, {"id": "d", "text": "63"}]'::jsonb, '{"value": "b"}'::jsonb, '["12 × 21 = 36 × ن", "252 = 36ن", "ن = 7"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M012040', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 1 from a, qi;
with s as (select id from skills where code = 'G8-S18'), a as (select id from assessments where kind = 'model' and form_label = 't03b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'درجات خالد في ثلاثة اختبارات: 78، 76، 74، ودرجات سلمى: 72، 82، 74. كيف يقارن متوسط درجات خالد بمتوسط درجات سلمى؟', '[{"id": "a", "text": "متوسط خالد أعلى بدرجة واحدة"}, {"id": "b", "text": "متوسط خالد أقل بدرجة واحدة"}, {"id": "c", "text": "المتوسطان متساويان"}, {"id": "d", "text": "متوسط خالد أعلى بدرجتين"}, {"id": "e", "text": "متوسط خالد أقل بدرجتين"}]'::jsonb, '{"value": "c"}'::jsonb, '["متوسط خالد = 228 ÷ 3 = 76", "متوسط سلمى = 228 ÷ 3 = 76", "المتوسطان متساويان"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M012006', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 2 from a, qi;
with s as (select id from skills where code = 'G8-S19'), a as (select id from assessments where kind = 'model' and form_label = 't03b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'reasoning', 2, 'mcq', 'قرص دوّار مقسم إلى 24 قطاعًا متساويًا: ⅛ منه أزرق، و 1/24 بنفسجي، و ½ برتقالي، و ⅓ أحمر. على أيّ لون يكون توقف المؤشر أقل احتمالًا؟', '[{"id": "a", "text": "الأزرق"}, {"id": "b", "text": "البنفسجي"}, {"id": "c", "text": "البرتقالي"}, {"id": "d", "text": "الأحمر"}]'::jsonb, '{"value": "b"}'::jsonb, '["نحوّل إلى أجزاء من 24: الأزرق 3، البنفسجي 1، البرتقالي 12، الأحمر 8", "أقل عدد قطاعات للبنفسجي"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M022252', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 3 from a, qi;
with s as (select id from skills where code = 'G8-S16'), a as (select id from assessments where kind = 'model' and form_label = 't03b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'reasoning', 2, 'mcq', 'في مدرسة 1200 طالب. اختيرت عينة عشوائية من 100 طالب فيها 45 من البنين. ما العدد الأكثر احتمالًا للبنين في المدرسة؟', '[{"id": "a", "text": "450"}, {"id": "b", "text": "500"}, {"id": "c", "text": "540"}, {"id": "d", "text": "600"}]'::jsonb, '{"value": "c"}'::jsonb, '["نسبة البنين في العينة 45%", "45% من 1200 = 540"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M032271', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 4 from a, qi;
with s as (select id from skills where code = 'G8-S19'), a as (select id from assessments where kind = 'model' and form_label = 't03b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'في فصل 30 طالبًا، احتمال أن يكون الطالب المختار عشوائيًا أصغر من 13 سنة يساوي ⅕. كم طالبًا عمره أقل من 13 سنة؟', '[{"id": "a", "text": "اثنان"}, {"id": "b", "text": "ثلاثة"}, {"id": "c", "text": "أربعة"}, {"id": "d", "text": "خمسة"}, {"id": "e", "text": "ستة"}]'::jsonb, '{"value": "e"}'::jsonb, '["⅕ × 30 = 6"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M022146', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 5 from a, qi;
with s as (select id from skills where code = 'G8-S13'), a as (select id from assessments where kind = 'model' and form_label = 't03b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'يمر مستقيم بالنقطتين (2، 3) و (4، 7). أيّ النقاط الآتية تقع أيضًا على المستقيم؟', '[{"id": "a", "text": "(0، 2)"}, {"id": "b", "text": "(1، 2)"}, {"id": "c", "text": "(2، 4)"}, {"id": "d", "text": "(3، 5)"}, {"id": "e", "text": "(4، 5)"}]'::jsonb, '{"value": "d"}'::jsonb, '["الميل = (7 − 3) ÷ (4 − 2) = 2", "عند الانتقال من س = 2 إلى س = 3 تزيد ص بمقدار 2: من 3 إلى 5", "النقطة (3، 5) على المستقيم"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M022016', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 6 from a, qi;
with s as (select id from skills where code = 'G8-S04'), a as (select id from assessments where kind = 'model' and form_label = 't03b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'كم زجاجة سعتها 250 مللترًا يمكن ملؤها من 400 لتر من الماء؟', '[{"id": "a", "text": "16"}, {"id": "b", "text": "160"}, {"id": "c", "text": "1600"}, {"id": "d", "text": "16000"}]'::jsonb, '{"value": "c"}'::jsonb, '["400 لتر = 400000 مللتر", "400000 ÷ 250 = 1600"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M022005', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 7 from a, qi;
with s as (select id from skills where code = 'G8-S04'), a as (select id from assessments where kind = 'model' and form_label = 't03b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'أيّ المدد الزمنية الآتية هي الأقصر؟', '[{"id": "a", "text": "يوم واحد"}, {"id": "b", "text": "20 ساعة"}, {"id": "c", "text": "1800 دقيقة"}, {"id": "d", "text": "90000 ثانية"}]'::jsonb, '{"value": "b"}'::jsonb, '["يوم = 24 ساعة، 1800 دقيقة = 30 ساعة، 90000 ثانية = 25 ساعة", "الأقصر 20 ساعة"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M022188', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 8 from a, qi;
with s as (select id from skills where code = 'G8-S14'), a as (select id from assessments where kind = 'model' and form_label = 't03b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'ما الوحدة المستعملة عادة لقياس مساحة بحجم ملعب كرة قدم؟', '[{"id": "a", "text": "السنتيمتر المربع"}, {"id": "b", "text": "السنتيمتر المكعب"}, {"id": "c", "text": "المتر المربع"}, {"id": "d", "text": "المتر المكعب"}]'::jsonb, '{"value": "c"}'::jsonb, '["المساحة تقاس بوحدات مربعة", "ملعب كرة القدم كبير، فالأنسب المتر المربع"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M032699', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 9 from a, qi;
with s as (select id from skills where code = 'G8-S14'), a as (select id from assessments where kind = 'model' and form_label = 't03b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'أيّ القياسات الآتية يمكن أن يكون مساحة مثلث؟', '[{"id": "a", "text": "2 سم"}, {"id": "b", "text": "3 م"}, {"id": "c", "text": "5 سم²"}, {"id": "d", "text": "8 م³"}]'::jsonb, '{"value": "c"}'::jsonb, '["المساحة تقاس بوحدات مربعة", "الخيار الوحيد بوحدة مربعة 5 سم²"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M032732', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 10 from a, qi;
with s as (select id from skills where code = 'G8-S03'), a as (select id from assessments where kind = 'model' and form_label = 't03b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'طول صندوق 9 سم مقربًا إلى أقرب سنتيمتر. أيّ القياسات الآتية يمكن أن يكون الطول الفعلي؟', '[{"id": "a", "text": "10 سم"}, {"id": "b", "text": "9.9 سم"}, {"id": "c", "text": "9.6 سم"}, {"id": "d", "text": "8.6 سم"}]'::jsonb, '{"value": "d"}'::jsonb, '["الأطوال التي تقرَّب إلى 9 تقع بين 8.5 و 9.5", "8.6 هو الوحيد ضمن هذا المدى"]'::jsonb, 'published', 'library', 'TIMSS 2003 · M012003', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 11 from a, qi;
insert into assessments (kind, form_label, title, is_open, sort_order, source_label, source_url) values ('model', 't99a', 'TIMSS 1999 — الأعداد (1)', true, 13, 'مقتبس ومترجم بتصرف من أسئلة TIMSS 1999 المنشورة للصف الثامن. TIMSS 1999 Assessment © IEA، للاستخدام التعليمي غير التجاري', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf');
with s as (select id from skills where code = 'G8-S05'), a as (select id from assessments where kind = 'model' and form_label = 't99a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'في 100 جرام من طعام ما 300 سعرة حرارية. كم سعرة حرارية في حصة مقدارها 30 جرامًا؟', '[{"id": "a", "text": "90"}, {"id": "b", "text": "100"}, {"id": "c", "text": "900"}, {"id": "d", "text": "1000"}, {"id": "e", "text": "9000"}]'::jsonb, '{"value": "a"}'::jsonb, '["كل جرام فيه 3 سعرات", "30 × 3 = 90"]'::jsonb, 'published', 'library', 'TIMSS 1999 · B08', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 1 from a, qi;
with s as (select id from skills where code = 'G8-S03'), a as (select id from assessments where kind = 'model' and form_label = 't99a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'أيّ الأعداد الآتية هو الأصغر؟', '[{"id": "a", "text": "0.625"}, {"id": "b", "text": "0.25"}, {"id": "c", "text": "0.375"}, {"id": "d", "text": "0.5"}, {"id": "e", "text": "0.125"}]'::jsonb, '{"value": "e"}'::jsonb, '["نقارن منزلة الأجزاء من عشرة أولًا", "0.125 هو الأصغر"]'::jsonb, 'published', 'library', 'TIMSS 1999 · B10', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 2 from a, qi;
with s as (select id from skills where code = 'G8-S03'), a as (select id from assessments where kind = 'model' and form_label = 't99a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'أيّ الكسور الآتية هو الأصغر؟', '[{"id": "a", "text": "⅙"}, {"id": "b", "text": "⅔"}, {"id": "c", "text": "⅓"}, {"id": "d", "text": "½"}]'::jsonb, '{"value": "a"}'::jsonb, '["كلما كبر المقام في كسور بسطها 1 صغر الكسر", "⅙ أصغر من ⅓ و ½، و ⅔ أكبرها"]'::jsonb, 'published', 'library', 'TIMSS 1999 · D09', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 3 from a, qi;
with s as (select id from skills where code = 'G8-S04'), a as (select id from assessments where kind = 'model' and form_label = 't99a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'قطع عدّاء 3000 متر في 8 دقائق تمامًا. ما متوسط سرعته بالمتر في الثانية؟', '[{"id": "a", "text": "3.75"}, {"id": "b", "text": "6.25"}, {"id": "c", "text": "16.0"}, {"id": "d", "text": "37.5"}, {"id": "e", "text": "62.5"}]'::jsonb, '{"value": "b"}'::jsonb, '["8 دقائق = 480 ثانية", "3000 ÷ 480 = 6.25 م/ث"]'::jsonb, 'published', 'library', 'TIMSS 1999 · F07', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 4 from a, qi;
with s as (select id from skills where code = 'G8-S03'), a as (select id from assessments where kind = 'model' and form_label = 't99a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'أيّ الأعداد الآتية يقع بين 0.07 و 0.08؟', '[{"id": "a", "text": "0.00075"}, {"id": "b", "text": "0.0075"}, {"id": "c", "text": "0.075"}, {"id": "d", "text": "0.75"}]'::jsonb, '{"value": "c"}'::jsonb, '["0.07 = 0.070 و 0.08 = 0.080", "0.075 يقع بينهما"]'::jsonb, 'published', 'library', 'TIMSS 1999 · F09', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 5 from a, qi;
with s as (select id from skills where code = 'G8-S02'), a as (select id from assessments where kind = 'model' and form_label = 't99a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'أيّ المجاميع الآتية هو الأقرب إلى 691 + 208؟', '[{"id": "a", "text": "600 + 200"}, {"id": "b", "text": "700 + 200"}, {"id": "c", "text": "700 + 300"}, {"id": "d", "text": "900 + 200"}]'::jsonb, '{"value": "b"}'::jsonb, '["691 تقريبًا 700، و 208 تقريبًا 200"]'::jsonb, 'published', 'library', 'TIMSS 1999 · H09', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 6 from a, qi;
with s as (select id from skills where code = 'G8-S04'), a as (select id from assessments where kind = 'model' and form_label = 't99a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'ما ناتج قسمة 15.45 على 0.003؟', '[{"id": "a", "text": "0.515"}, {"id": "b", "text": "5.15"}, {"id": "c", "text": "51.5"}, {"id": "d", "text": "515"}, {"id": "e", "text": "5150"}]'::jsonb, '{"value": "e"}'::jsonb, '["نضرب المقسوم والمقسوم عليه في 1000: 15450 ÷ 3", "= 5150"]'::jsonb, 'published', 'library', 'TIMSS 1999 · J14', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 7 from a, qi;
with s as (select id from skills where code = 'G8-S03'), a as (select id from assessments where kind = 'model' and form_label = 't99a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'أيّ الأعداد الآتية هو مئتان وستة وتسعة أعشار؟', '[{"id": "a", "text": "206.09"}, {"id": "b", "text": "206.9"}, {"id": "c", "text": "206.910"}, {"id": "d", "text": "2006.9"}]'::jsonb, '{"value": "b"}'::jsonb, '["مئتان وستة = 206", "تسعة أعشار = 0.9", "العدد 206.9"]'::jsonb, 'published', 'library', 'TIMSS 1999 · L10', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 8 from a, qi;
with s as (select id from skills where code = 'G8-S04'), a as (select id from assessments where kind = 'model' and form_label = 't99a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'ما قيمة ⅘ − ⅓ − 1/15 ؟', '[{"id": "a", "text": "⅕"}, {"id": "b", "text": "⅖"}, {"id": "c", "text": "7/15"}, {"id": "d", "text": "¾"}, {"id": "e", "text": "⅘"}]'::jsonb, '{"value": "b"}'::jsonb, '["نوحد المقامات إلى 15: 12/15 − 5/15 − 1/15", "= 6/15 = ⅖"]'::jsonb, 'published', 'library', 'TIMSS 1999 · L18', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 9 from a, qi;
with s as (select id from skills where code = 'G8-S01'), a as (select id from assessments where kind = 'model' and form_label = 't99a'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'عدد السيارات في معرض 17175 سيارة. ما العدد مقربًا إلى أقرب مئة؟', '[{"id": "a", "text": "17000"}, {"id": "b", "text": "17100"}, {"id": "c", "text": "17200"}, {"id": "d", "text": "17270"}]'::jsonb, '{"value": "c"}'::jsonb, '["رقم العشرات 7 أكبر من 5 أو يساويه، فنقرب إلى الأعلى", "17175 ← 17200"]'::jsonb, 'published', 'library', 'TIMSS 1999 · N11', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 10 from a, qi;
insert into assessments (kind, form_label, title, is_open, sort_order, source_label, source_url) values ('model', 't99b', 'TIMSS 1999 — الأعداد (2)', true, 14, 'مقتبس ومترجم بتصرف من أسئلة TIMSS 1999 المنشورة للصف الثامن. TIMSS 1999 Assessment © IEA، للاستخدام التعليمي غير التجاري', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf');
with s as (select id from skills where code = 'G8-S03'), a as (select id from assessments where kind = 'model' and form_label = 't99b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'في أيّ القوائم الآتية تكون جميع الكسور متكافئة؟', '[{"id": "a", "text": "½ ، 2/4 ، 4/6"}, {"id": "b", "text": "⅔ ، 4/6 ، 8/12"}, {"id": "c", "text": "⅖ ، 4/10 ، 8/50"}, {"id": "d", "text": "¾ ، 4/6 ، 6/8"}]'::jsonb, '{"value": "b"}'::jsonb, '["4/6 = ⅔ و 8/12 = ⅔", "بقية القوائم فيها كسر غير مكافئ"]'::jsonb, 'published', 'library', 'TIMSS 1999 · N14', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 1 from a, qi;
with s as (select id from skills where code = 'G8-S04'), a as (select id from assessments where kind = 'model' and form_label = 't99b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'reasoning', 2, 'mcq', 'أعطى طالب ثلث كُراته لصديقه، ثم أعطى ربع ما بقي معه لأخيه، فبقي معه 24 كرة. كم كرة كانت معه في البداية؟', '[{"id": "a", "text": "36"}, {"id": "b", "text": "48"}, {"id": "c", "text": "60"}, {"id": "d", "text": "96"}]'::jsonb, '{"value": "b"}'::jsonb, '["بعد إعطاء الثلث يبقى ⅔ العدد", "بعد إعطاء ربع الباقي يبقى ¾ × ⅔ = ½ العدد", "½ العدد = 24، إذن العدد 48"]'::jsonb, 'published', 'library', 'TIMSS 1999 · N16', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 2 from a, qi;
with s as (select id from skills where code = 'G8-S04'), a as (select id from assessments where kind = 'model' and form_label = 't99b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'في علبة 25 لترًا من الطلاء. استُعمل منها 2.5 لتر في الساعة مدة 5.5 ساعات. كم لترًا بقي؟', '[{"id": "a", "text": "10.25"}, {"id": "b", "text": "11.25"}, {"id": "c", "text": "12.75"}, {"id": "d", "text": "13.75"}]'::jsonb, '{"value": "b"}'::jsonb, '["المستعمل = 2.5 × 5.5 = 13.75 لترًا", "الباقي = 25 − 13.75 = 11.25 لترًا"]'::jsonb, 'published', 'library', 'TIMSS 1999 · N17', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 3 from a, qi;
with s as (select id from skills where code = 'G8-S02'), a as (select id from assessments where kind = 'model' and form_label = 't99b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'في موقف 68 صفًا، في كل صف 92 سيارة. أيّ التقديرات الآتية هو الأقرب لعدد السيارات؟', '[{"id": "a", "text": "60 × 90 = 5400"}, {"id": "b", "text": "60 × 100 = 6000"}, {"id": "c", "text": "70 × 90 = 6300"}, {"id": "d", "text": "70 × 100 = 7000"}]'::jsonb, '{"value": "c"}'::jsonb, '["68 تقريبًا 70، و 92 تقريبًا 90", "70 × 90 = 6300"]'::jsonb, 'published', 'library', 'TIMSS 1999 · P13', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 4 from a, qi;
with s as (select id from skills where code = 'G8-S02'), a as (select id from assessments where kind = 'model' and form_label = 't99b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'سرعة الصوت 330 مترًا في الثانية. سُمع صوت بعد 28 ثانية من حدوثه. ما أقرب تقدير للمسافة؟', '[{"id": "a", "text": "12000 م"}, {"id": "b", "text": "9000 م"}, {"id": "c", "text": "8000 م"}, {"id": "d", "text": "6000 م"}]'::jsonb, '{"value": "b"}'::jsonb, '["330 × 28 = 9240 مترًا", "أقرب تقدير 9000 م"]'::jsonb, 'published', 'library', 'TIMSS 1999 · P14', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 5 from a, qi;
with s as (select id from skills where code = 'G8-S04'), a as (select id from assessments where kind = 'model' and form_label = 't99b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'ما ناتج 4.722 − 1.935 ؟', '[{"id": "a", "text": "2.787"}, {"id": "b", "text": "2.797"}, {"id": "c", "text": "2.887"}, {"id": "d", "text": "2.897"}]'::jsonb, '{"value": "a"}'::jsonb, '["4.722 − 1.935 = 2.787"]'::jsonb, 'published', 'library', 'TIMSS 1999 · R07', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 6 from a, qi;
with s as (select id from skills where code = 'G8-S04'), a as (select id from assessments where kind = 'model' and form_label = 't99b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'كتلة 500 بلورة ملح 6.5 جرامات. ما متوسط كتلة البلورة الواحدة؟', '[{"id": "a", "text": "0.0078 جم"}, {"id": "b", "text": "0.013 جم"}, {"id": "c", "text": "0.0325 جم"}, {"id": "d", "text": "0.078 جم"}]'::jsonb, '{"value": "b"}'::jsonb, '["6.5 ÷ 500 = 0.013 جم"]'::jsonb, 'published', 'library', 'TIMSS 1999 · R08', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 7 from a, qi;
with s as (select id from skills where code = 'G8-S02'), a as (select id from assessments where kind = 'model' and form_label = 't99b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'ما ناتج 7003 − 4078 ؟', '[{"id": "a", "text": "2035"}, {"id": "b", "text": "2925"}, {"id": "c", "text": "3005"}, {"id": "d", "text": "3925"}]'::jsonb, '{"value": "b"}'::jsonb, '["7003 − 4078 = 2925"]'::jsonb, 'published', 'library', 'TIMSS 1999 · R13', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 8 from a, qi;
with s as (select id from skills where code = 'G8-S04'), a as (select id from assessments where kind = 'model' and form_label = 't99b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'رزمة فيها 400 ورقة، سُمك الورقة 0.012 سم. ما ارتفاع الرزمة؟', '[{"id": "a", "text": "0.048 سم"}, {"id": "b", "text": "0.48 سم"}, {"id": "c", "text": "4.8 سم"}, {"id": "d", "text": "48 سم"}]'::jsonb, '{"value": "c"}'::jsonb, '["400 × 0.012 = 4.8 سم"]'::jsonb, 'published', 'library', 'TIMSS 1999 · T04', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 9 from a, qi;
with s as (select id from skills where code = 'G8-S05'), a as (select id from assessments where kind = 'model' and form_label = 't99b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'خليط سماد فيه 2 كجم نترات و 3 كجم فوسفات و 6 كجم بوتاس. ما نسبة النترات إلى الكتلة الكلية؟', '[{"id": "a", "text": "11/9"}, {"id": "b", "text": "⅔"}, {"id": "c", "text": "2/9"}, {"id": "d", "text": "2/11"}]'::jsonb, '{"value": "d"}'::jsonb, '["الكتلة الكلية = 2 + 3 + 6 = 11 كجم", "النسبة = 2/11"]'::jsonb, 'published', 'library', 'TIMSS 1999 · V03', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 10 from a, qi;
with s as (select id from skills where code = 'G8-S05'), a as (select id from assessments where kind = 'model' and form_label = 't99b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'إذا كان 7 : 13 = س : 52، فما قيمة س؟', '[{"id": "a", "text": "7"}, {"id": "b", "text": "13"}, {"id": "c", "text": "28"}, {"id": "d", "text": "364"}]'::jsonb, '{"value": "c"}'::jsonb, '["52 = 13 × 4", "س = 7 × 4 = 28"]'::jsonb, 'published', 'library', 'TIMSS 1999 · D08', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 11 from a, qi;
with s as (select id from skills where code = 'G8-S02'), a as (select id from assessments where kind = 'model' and form_label = 't99b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'reasoning', 2, 'mcq', 'تحرك مصعد من الطابق الأول إلى الخامس، ثم إلى الثاني، ثم إلى الرابع، ثم إلى الثالث. المسافة بين كل طابقين متتاليين 3 أمتار. ما المسافة الكلية التي قطعها المصعد؟', '[{"id": "a", "text": "18 م"}, {"id": "b", "text": "27 م"}, {"id": "c", "text": "30 م"}, {"id": "d", "text": "45 م"}]'::jsonb, '{"value": "c"}'::jsonb, '["عدد الطوابق المقطوعة: 4 + 3 + 2 + 1 = 10", "المسافة = 10 × 3 = 30 م"]'::jsonb, 'published', 'library', 'TIMSS 1999 · L12', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 12 from a, qi;
with s as (select id from skills where code = 'G8-S01'), a as (select id from assessments where kind = 'model' and form_label = 't99b'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'reasoning', 2, 'mcq', 'إذا كان ك عددًا سالبًا، فأيّ العبارات الآتية تكون موجبة؟', '[{"id": "a", "text": "ك²"}, {"id": "b", "text": "ك³"}, {"id": "c", "text": "2ك"}, {"id": "d", "text": "ك ÷ 2"}]'::jsonb, '{"value": "a"}'::jsonb, '["مربع العدد السالب موجب", "ك³ و 2ك و ك ÷ 2 كلها سالبة"]'::jsonb, 'published', 'library', 'TIMSS 1999 · R12', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 13 from a, qi;
insert into assessments (kind, form_label, title, is_open, sort_order, source_label, source_url) values ('model', 't99c', 'TIMSS 1999 — الجبر والهندسة والاحتمالات', true, 15, 'مقتبس ومترجم بتصرف من أسئلة TIMSS 1999 المنشورة للصف الثامن. TIMSS 1999 Assessment © IEA، للاستخدام التعليمي غير التجاري', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf');
with s as (select id from skills where code = 'G8-S09'), a as (select id from assessments where kind = 'model' and form_label = 't99c'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'ضُرب العدد ن في 7، ثم أضيف 6 إلى الناتج، فكان الناتج 41. أيّ المعادلات تمثل ذلك؟', '[{"id": "a", "text": "7ن + 6 = 41"}, {"id": "b", "text": "7ن − 6 = 41"}, {"id": "c", "text": "7ن × 6 = 41"}, {"id": "d", "text": "7(ن + 6) = 41"}]'::jsonb, '{"value": "a"}'::jsonb, '["ن × 7 = 7ن", "نضيف 6: 7ن + 6 = 41"]'::jsonb, 'published', 'library', 'TIMSS 1999 · B12', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 1 from a, qi;
with s as (select id from skills where code = 'G8-S09'), a as (select id from assessments where kind = 'model' and form_label = 't99c'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'تكلفة طباعة ن بطاقة: 100 هللة رسومًا ثابتة، و 6 هللات لكل بطاقة. أيّ الصيغ تمثل التكلفة ت؟', '[{"id": "a", "text": "ت = 100 + 6ن"}, {"id": "b", "text": "ت = 106 + ن"}, {"id": "c", "text": "ت = 6 + 100ن"}, {"id": "d", "text": "ت = 106ن"}]'::jsonb, '{"value": "a"}'::jsonb, '["تكلفة البطاقات 6ن", "نضيف الرسوم الثابتة: 100 + 6ن"]'::jsonb, 'published', 'library', 'TIMSS 1999 · D10', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 2 from a, qi;
with s as (select id from skills where code = 'G8-S10'), a as (select id from assessments where kind = 'model' and form_label = 't99c'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'أربعة أمثال عدد تساوي 48. ما ثلث هذا العدد؟', '[{"id": "a", "text": "4"}, {"id": "b", "text": "8"}, {"id": "c", "text": "12"}, {"id": "d", "text": "16"}]'::jsonb, '{"value": "a"}'::jsonb, '["4ن = 48، إذن ن = 12", "ثلث 12 = 4"]'::jsonb, 'published', 'library', 'TIMSS 1999 · F11', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 3 from a, qi;
with s as (select id from skills where code = 'G8-S08'), a as (select id from assessments where kind = 'model' and form_label = 't99c'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'أيّ العبارات الآتية تساوي ن × ن × ن لكل قيم ن؟', '[{"id": "a", "text": "ن + 3"}, {"id": "b", "text": "3ن"}, {"id": "c", "text": "ن³"}, {"id": "d", "text": "ن² + ن"}]'::jsonb, '{"value": "c"}'::jsonb, '["ضرب العدد في نفسه ثلاث مرات يُكتب ن³"]'::jsonb, 'published', 'library', 'TIMSS 1999 · P09', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 4 from a, qi;
with s as (select id from skills where code = 'G8-S08'), a as (select id from assessments where kind = 'model' and form_label = 't99c'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'تُكتب العبارة ك + ك + ك + ك + ك على الصورة:', '[{"id": "a", "text": "ك + 5"}, {"id": "b", "text": "5ك"}, {"id": "c", "text": "ك⁵"}, {"id": "d", "text": "5(ك + 1)"}]'::jsonb, '{"value": "b"}'::jsonb, '["جمع ك خمس مرات = 5 × ك = 5ك"]'::jsonb, 'published', 'library', 'TIMSS 1999 · P11', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 5 from a, qi;
with s as (select id from skills where code = 'G8-S08'), a as (select id from assessments where kind = 'model' and form_label = 't99c'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'reasoning', 2, 'mcq', 'أيّ العبارات الآتية صحيحة دائمًا لأي أعداد حقيقية مختلفة أ، ب، جـ؟', '[{"id": "a", "text": "أ − ب = ب − أ"}, {"id": "b", "text": "أ(ب − جـ) = ب(جـ − أ)"}, {"id": "c", "text": "ب − جـ = جـ − ب"}, {"id": "d", "text": "أ ب = ب أ"}]'::jsonb, '{"value": "d"}'::jsonb, '["عملية الضرب إبدالية: أ ب = ب أ", "الطرح ليس إبداليًا"]'::jsonb, 'published', 'library', 'TIMSS 1999 · R10', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 6 from a, qi;
with s as (select id from skills where code = 'G8-S14'), a as (select id from assessments where kind = 'model' and form_label = 't99c'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'knowing', 2, 'mcq', 'ما أنسب وحدة لقياس كتلة بيضة؟', '[{"id": "a", "text": "السنتيمتر"}, {"id": "b", "text": "المللتر"}, {"id": "c", "text": "الجرام"}, {"id": "d", "text": "الكيلوجرام"}]'::jsonb, '{"value": "c"}'::jsonb, '["الكتلة تقاس بالجرام أو الكيلوجرام", "كتلة البيضة صغيرة، فالجرام أنسب"]'::jsonb, 'published', 'library', 'TIMSS 1999 · D11', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 7 from a, qi;
with s as (select id from skills where code = 'G8-S14'), a as (select id from assessments where kind = 'model' and form_label = 't99c'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'شكل رباعي قياس زاويتين منه 115° لكل منهما، وقياس الزاوية الثالثة 70°. ما قياس الزاوية الرابعة؟', '[{"id": "a", "text": "60°"}, {"id": "b", "text": "70°"}, {"id": "c", "text": "130°"}, {"id": "d", "text": "140°"}]'::jsonb, '{"value": "a"}'::jsonb, '["مجموع زوايا الشكل الرباعي 360°", "360 − (115 + 115 + 70) = 60°"]'::jsonb, 'published', 'library', 'TIMSS 1999 · L16', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 8 from a, qi;
with s as (select id from skills where code = 'G8-S14'), a as (select id from assessments where kind = 'model' and form_label = 't99c'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'reasoning', 2, 'mcq', 'أيّ العبارات الآتية ليست صحيحة لجميع المستطيلات؟', '[{"id": "a", "text": "كل ضلعين متقابلين متوازيان"}, {"id": "b", "text": "كل ضلعين متقابلين متساويان"}, {"id": "c", "text": "جميع الزوايا قوائم"}, {"id": "d", "text": "القطران متساويان"}, {"id": "e", "text": "القطران متعامدان"}]'::jsonb, '{"value": "e"}'::jsonb, '["خصائص المستطيل: الأضلاع المتقابلة متوازية ومتساوية، والزوايا قوائم، والقطران متساويان", "القطران متعامدان في المربع فقط"]'::jsonb, 'published', 'library', 'TIMSS 1999 · J11', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 9 from a, qi;
with s as (select id from skills where code = 'G8-S19'), a as (select id from assessments where kind = 'model' and form_label = 't99c'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'reasoning', 2, 'mcq', 'أُلقيت قطعة نقود منتظمة أربع مرات متتالية فظهرت الصورة في كل مرة. ما الأرجح في الرمية الخامسة؟', '[{"id": "a", "text": "الكتابة أرجح"}, {"id": "b", "text": "الصورة أرجح"}, {"id": "c", "text": "ظهور الصورة والكتابة متساويان في الاحتمال"}, {"id": "d", "text": "تلزم معلومات إضافية"}]'::jsonb, '{"value": "c"}'::jsonb, '["الرميات مستقلة ولا تتأثر بما قبلها", "احتمال كل وجه ½"]'::jsonb, 'published', 'library', 'TIMSS 1999 · F08', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 10 from a, qi;
with s as (select id from skills where code = 'G8-S19'), a as (select id from assessments where kind = 'model' and form_label = 't99c'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url)
  select s.id, 'applying', 2, 'mcq', 'في عينة من 100 مصباح من دفعة فيها 3000 مصباح وُجد 5 مصابيح معيبة. كم مصباحًا معيبًا يُتوقع في الدفعة كلها؟', '[{"id": "a", "text": "15"}, {"id": "b", "text": "60"}, {"id": "c", "text": "150"}, {"id": "d", "text": "300"}, {"id": "e", "text": "600"}]'::jsonb, '{"value": "c"}'::jsonb, '["نسبة المعيب في العينة 5%", "5% من 3000 = 150"]'::jsonb, 'published', 'library', 'TIMSS 1999 · H11', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf'
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 11 from a, qi;

-- أسئلة التدريب الأصيلة
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'knowing', 1, 'mcq', 'ما قيمة √144 − √49 ؟', '[{"id": "a", "text": "5"}, {"id": "b", "text": "95"}, {"id": "c", "text": "12"}, {"id": "d", "text": "7"}]'::jsonb, '{"value": "a"}'::jsonb, '["√144 = 12 و √49 = 7", "12 − 7 = 5"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S01';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'knowing', 2, 'mcq', 'ما القاسم المشترك الأكبر للعددين 18 و 24؟', '[{"id": "a", "text": "3"}, {"id": "b", "text": "6"}, {"id": "c", "text": "12"}, {"id": "d", "text": "72"}]'::jsonb, '{"value": "b"}'::jsonb, '["قواسم 18: 1، 2، 3، 6، 9، 18", "قواسم 24: 1، 2، 3، 4، 6، 8، 12، 24", "أكبر قاسم مشترك 6"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S01';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'knowing', 1, 'mcq', 'أيّ الآتية يساوي 0.4 ؟', '[{"id": "a", "text": "4%"}, {"id": "b", "text": "40%"}, {"id": "c", "text": "¼"}, {"id": "d", "text": "4/100"}]'::jsonb, '{"value": "b"}'::jsonb, '["0.4 = 40/100", "= 40%"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S06';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'applying', 2, 'mcq', 'قطعت سيارة 150 كم في ساعتين بسرعة ثابتة. كم كيلومترًا تقطع في 5 ساعات بالسرعة نفسها؟', '[{"id": "a", "text": "300"}, {"id": "b", "text": "375"}, {"id": "c", "text": "450"}, {"id": "d", "text": "750"}]'::jsonb, '{"value": "b"}'::jsonb, '["السرعة = 150 ÷ 2 = 75 كم في الساعة", "75 × 5 = 375 كم"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S06';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'applying', 3, 'mcq', 'انخفض عدد زوار متحف من 800 زائر إلى 600 زائر. ما النسبة المئوية للانخفاض؟', '[{"id": "a", "text": "20%"}, {"id": "b", "text": "25%"}, {"id": "c", "text": "33%"}, {"id": "d", "text": "75%"}]'::jsonb, '{"value": "b"}'::jsonb, '["مقدار الانخفاض = 800 − 600 = 200", "النسبة = 200 ÷ 800 = 0.25 = 25%"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S06';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'knowing', 1, 'mcq', 'ما قيمة 3س + 2 عندما س = 4 ؟', '[{"id": "a", "text": "9"}, {"id": "b", "text": "12"}, {"id": "c", "text": "14"}, {"id": "d", "text": "20"}]'::jsonb, '{"value": "c"}'::jsonb, '["3 × 4 = 12", "12 + 2 = 14"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S07';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'applying', 2, 'mcq', 'مساحة المستطيل م = ل × ض. ما مساحة مستطيل طوله 7.5 سم وعرضه 4 سم؟', '[{"id": "a", "text": "11.5 سم²"}, {"id": "b", "text": "23 سم²"}, {"id": "c", "text": "28 سم²"}, {"id": "d", "text": "30 سم²"}]'::jsonb, '{"value": "d"}'::jsonb, '["م = 7.5 × 4", "= 30 سم²"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S07';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'knowing', 1, 'mcq', 'ما ميل المستقيم ص = 3س − 5 ؟', '[{"id": "a", "text": "−5"}, {"id": "b", "text": "3"}, {"id": "c", "text": "5"}, {"id": "d", "text": "−3"}]'::jsonb, '{"value": "b"}'::jsonb, '["في الصورة ص = م س + ب يكون الميل م", "الميل = 3"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S11';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'applying', 2, 'mcq', 'شمعة طولها 20 سم، ينقص طولها 2 سم كل ساعة احتراق. أيّ الدوال تمثل طولها ط بعد ن ساعة؟', '[{"id": "a", "text": "ط = 20 − 2ن"}, {"id": "b", "text": "ط = 2ن − 20"}, {"id": "c", "text": "ط = 20 + 2ن"}, {"id": "d", "text": "ط = 18ن"}]'::jsonb, '{"value": "a"}'::jsonb, '["الطول الابتدائي 20", "ينقص 2 كل ساعة: ط = 20 − 2ن"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S11';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'applying', 2, 'mcq', 'أيّ النقاط الآتية تقع على المستقيم ص = 2س + 1 ؟', '[{"id": "a", "text": "(1، 2)"}, {"id": "b", "text": "(2، 5)"}, {"id": "c", "text": "(3، 6)"}, {"id": "d", "text": "(0، 2)"}]'::jsonb, '{"value": "b"}'::jsonb, '["نعوض س = 2: ص = 2 × 2 + 1 = 5", "النقطة (2، 5) على المستقيم"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S11';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'knowing', 1, 'mcq', 'ما الحد التالي في النمط: 1، 4، 9، 16، ... ؟', '[{"id": "a", "text": "20"}, {"id": "b", "text": "23"}, {"id": "c", "text": "25"}, {"id": "d", "text": "32"}]'::jsonb, '{"value": "c"}'::jsonb, '["الحدود مربعات الأعداد 1، 2، 3، 4", "الحد التالي مربع العدد 5، أي 25"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S12';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'knowing', 1, 'mcq', 'إذا كانت ص = س²، فما قيمة ص عندما س = −3 ؟', '[{"id": "a", "text": "−9"}, {"id": "b", "text": "−6"}, {"id": "c", "text": "6"}, {"id": "d", "text": "9"}]'::jsonb, '{"value": "d"}'::jsonb, '["مربع −3 يساوي (−3) × (−3)", "= 9"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S12';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'applying', 2, 'mcq', 'في النمط: 3، 6، 12، 24، ... كل حد ضعف الحد الذي قبله. ما الحد السادس؟', '[{"id": "a", "text": "48"}, {"id": "b", "text": "72"}, {"id": "c", "text": "96"}, {"id": "d", "text": "192"}]'::jsonb, '{"value": "c"}'::jsonb, '["الحد الخامس = 24 × 2 = 48", "الحد السادس = 48 × 2 = 96"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S12';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'reasoning', 3, 'mcq', 'قيم ص في جدول: عندما س = 1 فإن ص = 2، وعندما س = 2 فإن ص = 5، وعندما س = 3 فإن ص = 10، وعندما س = 4 فإن ص = 17. أيّ القواعد تمثل العلاقة؟', '[{"id": "a", "text": "ص = 3س − 1"}, {"id": "b", "text": "ص = س² + 1"}, {"id": "c", "text": "ص = 2س + 1"}, {"id": "d", "text": "ص = س + 1"}]'::jsonb, '{"value": "b"}'::jsonb, '["الفروق 3، 5، 7 غير ثابتة، فالعلاقة غير خطية", "نجرب ص = س² + 1: 2، 5، 10، 17 ✓"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S12';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'knowing', 1, 'mcq', 'زاويتان متتامتان، قياس إحداهما 35°. ما قياس الأخرى؟', '[{"id": "a", "text": "55°"}, {"id": "b", "text": "65°"}, {"id": "c", "text": "145°"}, {"id": "d", "text": "325°"}]'::jsonb, '{"value": "a"}'::jsonb, '["مجموع الزاويتين المتتامتين 90°", "90 − 35 = 55°"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S13';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'applying', 2, 'mcq', 'ما المسافة بين النقطتين (1، 4) و (8، 4) في المستوى الإحداثي؟', '[{"id": "a", "text": "3"}, {"id": "b", "text": "4"}, {"id": "c", "text": "7"}, {"id": "d", "text": "9"}]'::jsonb, '{"value": "c"}'::jsonb, '["للنقطتين الإحداثي الصادي نفسه", "المسافة = 8 − 1 = 7 وحدات"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S13';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'knowing', 1, 'mcq', 'أُزيحت النقطة (2، 5) ثلاث وحدات إلى اليمين ووحدتين إلى الأعلى. ما صورتها؟', '[{"id": "a", "text": "(5، 7)"}, {"id": "b", "text": "(4، 8)"}, {"id": "c", "text": "(5، 3)"}, {"id": "d", "text": "(2، 10)"}]'::jsonb, '{"value": "a"}'::jsonb, '["الإزاحة إلى اليمين تزيد الإحداثي السيني: 2 + 3 = 5", "الإزاحة إلى الأعلى تزيد الإحداثي الصادي: 5 + 2 = 7"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S15';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'applying', 1, 'mcq', 'مثلثان متطابقان، أطوال أضلاع الأول 5 سم و 7 سم و 9 سم. ما محيط المثلث الثاني؟', '[{"id": "a", "text": "16 سم"}, {"id": "b", "text": "21 سم"}, {"id": "c", "text": "42 سم"}, {"id": "d", "text": "315 سم"}]'::jsonb, '{"value": "b"}'::jsonb, '["المثلثان المتطابقان أضلاعهما المتناظرة متساوية", "المحيط = 5 + 7 + 9 = 21 سم"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S15';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'applying', 2, 'mcq', 'صورة مستطيلة بُعداها 10 سم و 15 سم، كُبِّرت مع المحافظة على التناسب فصار بُعدها الأقصر 20 سم. ما بُعدها الأطول الجديد؟', '[{"id": "a", "text": "25 سم"}, {"id": "b", "text": "30 سم"}, {"id": "c", "text": "35 سم"}, {"id": "d", "text": "40 سم"}]'::jsonb, '{"value": "b"}'::jsonb, '["معامل التكبير = 20 ÷ 10 = 2", "البعد الأطول = 15 × 2 = 30 سم"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S15';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'reasoning', 3, 'mcq', 'أيّ التحويلات الآتية قد يغير قياسات الشكل؟', '[{"id": "a", "text": "الإزاحة"}, {"id": "b", "text": "الانعكاس"}, {"id": "c", "text": "الدوران"}, {"id": "d", "text": "التمدد"}]'::jsonb, '{"value": "d"}'::jsonb, '["الإزاحة والانعكاس والدوران تحافظ على القياسات", "التمدد يكبّر الشكل أو يصغّره"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S15';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'knowing', 1, 'mcq', 'باع متجر في أربعة أيام: السبت 40 قطعة، والأحد 55، والاثنين 35، والثلاثاء 70. ما الفرق بين أكبر مبيعات يومية وأقلها؟', '[{"id": "a", "text": "15"}, {"id": "b", "text": "30"}, {"id": "c", "text": "35"}, {"id": "d", "text": "70"}]'::jsonb, '{"value": "c"}'::jsonb, '["أكبر مبيعات 70 وأقلها 35", "70 − 35 = 35"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S16';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'applying', 2, 'mcq', 'في استطلاع، فضّل 45 طالبًا كرة القدم، و 30 طالبًا السباحة، و 25 طالبًا الجري. ما النسبة المئوية لمن فضّلوا السباحة؟', '[{"id": "a", "text": "25%"}, {"id": "b", "text": "30%"}, {"id": "c", "text": "33%"}, {"id": "d", "text": "45%"}]'::jsonb, '{"value": "b"}'::jsonb, '["العدد الكلي = 45 + 30 + 25 = 100", "30 من 100 = 30%"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S16';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'reasoning', 3, 'mcq', 'كان عدد زوار مكتبة 120 في المحرم، و 150 في صفر، و 180 في ربيع الأول، و 210 في ربيع الآخر. إذا استمر الاتجاه نفسه، فما العدد المتوقع في جمادى الأولى؟', '[{"id": "a", "text": "220"}, {"id": "b", "text": "230"}, {"id": "c", "text": "240"}, {"id": "d", "text": "250"}]'::jsonb, '{"value": "c"}'::jsonb, '["الزيادة الشهرية ثابتة = 30", "210 + 30 = 240"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S16';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'knowing', 1, 'mcq', 'أيّ التمثيلات الآتية أنسب لعرض تغير درجة الحرارة خلال أسبوع؟', '[{"id": "a", "text": "الخط البياني"}, {"id": "b", "text": "القطاعات الدائرية"}, {"id": "c", "text": "أشكال فن"}, {"id": "d", "text": "الساق والورقة"}]'::jsonb, '{"value": "a"}'::jsonb, '["الخط البياني يوضح التغير عبر الزمن"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S17';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'knowing', 1, 'mcq', 'أيّ التمثيلات الآتية أنسب لمقارنة أعداد الطلاب في خمسة أندية مدرسية؟', '[{"id": "a", "text": "الأعمدة البيانية"}, {"id": "b", "text": "الخط البياني"}, {"id": "c", "text": "شكل الانتشار"}, {"id": "d", "text": "المدرج التكراري"}]'::jsonb, '{"value": "a"}'::jsonb, '["الأعمدة البيانية تقارن قيم فئات منفصلة"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S17';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'applying', 2, 'mcq', 'أيّ التمثيلات الآتية يُستعمل لدراسة العلاقة بين عدد ساعات المذاكرة ودرجة الاختبار؟', '[{"id": "a", "text": "شكل الانتشار"}, {"id": "b", "text": "القطاعات الدائرية"}, {"id": "c", "text": "الأعمدة البيانية"}, {"id": "d", "text": "الخط البياني"}]'::jsonb, '{"value": "a"}'::jsonb, '["العلاقة بين متغيرين عدديين تُدرس بشكل الانتشار"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S17';
insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label)
select id, 'reasoning', 3, 'mcq', 'يريد باحث معرفة رأي طلاب مدرسة فيها 900 طالب في مواعيد المقصف. أيّ العينات الآتية أنسب؟', '[{"id": "a", "text": "طلاب فصل واحد"}, {"id": "b", "text": "90 طالبًا يُختارون عشوائيًا من جميع الصفوف"}, {"id": "c", "text": "أصدقاء الباحث"}, {"id": "d", "text": "الطلاب الموجودون في المقصف خلال ساعة واحدة"}]'::jsonb, '{"value": "b"}'::jsonb, '["العينة الجيدة تمثل جميع فئات المجتمع", "الاختيار العشوائي من جميع الصفوف يقلل التحيز"]'::jsonb, 'published', 'practice', 'إعداد المنصة' from skills where code = 'G8-S17';
