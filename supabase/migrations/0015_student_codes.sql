-- دخول الطالبة: اختيار الفصل ثم اسمها من قائمة الفصل ثم رمزها الشخصي (4 أرقام).
-- الرمز يراه معلم الفصل والإدارة فقط (سياسة students القائمة)، ولا يصل إلى الواجهة العامة.
alter table students add column if not exists login_code text check (login_code ~ '^[0-9]{4}$');
update students set login_code = lpad((floor(random() * 10000))::int::text, 4, '0') where login_code is null;
alter table student_login_failures add column if not exists student_id uuid;
create index if not exists student_login_failures_student on student_login_failures (student_id, created_at);
