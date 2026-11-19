-- =====================================================================
-- بيانات مرجعية حقيقية (ليست تجريبية)
-- 1) مجالات TIMSS 2027 للرياضيات — الصف الثامن (يقابل الثاني المتوسط)
--    المصدر: TIMSS 2027 Assessment Frameworks, IEA / TIMSS & PIRLS International Study Center
--    https://timss2027.org/frameworks
-- 2) بيانات المدرسة كما زودتنا بها صاحبة المشروع
-- =====================================================================
insert into content_domains (code, name_ar, name_en, target_percent, sort_order) values
  ('number', 'الأعداد', 'Number', 30, 1),
  ('algebra', 'الجبر', 'Algebra', 30, 2),
  ('geometry_measurement', 'الهندسة والقياس', 'Geometry and Measurement', 20, 3),
  ('data_probability', 'البيانات والاحتمالات', 'Data and Probability', 20, 4);

insert into topic_areas (domain_id, code, name_ar, name_en, target_percent, sort_order)
select d.id, t.code, t.name_ar, t.name_en, t.pct, t.ord
from (values
  ('number', 'integers', 'الأعداد الصحيحة', 'Integers', 10, 1),
  ('number', 'fractions_decimals', 'الكسور والأعداد العشرية', 'Fractions and decimals', 10, 2),
  ('number', 'ratio_percent', 'التناسب والنسبة والنسبة المئوية', 'Proportions, ratios, and percentages', 10, 3),
  ('algebra', 'expressions_equations', 'العبارات والعمليات والمعادلات', 'Expressions, operations, and equations', 20, 1),
  ('algebra', 'relations_functions', 'العلاقات والدوال', 'Relationships and functions', 10, 2),
  ('geometry_measurement', 'geometry_measurement', 'الهندسة والقياس', 'Geometry and Measurement', 20, 1),
  ('data_probability', 'data', 'البيانات', 'Data', 15, 1),
  ('data_probability', 'probability', 'الاحتمالات', 'Probability', 5, 2)
) as t(domain, code, name_ar, name_en, pct, ord)
join content_domains d on d.code = t.domain;

update school_settings set
  school_name = 'المتوسطة السابعة والخمسون',
  principal_name = 'ريم الجهني',
  teacher_names = array['صالحة الأسمري', 'أمل القرني'],
  program_weeks = 20,
  vision = 'تحقيق تعليم شامل للجميع يعزز القيم ويربطنا في مدار المنافسة العالمية، وتمكين للأفراد والمجتمعات من اكتساب مهارات ذات جودة عالية.',
  mission = 'تقديم تعليم عالي جودة شاملة لكوادر مؤهلة، معززة للقيم، ملتزمة بالمجتمع ضمن بيئة آمنة ومحفزة للإبداع، تسهم في بناء مجتمع ودؤسنبافنيين في صناعة وطن رائد عالميا.'
where id = 1;

insert into badges (code, name_ar, kind, description, icon) values
  ('skill_master', 'وسام إتقان المهارة', 'mastery', 'يُمنح عند بلوغ معيار الإتقان في مهارة', 'medal'),
  ('persistence_3', 'شارة المواظبة', 'persistence', 'التدرب في ثلاثة أيام مختلفة خلال أسبوع', 'flame'),
  ('comeback', 'شارة المثابرة', 'persistence', 'حل سؤال بعد محاولة خاطئة دون كشف الحل', 'mountain'),
  ('personal_best', 'مكافأة التحسن الشخصي', 'improvement', 'تجاوز نسبة إجابتها الأولى السابقة في المهارة نفسها', 'trend'),
  ('first_session', 'الانطلاقة', 'achievement', 'إكمال أول جلسة تدريب', 'rocket');
