import { z } from 'zod';

/**
 * سيناريو الدرس المرئي: سلسلة مشاهد تُرسم برمجيًا (SVG + Framer Motion) داخل المتصفح.
 * هذه رسوم متحركة برمجية من قوالب، وليست فيديو مولدًا بالذكاء الاصطناعي.
 */
const base = {
  id: z.string().min(1),
  title: z.string().min(1).max(120),
  caption: z.string().max(600).default(''),          // النص الظاهر أسفل المشهد (ويُقرأ بصوت المعلم إن سُجل)
  duration: z.number().min(3).max(90).default(8),     // بالثواني إذا لم يوجد تسجيل صوتي
  audio_path: z.string().nullable().optional(),
};

export const SceneSchema = z.discriminatedUnion('template', [
  z.object({ ...base, template: z.literal('title'), data: z.object({ subtitle: z.string().max(200).default('') }) }),
  z.object({ ...base, template: z.literal('cycle'), data: z.object({ stages: z.array(z.string().min(1).max(40)).min(2).max(8) }) }),
  z.object({ ...base, template: z.literal('steps'), data: z.object({ steps: z.array(z.string().min(1).max(160)).min(1).max(8) }) }),
  z.object({ ...base, template: z.literal('number_line'), data: z.object({ start: z.number().int().min(-50).max(50), moves: z.array(z.number().int().min(-50).max(50)).min(1).max(6) }) }),
  z.object({ ...base, template: z.literal('balance'), data: z.object({ left: z.string().min(1).max(40), right: z.string().min(1).max(40), steps: z.array(z.object({ left: z.string().max(40), right: z.string().max(40), note: z.string().max(120).default('') })).max(6).default([]) }) }),
  z.object({ ...base, template: z.literal('percent_grid'), data: z.object({ percent: z.number().min(0).max(100), label: z.string().max(80).default('') }) }),
  z.object({ ...base, template: z.literal('question'), data: z.object({ prompt: z.string().min(1).max(300), options: z.array(z.string().min(1).max(80)).min(2).max(4), correct: z.number().int().min(0).max(3), explain: z.string().max(300).default('') }) }),
]);

export const ScenarioSchema = z.object({ scenes: z.array(SceneSchema).max(30) });
export type Scene = z.infer<typeof SceneSchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
export type Template = Scene['template'];

export const TEMPLATES: { key: Template; name: string; use: string }[] = [
  { key: 'title', name: 'عنوان', use: 'افتتاح الدرس أو فقرة جديدة' },
  { key: 'cycle', name: 'دورة مراحل', use: 'عملية تتكرر بمراحل متتابعة' },
  { key: 'steps', name: 'خطوات متتابعة', use: 'خطوات حل أو إجراء' },
  { key: 'number_line', name: 'خط الأعداد', use: 'جمع الأعداد الصحيحة وطرحها' },
  { key: 'balance', name: 'الميزان', use: 'حل المعادلات بالمحافظة على التوازن' },
  { key: 'percent_grid', name: 'شبكة المئة', use: 'النسبة المئوية والكسور العشرية' },
  { key: 'question', name: 'سؤال توقف', use: 'إيقاف المشهد لسؤال قصير' },
];

export function newScene(template: Template): Scene {
  const id = Math.random().toString(36).slice(2, 9);
  const common = { id, title: TEMPLATES.find((t) => t.key === template)!.name, caption: '', duration: 8, audio_path: null };
  switch (template) {
    case 'title': return { ...common, template, data: { subtitle: '' } };
    case 'cycle': return { ...common, template, data: { stages: ['المرحلة 1', 'المرحلة 2', 'المرحلة 3'] } };
    case 'steps': return { ...common, template, data: { steps: ['الخطوة 1', 'الخطوة 2'] } };
    case 'number_line': return { ...common, template, data: { start: -3, moves: [5] } };
    case 'balance': return { ...common, template, data: { left: 'س + 4', right: '9', steps: [{ left: 'س', right: '5', note: 'نطرح 4 من الطرفين' }] } };
    case 'percent_grid': return { ...common, template, data: { percent: 25, label: '' } };
    case 'question': return { ...common, template, data: { prompt: '', options: ['', ''], correct: 0, explain: '' }, duration: 20 };
  }
}

/** يجعل مخرجات الذكاء الاصطناعي آمنة: يتحقق من كل مشهد ويُسقط غير الصالح */
export function sanitizeScenario(raw: unknown): { scenario: Scenario; dropped: number } {
  const arr = (raw && typeof raw === 'object' && Array.isArray((raw as { scenes?: unknown }).scenes)) ? (raw as { scenes: unknown[] }).scenes : [];
  const scenes: Scene[] = [];
  let dropped = 0;
  for (const s of arr.slice(0, 30)) {
    const withId = s && typeof s === 'object' ? { id: Math.random().toString(36).slice(2, 9), audio_path: null, ...(s as object) } : s;
    const r = SceneSchema.safeParse(withId);
    if (r.success) scenes.push({ ...r.data, audio_path: null }); else dropped++;
  }
  return { scenario: { scenes }, dropped };
}

export function totalDuration(s: Scenario) {
  return s.scenes.reduce((a, x) => a + x.duration, 0);
}
