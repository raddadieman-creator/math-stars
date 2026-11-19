import 'server-only';
import { NextResponse } from 'next/server';
import { getStudentSession } from './student-session';
import { isConfigured } from './env';

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function withStudent<T>(fn: (sid: string) => Promise<T>) {
  if (!isConfigured()) return err('المنصة غير متصلة بقاعدة البيانات', 503);
  const s = await getStudentSession();
  if (!s) return err('انتهت الجلسة، ويلزم تسجيل الدخول مجددًا', 401);
  try {
    return NextResponse.json(await fn(s.sid));
  } catch (e) {
    return err(e instanceof Error ? e.message : 'خطأ غير متوقع', 400);
  }
}
