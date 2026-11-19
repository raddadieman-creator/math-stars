-- =====================================================================
-- التحديات: تحدي اليوم (عشرة أسئلة تتجدد يوميًا)، وتحدي السرعة (عشرة أسئلة في خمس دقائق)،
-- وتحدي الأخطاء (أسئلة سبق الخطأ فيها). أسئلتها من بنك التدريب والمكتبة كله فتتكرر الأسئلة.
-- كل تحدٍّ صف في assessments من نوع model بعلامة تبدأ بـ ch- ولا يظهر في المكتبة.
-- =====================================================================
insert into assessments (kind, form_label, title, is_open, sort_order, description) values
  ('model', 'ch-daily', 'تحدي اليوم', true, 900, 'عشرة أسئلة جديدة كل يوم'),
  ('model', 'ch-speed', 'تحدي السرعة', true, 901, 'عشرة أسئلة في خمس دقائق'),
  ('model', 'ch-mistakes', 'تحدي الأخطاء', true, 902, 'أسئلة سبق الخطأ فيها');
insert into badges (code, name_ar, kind, description, icon, tier, grp, sort_order) values
  ('ch_first', 'أول تحدٍّ', 'achievement', 'إكمال أول تحدٍّ', 'star', 'bronze', 'challenges', 30),
  ('ch_daily_7', 'تحدي الأسبوع', 'achievement', 'إكمال 7 تحديات يومية', 'flame', 'silver', 'challenges', 31),
  ('ch_speed', 'سريع ودقيق', 'achievement', '80٪ فأعلى في تحدي السرعة', 'trophy', 'gold', 'challenges', 32),
  ('ch_mistakes', 'أتعلم من أخطائي', 'achievement', 'تصحيح 10 أسئلة سبق الخطأ فيها', 'trend', 'silver', 'challenges', 33)
on conflict (code) do update set name_ar = excluded.name_ar, description = excluded.description, icon = excluded.icon, tier = excluded.tier, grp = excluded.grp, sort_order = excluded.sort_order;
