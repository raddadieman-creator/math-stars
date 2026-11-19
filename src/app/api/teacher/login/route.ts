import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabaseServer } from '@/lib/supabase/server';
import { err } from '@/lib/api';

/** دخول المعلم باختيار اسمه وكلمة المرور؛ يُجلب البريد في الخادم ولا يظهر في الصفحة */
export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  const db = supabaseAdmin();
  const { count } = await db.from('student_login_failures').select('id', { count: 'exact', head: true }).eq('ip', ip).gte('created_at', new Date(Date.now() - 15 * 60000).toISOString());
  if ((count ?? 0) >= 15) return err('تجاوزت المحاولات الحد المسموح. يتاح الدخول بعد ربع ساعة.', 429);
  const b = await req.json().catch(() => ({}));
  const staffId = String(b.staffId ?? ''), password = String(b.password ?? '');
  if (!staffId || !password) return err('اختر الاسم واكتب كلمة المرور');
  const { data } = await db.auth.admin.getUserById(staffId);
  const email = data.user?.email;
  if (!email) return err('بيانات الدخول غير صحيحة.', 401);
  const { error } = await (await supabaseServer()).auth.signInWithPassword({ email, password });
  if (error) { await db.from('student_login_failures').insert({ ip }); return err('كلمة المرور غير صحيحة.', 401); }
  return NextResponse.json({ ok: true });
}
