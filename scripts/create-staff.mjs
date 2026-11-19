// إنشاء حساب معلمة أو إدارة (يُشغَّل مرة لكل حساب من جهاز الإدارة)
// الاستخدام:
//   node --env-file=.env.local scripts/create-staff.mjs --email t1@school.sa --name "صالحة الأسمري" --role teacher
//   node --env-file=.env.local scripts/create-staff.mjs --email admin@school.sa --name "الإدارة" --role admin
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1]]] : a), []));
const { email, name, role = 'teacher' } = args;
if (!email || !name || !['teacher', 'admin'].includes(role)) {
  console.error('الاستخدام: --email البريد --name "الاسم" --role teacher|admin');
  process.exit(1);
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('اضبطي NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
const sb = createClient(url, key, { auth: { persistSession: false } });
const password = args.password ?? randomBytes(9).toString('base64url');
const { data, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true });
if (error) { console.error('تعذر إنشاء المستخدم:', error.message); process.exit(1); }
const { error: e2 } = await sb.from('staff').insert({ id: data.user.id, full_name: name, role });
if (e2) { console.error('أُنشئ المستخدم لكن تعذر تسجيله في staff:', e2.message); process.exit(1); }
console.log(`تم إنشاء الحساب: ${email} (${role})`);
console.log(`كلمة المرور المؤقتة: ${password}  — سلّميها لصاحبة الحساب بطريقة آمنة واطلبي تغييرها.`);
