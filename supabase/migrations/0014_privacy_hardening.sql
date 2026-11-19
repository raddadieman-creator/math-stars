-- أسماء الطالبات حقيقية: لا تُعرض لوحة النجوم للزائرين، ولوحة التميز داخل الفصل فقط بعد الدخول.
revoke execute on function leaderboard(int) from anon, authenticated, public;
-- دوال التحقق تُستعمل داخل سياسات RLS، ولا حاجة لاستدعائها عبر الواجهة البرمجية للزائرين.
revoke execute on function log_change() from anon, authenticated, public;
alter function touch_updated_at() set search_path = public;
