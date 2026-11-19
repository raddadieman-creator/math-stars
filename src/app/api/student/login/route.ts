import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createStudentSession } from '@/lib/student-session';
import { err } from '@/lib/api';
import { isConfigured } from '@/lib/env';
import { matchStudent } from '@/lib/names';

const WINDOW_MIN = 15;
const MAX_FAILS = 15;

/** دخول الطالب باسمه الثلاثي وفصله (كما سجّله المعلم)، مع حد لمحاولات الخطأ من الجهاز نفسه */
export async function POST(req: NextRequest) {
  if (!isConfigured()) return err('المنصة غير متصلة بقاعدة البيانات', 503);
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  const db = supabaseAdmin();
  const since = new Date(Date.now() - WINDOW_MIN * 60000).toISOString();
  const { count } = await db.from('student_login_failures').select('id', { count: 'exact', head: true }).eq('ip', ip).gte('created_at', since);
  if ((count ?? 0) >= MAX_FAILS) return err('تجاوزت المحاولات الحد المسموح. يتاح الدخول بعد ربع ساعة.', 429);

  const body = await req.json().catch(() => ({}));
  const classId = String(body.classId ?? ''), name = String(body.name ?? '');
  if (!classId || !name.trim()) return err('اختر الفصل واكتب الاسم الثلاثي');
  const { data: list } = await db.from('students').select('id, class_id, full_name').eq('class_id', classId).eq('is_active', true);
  const st = matchStudent(list ?? [], name);
  if (!st) {
    await db.from('student_login_failures').insert({ ip });
    return err('لم نجد هذا الاسم في الفصل المختار. اكتب الاسم الثلاثي كما سجّله المعلم.', 401);
  }
  await createStudentSession({ sid: st.id, cid: st.class_id });
  return NextResponse.json({ ok: true });
}
