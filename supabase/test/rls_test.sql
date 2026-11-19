-- اختبار عزل البيانات: معلمة ترى طالبات فصلها فقط، والزائر لا يرى شيئًا
insert into auth.users values ('00000000-0000-0000-0000-00000000000a'),('00000000-0000-0000-0000-00000000000b'),('00000000-0000-0000-0000-00000000000c');
insert into staff values ('00000000-0000-0000-0000-00000000000a','معلمة أ','teacher'),
                         ('00000000-0000-0000-0000-00000000000b','معلمة ب','teacher'),
                         ('00000000-0000-0000-0000-00000000000c','الإدارة','admin');
insert into classes (id,name) values ('10000000-0000-0000-0000-000000000001','2/1'),('10000000-0000-0000-0000-000000000002','2/2');
insert into class_teachers values ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-00000000000a'),
                                  ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-00000000000b');
insert into students (full_name,nickname,class_id,login_code_hash) values
 ('طالبة 1','نجمة','10000000-0000-0000-0000-000000000001','h1'),
 ('طالبة 2','قمر','10000000-0000-0000-0000-000000000002','h2');

set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
select 'teacher A sees' as t, count(*) from students;          -- المتوقع 1
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
select 'admin sees' as t, count(*) from students;              -- المتوقع 2
reset role;
set role anon;
set request.jwt.claim.sub = '';
select 'anon sees' as t, count(*) from students;               -- المتوقع 0
select 'anon settings' as t, school_name, principal_name from school_settings;
select 'anon stats' as t, public_stats();
reset role;
select 'audit rows' as t, count(*) from audit_log;
