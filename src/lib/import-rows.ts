import { buildQuestionPayload } from './question-form';
import type { Cognitive, QType } from './types';

/** أعمدة ملف الاستيراد (Excel أو CSV) بالترتيب */
export const IMPORT_COLUMNS = ['السؤال', 'النوع', 'الخيارات', 'الإجابة', 'العملية المعرفية', 'الصعوبة', 'التلميح', 'خطوات الحل', 'المصدر'] as const;
export const IMPORT_EXAMPLE = [
  ['ما ناتج: (−8) + 3 ؟', 'اختيار من متعدد', '−11|−5|5|11', 'ب', 'معرفة', '1', 'نطرح القيمتين المطلقتين', '8 − 3 = 5|الإشارة سالبة', 'إعداد المعلم'],
  ['إذا كان 3س = 21 فما قيمة س؟', 'عددي', '', '7', 'تطبيق', '1', '', 'نقسم الطرفين على 3|س = 7', ''],
  ['كل مستطيل مربع.', 'صواب وخطأ', '', 'خطأ', 'استدلال', '2', '', 'المستطيل لا يشترط تساوي أضلاعه', ''],
];

/** محلل CSV يدعم الحقول المحاطة بعلامات اقتباس والفواصل والأسطر داخلها */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', q = false;
  const t = text.replace(/^﻿/, '');
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"' && t[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',' || c === '\t' || c === '؛') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && t[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((x) => x.trim() !== '')) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== '')) rows.push(row);
  return rows;
}

const TYPE: Record<string, QType> = {
  'اختيار من متعدد': 'mcq', 'اختيار': 'mcq', mcq: 'mcq',
  'عددي': 'numeric', 'إجابة عددية': 'numeric', numeric: 'numeric',
  'صواب وخطأ': 'true_false', 'صح وخطأ': 'true_false', true_false: 'true_false',
};
const COG: Record<string, Cognitive> = {
  'معرفة': 'knowing', 'المعرفة': 'knowing', knowing: 'knowing',
  'تطبيق': 'applying', 'التطبيق': 'applying', applying: 'applying',
  'استدلال': 'reasoning', 'الاستدلال': 'reasoning', reasoning: 'reasoning',
};
const LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];

export interface ImportedQuestion {
  line: number;
  prompt: string;
  qtype: QType;
  cognitive: Cognitive;
  difficulty: 1 | 2 | 3;
  hint: string | null;
  source_label: string | null;
  payload: ReturnType<typeof buildQuestionPayload>;
}

/** يحوّل صفوف الجدول إلى أسئلة صالحة، ويعيد أخطاء كل سطر لعرضها قبل الحفظ */
export function rowsToQuestions(rows: string[][]) {
  const ok: ImportedQuestion[] = [];
  const errors: { line: number; message: string }[] = [];
  const start = rows.length && String(rows[0][0] ?? '').trim() === IMPORT_COLUMNS[0] ? 1 : 0;
  rows.slice(start).forEach((r, idx) => {
    const line = idx + start + 1;
    const [prompt, type, options, answer, cog, diff, hint, steps, source] = r.map((c) => String(c ?? '').trim());
    try {
      if (!prompt) throw new Error('نص السؤال فارغ');
      const qtype = TYPE[type];
      if (!qtype) throw new Error(`نوع غير معروف: «${type}»`);
      const opts = (options ?? '').split('|').map((x) => x.trim()).filter(Boolean);
      let correct = answer ?? '';
      if (qtype === 'mcq') {
        if (!LETTERS.includes(correct)) {
          const k = opts.indexOf(correct);
          if (k < 0) throw new Error('الإجابة يجب أن تكون حرف الخيار (أ، ب، ...) أو نص أحد الخيارات');
          correct = LETTERS[k];
        }
      } else if (qtype === 'true_false') {
        correct = ['صواب', 'صح', 'true'].includes(correct) ? 'true' : ['خطأ', 'false'].includes(correct) ? 'false' : '';
      }
      const payload = buildQuestionPayload({ qtype, optionsText: opts.join('\n'), correct, stepsText: (steps ?? '').split('|').join('\n'), errorsText: '' });
      const d = Number(diff || 2);
      ok.push({
        line, prompt, qtype, cognitive: COG[cog] ?? 'applying', difficulty: (d >= 1 && d <= 3 ? d : 2) as 1 | 2 | 3,
        hint: hint || null, source_label: source || null, payload,
      });
    } catch (e) {
      errors.push({ line, message: (e as Error).message });
    }
  });
  return { ok, errors };
}
