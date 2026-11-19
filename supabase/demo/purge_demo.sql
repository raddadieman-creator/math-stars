-- حذف كل البيانات التجريبية قبل التشغيل الفعلي
begin;
delete from item_outcomes where student_id in (select id from students where is_demo);
delete from attempts where student_id in (select id from students where is_demo);
delete from students where is_demo;            -- يحذف بالتتابع الجلسات والنجوم والأوسمة والإتقان
delete from item_outcomes where question_id in (select id from questions where is_demo);
delete from attempts where question_id in (select id from questions where is_demo);
delete from assessment_items where question_id in (select id from questions where is_demo);
delete from questions where is_demo;
delete from lessons where is_demo;
delete from skill_mastery where skill_id in (select id from skills where is_demo);
delete from practice_sessions where skill_id in (select id from skills where is_demo);
delete from skills where is_demo;
delete from class_teachers where class_id in (select id from classes where is_demo);
delete from classes where is_demo;
commit;
