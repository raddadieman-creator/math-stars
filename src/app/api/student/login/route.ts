import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createStudentSession } from '@/lib/student-session';
import { err } from '@/lib/api';
import { isConfigured } from '@/lib/env';

const WINDOW_MIN = 15;
const MAX_FAILS_IP = 20;
const MAX_FAILS_STUDENT = 6;

/** دخول الطالبة: الفصل ثم اسمها من قائمة الفصل (بطلب المدرسة، دون رمز)، مع حد لعدد المحاولات من الجهاز الواحد */
export async function POST(req: NextRequest) {
  if (!isConfigured()) return err('المنصة غير متصلة بقاعدة البيانات', 503);
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  const body = await req.json().catch(() => ({}));
  const classId = String(body.classId ?? ''), studentId = String(body.studentId ?? '');
  if (!classId || !studentId) return err('يلزم اختيار الفصل والاسم');

  const db = supabaseAdmin();
  const since = new Date(Date.now() - WINDOW_MIN * 60000).toISOString();
  const [{ count: byIp }, { count: bySt }] = await Promise.all([
    db.from('student_login_failures').select('id', { count: 'exact', head: true }).eq('ip', ip).gte('created_at', since),
    db.from('student_login_failures').select('id', { count: 'exact', head: true }).eq('student_id', studentId).gte('created_at', since),
  ]);
  if ((byIp ?? 0) >= MAX_FAILS_IP || (bySt ?? 0) >= MAX_FAILS_STUDENT) return err('تجاوزت المحاولات الحد المسموح. يتاح الدخول بعد ربع ساعة.', 429);

  const { data: st } = await db.from('students').select('id, class_id').eq('id', studentId).eq('class_id', classId).eq('is_active', true).maybeSingle();
  if (!st) {
    await db.from('student_login_failures').insert({ ip, student_id: null });
    return err('الاسم غير موجود في هذا الفصل.', 401);
  }
  await createStudentSession({ sid: st.id, cid: st.class_id });
  return NextResponse.json({ ok: true });
}
