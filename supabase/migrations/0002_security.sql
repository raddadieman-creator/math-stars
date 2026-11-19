-- =====================================================================
-- الصلاحيات على مستوى قاعدة البيانات (RLS) + سجل التعديلات + الدوال العامة
-- مبدأ التصميم:
--  * المعلمة والإدارة تدخلان عبر Supabase Auth، وتخضعان لسياسات RLS أدناه.
--  * الطالبة لا تملك حسابًا في Auth؛ يتحقق الخادم من رمزها ثم يكتب نيابة عنها
--    بمفتاح الخدمة (service role) المحفوظ على الخادم فقط، ومقيدًا بمعرّفها.
--  * الزائر (anon) لا يرى أي بيانات فردية؛ يرى فقط مؤشرات إجمالية وأسماء مستعارة.
-- =====================================================================

create or replace function current_staff_role() returns staff_role
language sql stable security definer set search_path = public as $$
  select role from staff where id = auth.uid()
$$;

create or replace function is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff where id = auth.uid())
$$;

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff where id = auth.uid() and role = 'admin')
$$;

create or replace function can_see_class(cid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select is_admin() or exists (
    select 1 from class_teachers where class_id = cid and teacher_id = auth.uid())
$$;

create or replace function can_see_student(sid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select is_admin() or exists (
    select 1 from students s join class_teachers ct on ct.class_id = s.class_id
    where s.id = sid and ct.teacher_id = auth.uid())
$$;

-- تفعيل RLS على كل الجداول
do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- إعدادات المدرسة: عامة للقراءة، والتعديل للمعلمات والإدارة
create policy settings_read on school_settings for select using (true);
create policy settings_write on school_settings for update using (is_staff()) with check (is_staff());

create policy adaptive_read on adaptive_rules for select using (is_staff());
create policy adaptive_write on adaptive_rules for update using (is_staff()) with check (is_staff());
create policy reward_read on reward_rules for select using (is_staff());
create policy reward_write on reward_rules for update using (is_staff()) with check (is_staff());

-- الكادر
create policy staff_read on staff for select using (id = auth.uid() or is_staff());
create policy staff_admin on staff for all using (is_admin()) with check (is_admin());

-- الفصول
create policy classes_read on classes for select using (can_see_class(id));
create policy classes_admin on classes for all using (is_admin()) with check (is_admin());
create policy ct_read on class_teachers for select using (is_staff());
create policy ct_admin on class_teachers for all using (is_admin()) with check (is_admin());

-- الطالبات: كل معلمة ترى طالبات فصولها فقط
create policy students_read on students for select using (can_see_student(id));
create policy students_insert on students for insert with check (can_see_class(class_id));
create policy students_update on students for update using (can_see_student(id)) with check (can_see_class(class_id));
create policy students_delete on students for delete using (can_see_student(id));

-- إطار TIMSS: مرجع عام
create policy domains_read on content_domains for select using (true);
create policy topics_read on topic_areas for select using (true);
create policy skills_read on skills for select using (true);
create policy domains_write on content_domains for all using (is_admin()) with check (is_admin());
create policy topics_write on topic_areas for all using (is_admin()) with check (is_admin());
create policy skills_write on skills for all using (is_staff()) with check (is_staff());

-- بنك الأسئلة: للمعلمات فقط (الطالبة تتسلم السؤال من الخادم دون الإجابة الصحيحة)
create policy questions_staff on questions for all using (is_staff()) with check (is_staff());

-- بيانات الأداء: قراءة للمعلمة المسؤولة فقط، والكتابة من الخادم
create policy sessions_read on practice_sessions for select using (can_see_student(student_id));
create policy attempts_read on attempts for select using (can_see_student(student_id));
create policy outcomes_read on item_outcomes for select using (can_see_student(student_id));
create policy mastery_read on skill_mastery for select using (can_see_student(student_id));
create policy sbadges_read on student_badges for select using (can_see_student(student_id));
create policy stars_read on star_ledger for select using (can_see_student(student_id));
create policy aatt_read on assessment_attempts for select using (can_see_student(student_id));
create policy aresp_read on assessment_responses for select using (
  exists (select 1 from assessment_attempts a where a.id = attempt_id and can_see_student(a.student_id)));

create policy badges_read on badges for select using (is_staff());
create policy badges_write on badges for all using (is_staff()) with check (is_staff());
create policy assess_staff on assessments for all using (is_staff()) with check (is_staff());
create policy aitems_staff on assessment_items for all using (is_staff()) with check (is_staff());
create policy lessons_staff on lessons for all using (is_staff()) with check (is_staff());
create policy audit_read on audit_log for select using (is_admin());
-- student_login_failures: بلا سياسات = لا وصول إلا من الخادم

-- ---------- سجل التعديلات ----------
create or replace function log_change() returns trigger
language plpgsql security definer set search_path = public as $$
declare rid text;
begin
  rid := coalesce((to_jsonb(coalesce(new, old)) ->> 'id'), '');
  insert into audit_log (actor_id, action, table_name, row_id, details)
  values (auth.uid(), tg_op, tg_table_name, rid,
          case when tg_op = 'DELETE' then to_jsonb(old) - 'login_code_hash'
               else to_jsonb(new) - 'login_code_hash' end);
  return coalesce(new, old);
end $$;

do $$
declare t text;
begin
  foreach t in array array['school_settings','adaptive_rules','reward_rules','staff','classes',
                           'class_teachers','students','questions','assessments','lessons','badges'] loop
    execute format('create trigger audit_%1$s after insert or update or delete on %1$I
                    for each row execute function log_change()', t);
  end loop;
end $$;

create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
create trigger t_questions_touch before update on questions for each row execute function touch_updated_at();
create trigger t_lessons_touch before update on lessons for each row execute function touch_updated_at();

-- ---------- دوال عامة آمنة للصفحة الرئيسية ----------
-- مؤشرات إجمالية فقط، بلا أي بيانات شخصية
create or replace function public_stats() returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'participants', (select count(distinct student_id) from practice_sessions ps
                      join students s on s.id = ps.student_id where not s.is_demo),
    'answered_items', (select count(*) from item_outcomes o
                      join students s on s.id = o.student_id where not s.is_demo),
    'mastered_skills', (select count(*) from skill_mastery m
                      join students s on s.id = m.student_id where m.status = 'mastered' and not s.is_demo),
    'published_questions', (select count(*) from questions where status = 'published'),
    'published_lessons', (select count(*) from lessons where status = 'published')
  )
$$;

-- لوحة التميز: اسم مستعار + رمز + مجموع النجوم
create or replace function leaderboard(lim int default 10)
returns table (nickname text, avatar text, stars bigint)
language sql stable security definer set search_path = public as $$
  select s.nickname, s.avatar, coalesce(sum(l.amount), 0) as stars
  from students s join star_ledger l on l.student_id = s.id
  where s.is_active and not s.is_demo
  group by s.id, s.nickname, s.avatar
  order by stars desc
  limit least(greatest(lim, 1), 20)
$$;

revoke all on function public_stats() from public;
revoke all on function leaderboard(int) from public;
grant execute on function public_stats() to anon, authenticated;
grant execute on function leaderboard(int) to anon, authenticated;

-- ---------- التخزين ----------
-- حاوية خاصة لصفحات الكتاب والتسجيلات الصوتية وصور الأسئلة.
-- (تُنشأ في Supabase فقط؛ يتجاوزها الاختبار المحلي إن لم يوجد مخطط storage)
do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'storage') then
    insert into storage.buckets (id, name, public) values ('content', 'content', false)
      on conflict (id) do nothing;
    execute $p$create policy content_staff_rw on storage.objects for all
      using (bucket_id = 'content' and public.is_staff())
      with check (bucket_id = 'content' and public.is_staff())$p$;
    insert into storage.buckets (id, name, public) values ('branding', 'branding', true)
      on conflict (id) do nothing;
    execute $p$create policy branding_staff_write on storage.objects for insert
      with check (bucket_id = 'branding' and public.is_staff())$p$;
  end if;
end $$;
