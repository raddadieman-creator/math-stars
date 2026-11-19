-- =====================================================================
-- المعايير الفرعية لرياضيات الصف الثامن (الثاني المتوسط) والمهارات الفرعية لمستويات التفكير
-- المصدر: دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة
-- كل معيار مهارة في المنصة (رمزها G8-S01 ... G8-S19)، والوصف نص المعيار كما ورد في الدليل،
-- والاسم المختصر من إعداد المنصة لتسهيل العرض.
-- =====================================================================
alter table skills add column if not exists standard_no int;
alter table skills add column if not exists source_label text;
alter table questions add column if not exists cognitive_skill text; -- المهارة الفرعية: الاستدعاء، التمثيل / النمذجة، التبرير ...

insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S01', 'خصائص الأعداد والجذور التربيعية', 'فهم خصائص الأعداد والعمليات، وإيجاد واستعمال المضاعفات والقواسم، وتمييز الأعداد الأولية، وإيجاد القوى الصحيحة الموجبة لعدد، وإيجاد الجذور التربيعية للمربعات الكاملة حتى 144، وحل مسائل تتضمن جذور تربيعية لأعداد كلية.', 1, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 1 from topic_areas t where t.code = 'integers'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S02', 'العمليات على الأعداد الصحيحة', 'إجراء العمليات وحل المسائل على الأعداد الصحيحة الموجبة والسالبة بما في ذلك استخدام خط الأعداد لإجراء العمليات أو النماذج الأخرى (مثل الخسارة والربح ودرجات الحرارة).', 2, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 2 from topic_areas t where t.code = 'integers'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S03', 'مقارنة الكسور والأعداد العشرية وترتيبها', 'استخدام النماذج والتمثيلات المختلفة لمقارنة وترتيب الكسور الاعتيادية والعشرية وتحديد الكسور الاعتيادية والعشرية المتكافئة.', 3, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 3 from topic_areas t where t.code = 'fractions_decimals'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S04', 'العمليات على الكسور والأعداد العشرية', 'إجراء العمليات على الكسور الاعتيادية والعشرية، بما في ذلك المسائل الحياتية عليها.', 4, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 4 from topic_areas t where t.code = 'fractions_decimals'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S05', 'النسب المتكافئة والتقسيم بنسبة معطاة', 'تمييز وإيجاد النسب المتكافئة والتمثيل والنمذجة للنسب وتقسيم كمية بالاعتماد على نسبة معطاة.', 5, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 5 from topic_areas t where t.code = 'ratio_percent'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S06', 'التناسب والنسبة المئوية', 'حل مسائل تتضمن التناسب أو النسب المئوية بما في ذلك التحويل بين النسب المئوية والكسور الاعتيادية والكسور العشرية.', 6, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 6 from topic_areas t where t.code = 'ratio_percent'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S07', 'قيمة العبارة الجبرية', 'إيجاد قيمة عبارة أو صيغة بمعلومية قيمة المتغير فيها.', 7, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 7 from topic_areas t where t.code = 'expressions_equations'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S08', 'تبسيط العبارات الجبرية', 'تبسيط عبارات جبرية تتضمن جمع وضرب وقوى، ومقارنة العبارات لتحديد ما إذا كانت متكافئة.', 8, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 8 from topic_areas t where t.code = 'expressions_equations'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S09', 'كتابة العبارات والمعادلات والمتباينات', 'كتابة عبارات ومعادلات ومتباينات تمثل مسائل حياتية.', 9, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 9 from topic_areas t where t.code = 'expressions_equations'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S10', 'حل المعادلات والمتباينات الخطية', 'حل معادلات ومتباينات خطية، وأنظمة المعادلات الخطية في متغيرين، بما في ذلك تلك التي تنمذج المسائل الحياتية.', 10, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 10 from topic_areas t where t.code = 'expressions_equations'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S11', 'الدوال الخطية وتمثيلاتها', 'إنشاء تمثيلات الدوال الخطية وتفسيرها وربطها بالجداول والرسوم البيانية والكلمات، وتحديد خواص الدوال الخطية بما في ذلك الميل والقاطع.', 11, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 11 from topic_areas t where t.code = 'relations_functions'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S12', 'الدوال غير الخطية والأنماط', 'إنشاء تمثيلات لدوال غير خطية بسيطة (مثل التربيعية) وتفسيرها وربطها بالجداول والرسوم البيانية والكلمات، وتوسيع الأنماط في متتابعة تستخدم الأعداد أو الكلمات أو العبارات الجبرية.', 12, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 12 from topic_areas t where t.code = 'relations_functions'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S13', 'الزوايا والمستقيمات والمستوى الإحداثي', 'تمييز ورسم أنواع الزوايا وأزواج المستقيمات واستعمال العلاقة بين الزوايا والمستقيمات والأشكال الهندسية لحل المسائل، بما في ذلك تلك التي تتضمن قياس الزوايا وأطوال القطع المستقيمة. وحل مسائل تتطلب نقاط على المستوى الإحداثي.', 13, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 13 from topic_areas t where t.code = 'geometry_measurement'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S14', 'الأشكال ثنائية الأبعاد ونظرية فيثاغورث', 'تحديد الأشكال ثنائية الأبعاد واستخدام خواصها الهندسية لحل المسائل، بما في ذلك تلك التي تتطلب حساب المحيط، محيط الدائرة، المساحة، نظرية فيثاغورث.', 14, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 14 from topic_areas t where t.code = 'geometry_measurement'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S15', 'التحويلات الهندسية والتطابق والتشابه', 'التعرف على رسم التحويلات الهندسية (الإزاحة، والانعكاس، والدوران) في المستوى، وتمييز المثلثات والمستطيلات المتطابقة والمتشابهة وحل مسائل على ذلك.', 15, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 15 from topic_areas t where t.code = 'geometry_measurement'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S16', 'قراءة البيانات وتفسيرها', 'قراءة وتفسير البيانات من مصدر أو أكثر لحل المسائل (مثل الاستنتاج والاستقراء وعمل المقارنات واستخلاص النتائج).', 16, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 16 from topic_areas t where t.code = 'data'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S17', 'جمع البيانات وتنظيمها وتمثيلها', 'تحديد الطريقة الأنسب لجمع البيانات وتنظيمها وتمثيلها؛ للإجابة على الأسئلة.', 17, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 17 from topic_areas t where t.code = 'data'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S18', 'مقاييس النزعة المركزية والتشتت', 'حساب واستخدام التفسير الإحصائي للمتوسط والوسيط والمنوال والمدى لتلخيص وتوزيع البيانات، وتحديد أثر انتشار البيانات والقيم المتطرفة.', 18, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 18 from topic_areas t where t.code = 'data'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;
insert into skills (domain_id, topic_id, code, name_ar, description, standard_no, source_label, sort_order)
select t.domain_id, t.id, 'G8-S19', 'الاحتمال النظري والتجريبي', 'إيجاد الاحتمال النظري (المعتمد على النتائج متساوية الاحتمال) للحوادث البسيطة والمركبة، والاحتمال التجريبي (المعتمد على نتائج التجارب).', 19, 'دليل تنمية مهارات التفكير الرياضي وفق معايير الاختبارات الدولية TIMSS 2027 — قسم الرياضيات، الشؤون التعليمية، إدارة تعليم جدة', 19 from topic_areas t where t.code = 'probability'
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, standard_no = excluded.standard_no, source_label = excluded.source_label;


