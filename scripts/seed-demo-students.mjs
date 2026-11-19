// طلاب تجريبيون (is_demo) في «فصل تجريبي» لتجربة التدريب قبل إدخال الطلاب الفعليات.
// يتطلب تشغيل supabase/demo/seed_demo.sql أولًا. الحذف: supabase/demo/purge_demo.sql
//   node --env-file=.env.local scripts/seed-demo-students.mjs
import { createClient } from '@supabase/supabase-js';
import { createHmac, randomInt } from 'node:crypto';
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const pepper = process.env.STUDENT_CODE_PEPPER;
if (!pepper || pepper.length < 16) { console.error('STUDENT_CODE_PEPPER غير مضبوط'); process.exit(1); }
for (const [i, nick] of ['مجرة', 'شهاب', 'مدار'].entries()) {
  const code = String(randomInt(0, 1e6)).padStart(6, '0');
  const { error } = await sb.from('students').insert({
    full_name: `طالب تجريبي ${i + 1}`, nickname: nick, class_id: 'd0000000-0000-0000-0000-000000000001',
    login_code_hash: createHmac('sha256', pepper).update(code).digest('hex'), is_demo: true,
  });
  console.log(error ? `خطأ: ${error.message}` : `طالب تجريبي ${i + 1}: الرمز ${code}`);
}
