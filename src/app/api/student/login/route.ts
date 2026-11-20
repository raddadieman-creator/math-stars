import { NextResponse, type NextRequest } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createStudentSession } from '@/lib/student-session';
import { err } from '@/lib/api';
import { isConfigured } from '@/lib/env';

const WINDOW_MIN = 15;
const MAX_FAILS_IP = 20;
const MAX_FAILS_STUDENT = 6;

/** دخول الطالبة: الفصل ثم اسمها من القائمة ثم رمزها الشخصي، مع حد لمحاولات الخطأ لكل جهاز ولكل طالبة */
export async function POST(req: NextRequest) {
  if (!isConfigured()) return err('المنصة غير متصلة بقاعدة البيانات', 503);
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  const body = await req.json().catch(() => ({}));
  const classId = String(body.classId ?? ''), studentId = String(body.studentId ?? ''), code = String(body.code ?? '').trim();
  if (!classId || !studentId || !/^[0-9]{4}$/.test(code)) return err('يلزم اختيار الفصل والاسم وكتابة الرمز المكوّن من أربعة أرقام');

  const db = supabaseAdmin();
  const since = new Date(Date.now() - WINDOW_MIN * 60000).toISOString();
  const [{ count: byIp }, { count: bySt }] = await Promise.all([
    db.from('student_login_failures').select('id', { count: 'exact', head: true }).eq('ip', ip).gte('created_at', since),
    db.from('student_login_failures').select('id', { count: 'exact', head: true }).eq('student_id', studentId).gte('created_at', since),
  ]);
  if ((byIp ?? 0) >= MAX_FAILS_IP || (bySt ?? 0) >= MAX_FAILS_STUDENT) return err('تجاوزت المحاولات الحد المسموح. يتاح الدخول بعد ربع ساعة.', 429);

  const { data: st } = await db.from('students').select('id, class_id, login_code').eq('id', studentId).eq('class_id', classId).eq('is_active', true).maybeSingle();
  const ok = !!st?.login_code && timingSafeEqual(Buffer.from(st.login_code), Buffer.from(code));
  if (!st || !ok) {
    await db.from('student_login_failures').insert({ ip, student_id: st ? st.id : null });
    return err('الرمز غير صحيح. الرمز لدى معلمة الفصل.', 401);
  }
  await createStudentSession({ sid: st.id, cid: st.class_id });
  return NextResponse.json({ ok: true });
}
