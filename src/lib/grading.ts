import type { Question } from './types';

/** تحويل الأرقام العربية-الهندية والفاصلة العربية إلى صيغة قابلة للحساب */
export function normalizeNumber(input: unknown): number | null {
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  if (typeof input !== 'string') return null;
  const map: Record<string, string> = { '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9', '٫': '.', '،': '.', '−': '-', '–': '-' };
  const s = input.trim().replace(/[٠-٩٫،−–]/g, (c) => map[c] ?? c).replace(/\s+/g, '');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  return Number(s);
}

function sameArray(a: unknown, b: unknown): boolean {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => String(x) === String(b[i]));
}

function samePairs(a: unknown, b: unknown): boolean {
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const ea = Object.entries(a as Record<string, unknown>);
  const eb = b as Record<string, unknown>;
  return ea.length === Object.keys(eb).length && ea.every(([k, v]) => String(eb[k]) === String(v));
}

export function isCorrect(q: Pick<Question, 'qtype' | 'correct_answer'>, answer: unknown): boolean {
  const expected = q.correct_answer?.value;
  switch (q.qtype) {
    case 'numeric': {
      const a = normalizeNumber(answer);
      const e = normalizeNumber(expected);
      return a !== null && e !== null && Math.abs(a - e) < 1e-9;
    }
    case 'true_false':
      return answer === expected || String(answer) === String(expected);
    case 'mcq':
    case 'image_mcq':
      return String(answer) === String(expected);
    case 'ordering':
      return sameArray(answer, expected);
    case 'matching':
    case 'drag_drop':
      return samePairs(answer, expected);
    default:
      return false;
  }
}

/** تصنيف الخطأ بمطابقته مع الأخطاء الشائعة المسجلة في السؤال */
export function classifyError(q: Pick<Question, 'qtype' | 'common_errors'>, answer: unknown): string {
  for (const ce of q.common_errors ?? []) {
    if (q.qtype === 'numeric') {
      const a = normalizeNumber(answer);
      const e = normalizeNumber(ce.answer);
      if (a !== null && e !== null && a === e) return ce.error_type;
    } else if (String(ce.answer) === String(answer)) {
      return ce.error_type;
    }
  }
  return 'غير مصنف';
}
