import type { QType } from './types';

/** تحويل حقول النموذج المبسطة إلى بنية السؤال المخزنة (وعكسها) — منطق نقي قابل للاختبار */
export interface QuestionFormInput {
  qtype: QType;
  optionsText: string;     // خيار في كل سطر؛ للمطابقة: "يسار = يمين"
  correct: string;         // حرف الخيار (أ/ب/..) أو true/false أو رقم
  stepsText: string;
  errorsText: string;      // "الإجابة | نوع الخطأ | ملاحظة"
}

const LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];
export const optionLetter = (i: number) => LETTERS[i] ?? String(i + 1);

const linesOf = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);

export function buildQuestionPayload(f: QuestionFormInput) {
  const lines = linesOf(f.optionsText);
  let options: { id: string; text: string }[] = [];
  let correct: unknown;
  switch (f.qtype) {
    case 'mcq':
    case 'image_mcq': {
      options = lines.map((text, i) => ({ id: String.fromCharCode(97 + i), text }));
      const idx = LETTERS.indexOf(f.correct.trim());
      if (idx < 0 || idx >= options.length) throw new Error('حددي الخيار الصحيح بحرف من الخيارات المكتوبة');
      correct = options[idx].id;
      if (options.length < 2) throw new Error('أدخلي خيارين على الأقل');
      break;
    }
    case 'true_false':
      if (!['true', 'false'].includes(f.correct)) throw new Error('حددي صواب أو خطأ');
      correct = f.correct === 'true';
      break;
    case 'numeric': {
      const n = Number(f.correct.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace('−', '-'));
      if (!Number.isFinite(n) || f.correct.trim() === '') throw new Error('الإجابة العددية غير صحيحة');
      correct = n;
      break;
    }
    case 'ordering':
      if (lines.length < 2) throw new Error('أدخلي عنصرين على الأقل بالترتيب الصحيح');
      options = lines.map((text, i) => ({ id: `o${i + 1}`, text }));
      correct = options.map((o) => o.id);
      break;
    case 'matching':
    case 'drag_drop': {
      const pairs = lines.map((l) => l.split('=').map((x) => x.trim()));
      if (pairs.length < 2 || pairs.some((p) => p.length !== 2 || !p[0] || !p[1])) throw new Error('اكتبي كل زوج في سطر بصيغة: العنصر = ما يطابقه');
      const left = pairs.map((p, i) => ({ id: `l${i + 1}`, text: p[0] }));
      const right = pairs.map((p, i) => ({ id: `r:${i + 1}`, text: p[1] }));
      options = [...left, ...right];
      correct = Object.fromEntries(left.map((l, i) => [l.id, right[i].id]));
      break;
    }
  }
  const common_errors = linesOf(f.errorsText).map((l) => {
    const [answer, error_type, note] = l.split('|').map((x) => x.trim());
    return { answer, error_type: error_type || 'غير مصنف', note: note || undefined };
  });
  return { options, correct_answer: { value: correct }, solution_steps: linesOf(f.stepsText), common_errors };
}

/** لاستعادة الحقول عند التعديل */
export function toFormInput(q: { qtype: QType; options: { id: string; text: string }[]; correct_answer: { value: unknown }; solution_steps: string[]; common_errors: { answer: unknown; error_type: string; note?: string }[] }): QuestionFormInput {
  let optionsText = '';
  let correct = '';
  if (q.qtype === 'matching' || q.qtype === 'drag_drop') {
    const map = q.correct_answer.value as Record<string, string>;
    optionsText = q.options.filter((o) => !o.id.startsWith('r:')).map((l) => `${l.text} = ${q.options.find((o) => o.id === map[l.id])?.text ?? ''}`).join('\n');
  } else if (q.qtype === 'ordering') {
    const order = q.correct_answer.value as string[];
    optionsText = order.map((id) => q.options.find((o) => o.id === id)?.text ?? '').join('\n');
  } else {
    optionsText = q.options.map((o) => o.text).join('\n');
    if (q.qtype === 'mcq' || q.qtype === 'image_mcq') correct = optionLetter(q.options.findIndex((o) => o.id === q.correct_answer.value));
    else correct = String(q.correct_answer.value);
  }
  return {
    qtype: q.qtype, optionsText, correct,
    stepsText: (q.solution_steps ?? []).join('\n'),
    errorsText: (q.common_errors ?? []).map((e) => [e.answer, e.error_type, e.note].filter((x) => x !== undefined && x !== '').join(' | ')).join('\n'),
  };
}
