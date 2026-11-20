/** توحيد كتابة الأسماء العربية للمطابقة: حذف التشكيل والتطويل، وتوحيد الألف والتاء المربوطة والياء والمسافات */
export const normName = (t: unknown) => String(t ?? '').replace(/[ً-ْـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim();

/** يطابق الاسم المكتوب مع قائمة الفصل: تطابق تام بعد التوحيد، أو تطابق الأسماء الثلاثة الأولى إذا كان فريدًا */
export function matchStudent<T extends { full_name: string }>(list: T[], typed: string): T | null {
  const n = normName(typed); if (n.split(' ').length < 2) return null;
  const exact = list.find((s) => normName(s.full_name) === n); if (exact) return exact;
  const p3 = n.split(' ').slice(0, 3).join(' ');
  const c = list.filter((s) => normName(s.full_name).split(' ').slice(0, 3).join(' ') === p3);
  return n.split(' ').length >= 3 && c.length === 1 ? c[0] : null;
}

const PARTICLES = new Set(['بن', 'بنت', 'ابن']);
/** اسم العرض في قائمة الفصل: الاسم الثلاثي دون «بن/بنت»، ويُزاد جزء عند التشابه داخل الفصل */
export function classLabels<T extends { id: string; full_name: string }>(list: T[]): { id: string; label: string }[] {
  const parts = list.map((s) => s.full_name.replace(/\s+/g, ' ').trim().split(' ').filter((w) => !PARTICLES.has(w)));
  return list.map((s, i) => {
    let n = 3;
    const key = (p: string[], k: number) => normName(p.slice(0, k).join(' '));
    while (n < parts[i].length && parts.some((p, j) => j !== i && key(p, n) === key(parts[i], n))) n++;
    return { id: s.id, label: parts[i].slice(0, n).join(' ') };
  }).sort((a, b) => a.label.localeCompare(b.label, 'ar'));
}

/** رمز دخول من أربعة أرقام */
export const newStudentCode = () => String(globalThis.crypto.getRandomValues(new Uint32Array(1))[0] % 10000).padStart(4, '0');
