-- =====================================================================
-- ملفات المكتبة (يرفعها المعلم أو روابط لمصادر رسمية) + نموذج مقتبس من أسئلة TIMSS الرسمية
-- =====================================================================
create table if not exists library_files (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  publisher text,                 -- الجهة المصدرة
  language text not null default 'ar',
  storage_path text,              -- ملف مرفوع إلى حاوية content
  external_url text,              -- أو رابط لمصدر رسمي
  is_official boolean not null default false,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  created_by uuid references staff(id),
  created_at timestamptz not null default now(),
  check (storage_path is not null or external_url is not null)
);
alter table library_files enable row level security;
create policy library_files_staff on library_files for all using (is_staff()) with check (is_staff());
create trigger audit_library_files after insert or update or delete on library_files for each row execute function log_change();

alter table questions add column if not exists international_pct int check (international_pct between 0 and 100); -- نسبة الإجابة الصحيحة دوليًا إن وُجدت
alter table assessments add column if not exists source_label text;
alter table assessments add column if not exists source_url text;

insert into library_files (title, publisher, language, external_url, is_official, sort_order) values ('أسئلة TIMSS 2011 المنشورة — رياضيات الصف الثامن', 'NCES', 'en', 'https://nces.ed.gov/timss/pdf/TIMSS2011_G8_Math.pdf', true, 1);
insert into library_files (title, publisher, language, external_url, is_official, sort_order) values ('أسئلة TIMSS 2003 المنشورة — رياضيات الصف الثامن', 'NCES', 'en', 'https://nces.ed.gov/timss/pdf/TIMSS2003_G8_Math.pdf', true, 2);
insert into library_files (title, publisher, language, external_url, is_official, sort_order) values ('أسئلة TIMSS 1999 المنشورة — رياضيات الصف الثامن', 'NCES', 'en', 'https://nces.ed.gov/timss/pdf/TIMSS1999_G8_Math.pdf', true, 3);
insert into library_files (title, publisher, language, external_url, is_official, sort_order) values ('مجموعة TIMSS 2003 المنشورة — الصف الثامن', 'IEA / TIMSS & PIRLS International Study Center', 'en', 'https://pirls.bc.edu/PDF/T03_RELEASED_M8.pdf', true, 4);
insert into library_files (title, publisher, language, external_url, is_official, sort_order) values ('أسئلة TIMSS مختارة للصف الثامن مع ملاحظات تعليمية (2026)', 'IEA Research for Educators, Vol. 4', 'en', 'https://www.iea.nl/sites/default/files/2026-09/Volume%204_Classroom%20Materials_Grades%206-10.pdf', true, 5);
insert into skills (domain_id, topic_id, code, name_ar, sort_order)
select t.domain_id, t.id, 'LIB-IEA', 'أسئلة TIMSS المقتبسة', 101 from topic_areas t where t.code = 'integers'
on conflict (code) do nothing;
insert into assessments (kind, form_label, title, is_open, sort_order, source_label, source_url) values ('model', 'iea', 'نموذج من أسئلة TIMSS الرسمية', true, 0, 'مقتبس بتصرف ومترجم من: Golding, J., & Marks, R. (2026). Teaching and Learning Mathematics with Meaning. IEA Research for Educators, Vol. 4. Springer — ترخيص CC BY-NC 4.0', 'https://www.iea.nl/sites/default/files/2026-09/Volume%204_Classroom%20Materials_Grades%206-10.pdf');
with s as (select id from skills where code = 'LIB-IEA'), a as (select id from assessments where kind = 'model' and form_label = 'iea'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url, international_pct)
  select s.id, 'knowing', 2, 'numeric', 'كانت أدنى درجة حرارة في المدينة الأولى 6°س، وفي المدينة الثانية −3°س. ما الفرق بين درجتي الحرارة بالدرجات؟', '[]'::jsonb, '{"value": 9}'::jsonb, '["الفرق = 6 − (−3)", "= 6 + 3 = 9 درجات"]'::jsonb, 'published', 'library', 'مقتبس بتصرف ومترجم من: Golding, J., & Marks, R. (2026). Teaching and Learning Mathematics with Meaning. IEA Research for Educators, Vol. 4. Springer — ترخيص CC BY-NC 4.0', 'https://www.iea.nl/sites/default/files/2026-09/Volume%204_Classroom%20Materials_Grades%206-10.pdf', 59
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 1 from a, qi;
with s as (select id from skills where code = 'LIB-IEA'), a as (select id from assessments where kind = 'model' and form_label = 'iea'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url, international_pct)
  select s.id, 'applying', 2, 'numeric', 'شكل رباعي قياسات ثلاث من زواياه: 100° و 115° و 85°. ما قياس الزاوية الرابعة بالدرجات؟', '[]'::jsonb, '{"value": 60}'::jsonb, '["مجموع زوايا الشكل الرباعي 360°", "100 + 115 + 85 = 300", "360 − 300 = 60°"]'::jsonb, 'published', 'library', 'مقتبس بتصرف ومترجم من: Golding, J., & Marks, R. (2026). Teaching and Learning Mathematics with Meaning. IEA Research for Educators, Vol. 4. Springer — ترخيص CC BY-NC 4.0', 'https://www.iea.nl/sites/default/files/2026-09/Volume%204_Classroom%20Materials_Grades%206-10.pdf', 56
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 2 from a, qi;
with s as (select id from skills where code = 'LIB-IEA'), a as (select id from assessments where kind = 'model' and form_label = 'iea'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url, international_pct)
  select s.id, 'applying', 2, 'mcq', 'قُطع خيط طوله 45 سم إلى قطعتين بنسبة 4 : 5. ما طول القطعة الأقصر بالسنتيمترات؟', '[{"id": "a", "text": "5"}, {"id": "b", "text": "20"}, {"id": "c", "text": "25"}, {"id": "d", "text": "36"}]'::jsonb, '{"value": "b"}'::jsonb, '["عدد الأجزاء = 4 + 5 = 9", "طول الجزء الواحد = 45 ÷ 9 = 5 سم", "القطعة الأقصر = 4 × 5 = 20 سم"]'::jsonb, 'published', 'library', 'مقتبس بتصرف ومترجم من: Golding, J., & Marks, R. (2026). Teaching and Learning Mathematics with Meaning. IEA Research for Educators, Vol. 4. Springer — ترخيص CC BY-NC 4.0', 'https://www.iea.nl/sites/default/files/2026-09/Volume%204_Classroom%20Materials_Grades%206-10.pdf', 54
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 3 from a, qi;
with s as (select id from skills where code = 'LIB-IEA'), a as (select id from assessments where kind = 'model' and form_label = 'iea'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url, international_pct)
  select s.id, 'applying', 2, 'mcq', 'كيس فيه 24 كرة. سُحبت منه كرة عشوائيًا ثم أُعيدت، وتكرر ذلك 120 مرة، فكانت الكرة بيضاء في 70 مرة منها. ما أفضل تقدير لعدد الكرات البيضاء في الكيس؟', '[{"id": "a", "text": "7"}, {"id": "b", "text": "10"}, {"id": "c", "text": "12"}, {"id": "d", "text": "14"}]'::jsonb, '{"value": "d"}'::jsonb, '["نسبة السحب الأبيض = 70 ÷ 120 = 7/12", "التقدير = 7/12 × 24 = 14 كرة"]'::jsonb, 'published', 'library', 'مقتبس بتصرف ومترجم من: Golding, J., & Marks, R. (2026). Teaching and Learning Mathematics with Meaning. IEA Research for Educators, Vol. 4. Springer — ترخيص CC BY-NC 4.0', 'https://www.iea.nl/sites/default/files/2026-09/Volume%204_Classroom%20Materials_Grades%206-10.pdf', 43
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 4 from a, qi;
with s as (select id from skills where code = 'LIB-IEA'), a as (select id from assessments where kind = 'model' and form_label = 'iea'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url, international_pct)
  select s.id, 'applying', 2, 'numeric', 'محيط المثلث أ ب ج يساوي 21 سم، وأطوال أضلاعه: 2س + 5، و س، و 3س + 1. ما قيمة س؟', '[]'::jsonb, '{"value": 2.5}'::jsonb, '["(2س + 5) + س + (3س + 1) = 21", "6س + 6 = 21", "6س = 15، إذن س = 2.5"]'::jsonb, 'published', 'library', 'مقتبس بتصرف ومترجم من: Golding, J., & Marks, R. (2026). Teaching and Learning Mathematics with Meaning. IEA Research for Educators, Vol. 4. Springer — ترخيص CC BY-NC 4.0', 'https://www.iea.nl/sites/default/files/2026-09/Volume%204_Classroom%20Materials_Grades%206-10.pdf', 26
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 5 from a, qi;
with s as (select id from skills where code = 'LIB-IEA'), a as (select id from assessments where kind = 'model' and form_label = 'iea'),
qi as (insert into questions (skill_id, cognitive, difficulty, qtype, prompt, options, correct_answer, solution_steps, status, bank, source_label, source_url, international_pct)
  select s.id, 'applying', 2, 'mcq', 'أزمنة أربعة عدّائين في فريق تتابع: 12 و 13 و 11 و 13 ثانية. في السباق التالي حسّن عدّاءان زمنيهما بمقدار ثانيتين لكل منهما. بكم ثانية يتحسن متوسط زمن الفريق؟', '[{"id": "a", "text": "0"}, {"id": "b", "text": "1"}, {"id": "c", "text": "2"}, {"id": "d", "text": "4"}]'::jsonb, '{"value": "b"}'::jsonb, '["مجموع التحسن = 2 + 2 = 4 ثوانٍ", "يتوزع على 4 عدّائين: 4 ÷ 4 = 1 ثانية"]'::jsonb, 'published', 'library', 'مقتبس بتصرف ومترجم من: Golding, J., & Marks, R. (2026). Teaching and Learning Mathematics with Meaning. IEA Research for Educators, Vol. 4. Springer — ترخيص CC BY-NC 4.0', 'https://www.iea.nl/sites/default/files/2026-09/Volume%204_Classroom%20Materials_Grades%206-10.pdf', 36
  from s returning id)
insert into assessment_items (assessment_id, question_id, position) select a.id, qi.id, 6 from a, qi;