-- ربط أسئلة المكتبة بالمعايير
update questions set skill_id = (select id from skills where code = 'G8-S03') where bank = 'library' and prompt = 'أيّ الأعداد الآتية هو الأكبر؟';
update questions set skill_id = (select id from skills where code = 'G8-S04') where bank = 'library' and prompt = 'اشترت ريم 3 دفاتر، سعر الدفتر الواحد 4.75 ريالات، ودفعت 20 ريالًا. كم ريالًا يتبقى لها؟';
update questions set skill_id = (select id from skills where code = 'G8-S05') where bank = 'library' and prompt = 'تحتاج وصفة إلى 3 أكواب دقيق لكل 4 أكواب حليب. كم كوب دقيق يلزم لـ 10 أكواب حليب؟';
update questions set skill_id = (select id from skills where code = 'G8-S06') where bank = 'library' and prompt = 'ما 15% من 80 ؟';
update questions set skill_id = (select id from skills where code = 'G8-S06') where bank = 'library' and prompt = 'ارتفع سعر سلعة بنسبة 10%، ثم انخفض السعر الجديد بنسبة 10%. أيّ العبارات الآتية صحيحة؟';
update questions set skill_id = (select id from skills where code = 'G8-S02') where bank = 'library' and prompt = 'كانت درجة الحرارة في مدينة −4° صباحًا، وصارت 9° ظهرًا. كم درجة ارتفعت الحرارة؟';
update questions set skill_id = (select id from skills where code = 'G8-S01') where bank = 'library' and prompt = 'أيّ الأعداد الآتية عدد أولي؟';
update questions set skill_id = (select id from skills where code = 'G8-S08') where bank = 'library' and prompt = 'أيّ العبارات الآتية تساوي 3(س + 4)؟';
update questions set skill_id = (select id from skills where code = 'G8-S10') where bank = 'library' and prompt = 'إذا كان 2س − 5 = 11، فما قيمة س؟';
update questions set skill_id = (select id from skills where code = 'G8-S09') where bank = 'library' and prompt = 'سعر تذكرة دخول متحف 15 ريالًا للشخص، إضافة إلى رسوم ثابتة قدرها 10 ريالات للمجموعة. أيّ عبارة تمثل التكلفة الكلية لمجموعة عدد أفرادها ن؟';
update questions set skill_id = (select id from skills where code = 'G8-S12') where bank = 'library' and prompt = 'في النمط: 4، 7، 10، 13، ... ما الحد العشرون؟';
update questions set skill_id = (select id from skills where code = 'G8-S07') where bank = 'library' and prompt = 'ما قيمة 2أ² − ب عندما أ = 3 و ب = 4 ؟';
update questions set skill_id = (select id from skills where code = 'G8-S11') where bank = 'library' and prompt = 'القيم في الجدول: عندما س = 1 فإن ص = 5، وعندما س = 2 فإن ص = 8، وعندما س = 3 فإن ص = 11. أيّ المعادلات تمثل العلاقة؟';
update questions set skill_id = (select id from skills where code = 'G8-S13') where bank = 'library' and prompt = 'في مثلث، قياس زاويتين منه 50° و 65°. ما قياس الزاوية الثالثة؟';
update questions set skill_id = (select id from skills where code = 'G8-S14') where bank = 'library' and prompt = 'مستطيل طوله 12 سم وعرضه 5 سم. ما طول قطره بالسنتيمترات؟';
update questions set skill_id = (select id from skills where code = 'G8-S14') where bank = 'library' and prompt = 'حديقة دائرية نصف قطرها 7 م. ما مساحتها تقريبًا؟ (π ≈ 22/7)';
update questions set skill_id = (select id from skills where code = 'G8-S14') where bank = 'library' and prompt = 'صندوق على شكل متوازي مستطيلات أبعاده 2 م و 3 م و 4 م. ما حجمه؟';
update questions set skill_id = (select id from skills where code = 'G8-S14') where bank = 'library' and prompt = 'كل مربع هو مستطيل.';
update questions set skill_id = (select id from skills where code = 'G8-S13') where bank = 'library' and prompt = 'زاويتان متكاملتان، قياس إحداهما ثلاثة أمثال قياس الأخرى. ما قياس الزاوية الصغرى؟';
update questions set skill_id = (select id from skills where code = 'G8-S15') where bank = 'library' and prompt = 'مثلثان متشابهان، أطوال أضلاع الأول 3 سم و 4 سم و 5 سم، وطول أقصر ضلع في الثاني 6 سم. ما طول أطول ضلع في المثلث الثاني؟';
update questions set skill_id = (select id from skills where code = 'G8-S18') where bank = 'library' and prompt = 'ما الوسيط للبيانات: 7، 3، 9، 4، 6 ؟';
update questions set skill_id = (select id from skills where code = 'G8-S18') where bank = 'library' and prompt = 'درجات خمس طالبات في اختبار: 80، 90، 70، 85، 75. ما المتوسط الحسابي للدرجات؟';
update questions set skill_id = (select id from skills where code = 'G8-S19') where bank = 'library' and prompt = 'كيس فيه 3 كرات حمراء و 5 كرات زرقاء و 2 كرتان خضراوان. سُحبت كرة عشوائيًا. ما احتمال أن تكون زرقاء؟';
update questions set skill_id = (select id from skills where code = 'G8-S19') where bank = 'library' and prompt = 'أُلقي حجر نرد منتظم 5 مرات، فظهر العدد 6 في كل مرة. ما احتمال ظهور العدد 6 في الرمية السادسة؟';
update questions set skill_id = (select id from skills where code = 'G8-S16') where bank = 'library' and prompt = 'في استطلاع شمل 200 طالبة، اختارت 35% منهن الرياضيات مادةً مفضلة. كم طالبة اختارت الرياضيات؟';
update questions set skill_id = (select id from skills where code = 'G8-S18') where bank = 'library' and prompt = 'أُضيف العدد 30 إلى البيانات: 10، 12، 14، 16. أيّ المقاييس الآتية يتغير بالمقدار الأكبر؟';
update questions set skill_id = (select id from skills where code = 'G8-S17') where bank = 'library' and prompt = 'تريد مدرسة عرض نسبة الطلاب المشاركين في كل نشاط من أنشطتها الخمسة إلى مجموع الطلاب. ما التمثيل البياني الأنسب لذلك؟';
update questions set skill_id = (select id from skills where code = 'G8-S02') where bank = 'library' and prompt = 'كانت أدنى درجة حرارة في المدينة الأولى 6°س، وفي المدينة الثانية −3°س. ما الفرق بين درجتي الحرارة بالدرجات؟';
update questions set skill_id = (select id from skills where code = 'G8-S14') where bank = 'library' and prompt = 'شكل رباعي قياسات ثلاث من زواياه: 100° و 115° و 85°. ما قياس الزاوية الرابعة بالدرجات؟';
update questions set skill_id = (select id from skills where code = 'G8-S05') where bank = 'library' and prompt = 'قُطع خيط طوله 45 سم إلى قطعتين بنسبة 4 : 5. ما طول القطعة الأقصر بالسنتيمترات؟';
update questions set skill_id = (select id from skills where code = 'G8-S19') where bank = 'library' and prompt = 'كيس فيه 24 كرة. سُحبت منه كرة عشوائيًا ثم أُعيدت، وتكرر ذلك 120 مرة، فكانت الكرة بيضاء في 70 مرة منها. ما أفضل تقدير لعدد الكرات البيضاء في الكيس؟';
update questions set skill_id = (select id from skills where code = 'G8-S10') where bank = 'library' and prompt = 'محيط المثلث أ ب ج يساوي 21 سم، وأطوال أضلاعه: 2س + 5، و س، و 3س + 1. ما قيمة س؟';
update questions set skill_id = (select id from skills where code = 'G8-S18') where bank = 'library' and prompt = 'أزمنة أربعة عدّائين في فريق تتابع: 12 و 13 و 11 و 13 ثانية. في السباق التالي حسّن عدّاءان زمنيهما بمقدار ثانيتين لكل منهما. بكم ثانية يتحسن متوسط زمن الفريق؟';

-- إزالة المهارات الحاضنة المؤقتة للمكتبة بعد نقل أسئلتها
delete from skills s where s.code like 'LIB-%' and not exists (select 1 from questions q where q.skill_id = s.id);
