import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE = 'ms_student';
const TTL_HOURS = 8;

function secret() {
  const s = process.env.STUDENT_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('STUDENT_SESSION_SECRET غير مضبوط أو قصير');
  return new TextEncoder().encode(s);
}

export interface StudentSession { sid: string; cid: string }

export async function createStudentSession(s: StudentSession) {
  const token = await new SignJWT({ cid: s.cid })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(s.sid)
    .setIssuedAt()
    .setExpirationTime(`${TTL_HOURS}h`)
    .sign(secret());
  const store = await cookies();
  store.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: TTL_HOURS * 3600 });
}

export async function getStudentSession(): Promise<StudentSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    return { sid: payload.sub, cid: String(payload.cid ?? '') };
  } catch {
    return null;
  }
}

export async function clearStudentSession() {
  const store = await cookies();
  store.delete(COOKIE);
}
