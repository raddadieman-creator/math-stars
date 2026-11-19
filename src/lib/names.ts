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
