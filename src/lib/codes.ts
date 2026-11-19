import { createHmac, randomInt } from 'crypto';

/** رمز دخول من 6 أرقام (سهل الإدخال على الجهاز اللوحي) */
export function generateLoginCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

/** بصمة الرمز: HMAC-SHA256 بمفتاح سري لا يغادر الخادم */
export function hashLoginCode(code: string, pepper: string): string {
  if (!pepper || pepper.length < 16) throw new Error('STUDENT_CODE_PEPPER غير مضبوط أو قصير');
  return createHmac('sha256', pepper).update(code.trim()).digest('hex');
}

export function isValidCodeFormat(code: string): boolean {
  return /^\d{6}$/.test(code.trim());
}
