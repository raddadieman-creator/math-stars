import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { hashLoginCode, isValidCodeFormat } from '@/lib/codes';
import { createStudentSession } from '@/lib/student-session';
import { err } from '@/lib/api';
import { isConfigured } from '@/lib/env';

const WINDOW_MIN = 15;
const MAX_FAILS = 10;

export async function POST(req: NextRequest) {
  if (!isConfigured()) return err('المنصة غير متصلة بقاعدة البيانات', 503);
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  const db = supabaseAdmin();
  const since = new Date(Date.now() - WINDOW_MIN * 60000).toISOString();
  const { count } = await db.from('student_login_failures').select('id', { count: 'exact', head: true }).eq('ip', ip).gte('created_at', since);
  if ((count ?? 0) >= MAX_FAILS) return err('محاولات كثيرة. انتظري قليلًا ثم حاولي مرة أخرى، أو اطلبي المساعدة من معلمتك.', 429);

  const body = await req.json().catch(() => ({}));
  const code = String(body.code ?? '');
  if (!isValidCodeFormat(code)) return err('الرمز يتكون من ستة أرقام');
  const { data: st } = await db.from('students').select('id, class_id, is_active').eq('login_code_hash', hashLoginCode(code, process.env.STUDENT_CODE_PEPPER ?? '')).maybeSingle();
  if (!st || !st.is_active) {
    await db.from('student_login_failures').insert({ ip });
    return err('الرمز غير صحيح. تأكدي منه مع معلمتك.', 401);
  }
  await createStudentSession({ sid: st.id, cid: st.class_id });
  return NextResponse.json({ ok: true });
}
