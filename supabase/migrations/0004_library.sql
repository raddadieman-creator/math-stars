-- =====================================================================
-- مكتبة نماذج الاختبارات
-- النماذج اختبارات قصيرة من نوع 'model' يمكن إعادتها بلا حد، وأسئلتها في بنك منفصل (bank = 'library')
-- حتى لا تختلط بأسئلة التدريب التكيفي.
-- =====================================================================
alter type assessment_kind add value if not exists 'model';

alter table questions add column if not exists bank text not null default 'practice' check (bank in ('practice', 'library'));
alter table questions add column if not exists source_label text;   -- مصدر السؤال (مثل: TIMSS 2003 Released Items) أو «إعداد المنصة»
alter table questions add column if not exists source_url text;

alter table assessments add column if not exists domain_code text;
alter table assessments add column if not exists sort_order int not null default 0;
alter table assessments add column if not exists description text;

-- النماذج تُعاد أكثر من مرة؛ القبلي والبعدي يُضبطان بمرة واحدة في منطق التطبيق
alter table assessment_attempts drop constraint if exists assessment_attempts_assessment_id_student_id_key;
alter table assessment_attempts add column if not exists by_cognitive jsonb;
create index if not exists assessment_attempts_student on assessment_attempts (student_id, assessment_id);
