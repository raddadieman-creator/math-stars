'use client';
import { useActionState, useState } from 'react';
import { saveQuestion } from '@/app/teacher/(panel)/questions/actions';
import { COGNITIVE_AR, QTYPE_AR, type QType } from '@/lib/types';
import type { QuestionFormInput } from '@/lib/question-form';
import standards from '@/lib/standards.json';

type Initial = Record<string, any> & { form: QuestionFormInput };

const OPTION_HELP: Record<QType, string> = {
  mcq: 'خيار في كل سطر. الخيار الأول = أ، الثاني = ب ...',
  image_mcq: 'خيار في كل سطر، مع رابط الصورة في حقل الوسائط.',
  true_false: 'لا حاجة إلى خيارات.',
  numeric: 'لا حاجة إلى خيارات.',
  ordering: 'العناصر بالترتيب الصحيح، وتُعرض للطالب مخلوطة.',
  matching: 'كل زوج في سطر: العنصر = ما يطابقه',
  drag_drop: 'كل زوج في سطر: العنصر = موضعه الصحيح',
};

export function QuestionEditor({ skills, initial }: { skills: { id: string; code: string; name_ar: string }[]; initial?: Initial }) {
  const [state, action, pending] = useActionState(saveQuestion, {});
  const [qtype, setQtype] = useState<QType>((initial?.qtype as QType) ?? 'mcq');
  const [cog, setCog] = useState<string>(initial?.cognitive ?? 'knowing');
  const f = initial?.form;
  return (
    <form action={action} className="space-y-5">
      <h1 className="text-3xl font-black">{initial ? 'مراجعة السؤال وتعديله' : 'سؤال جديد'}</h1>
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <div className="panel grid gap-4 md:grid-cols-3">
        <div><label className="label">المهارة</label><select name="skill_id" required defaultValue={initial?.skill_id} className="field">{skills.map((s) => <option key={s.id} value={s.id}>{s.code} — {s.name_ar}</option>)}</select></div>
        <div><label className="label">العملية المعرفية</label><select name="cognitive" value={cog} onChange={(e) => setCog(e.target.value)} className="field">{Object.entries(COGNITIVE_AR).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div><label className="label">مستوى الصعوبة</label><select name="difficulty" defaultValue={initial?.difficulty ?? 1} className="field"><option value="1">1 — أساسي</option><option value="2">2 — متوسط</option><option value="3">3 — متقدم</option></select></div>
        <div><label className="label">نوع السؤال</label><select name="qtype" value={qtype} onChange={(e) => setQtype(e.target.value as QType)} className="field">{Object.entries(QTYPE_AR).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div><label className="label">المهارة الفرعية</label><select name="cognitive_skill" defaultValue={initial?.cognitive_skill ?? ''} className="field"><option value="">—</option>{(standards.cognitive as Record<string, string[]>)[cog]?.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="label">الهدف التعليمي</label><input name="objective" defaultValue={initial?.objective ?? ''} className="field" /></div>
      </div>
      <div className="panel space-y-4">
        <div><label className="label">نص السؤال</label><textarea name="prompt" required rows={3} defaultValue={initial?.prompt} className="field" /></div>
        <div><label className="label">رابط صورة (اختياري)</label><input name="media_url" dir="ltr" defaultValue={initial?.media_url ?? ''} className="field" /></div>
        {!['true_false', 'numeric'].includes(qtype) && (
          <div><label className="label">الخيارات</label><p className="mb-1 text-xs muted">{OPTION_HELP[qtype]}</p><textarea name="options" rows={5} defaultValue={f?.optionsText} className="field" dir="auto" /></div>
        )}
        {['mcq', 'image_mcq'].includes(qtype) && <div><label className="label">الخيار الصحيح</label><select name="correct" defaultValue={f?.correct ?? 'أ'} className="field max-w-[160px]">{['أ', 'ب', 'ج', 'د', 'هـ', 'و'].map((l) => <option key={l}>{l}</option>)}</select></div>}
        {qtype === 'true_false' && <div><label className="label">الإجابة الصحيحة</label><select name="correct" defaultValue={f?.correct ?? 'true'} className="field max-w-[160px]"><option value="true">صواب</option><option value="false">خطأ</option></select></div>}
        {qtype === 'numeric' && <div><label className="label">الإجابة الصحيحة (عدد)</label><input name="correct" dir="ltr" defaultValue={f?.correct} className="field max-w-[200px]" /></div>}
      </div>
      <div className="panel grid gap-4 md:grid-cols-2">
        <div><label className="label">التلميح (يظهر بعد أول خطأ)</label><textarea name="hint" rows={2} defaultValue={initial?.hint ?? ''} className="field" /></div>
        <div><label className="label">تفسير الحل</label><textarea name="explanation" rows={2} defaultValue={initial?.explanation ?? ''} className="field" /></div>
        <div><label className="label">خطوات الحل (خطوة في كل سطر)</label><textarea name="steps" rows={4} defaultValue={f?.stepsText} className="field" /></div>
        <div><label className="label">الأخطاء الشائعة</label><p className="mb-1 text-xs muted">سطر لكل خطأ: الإجابة الخاطئة | نوع الخطأ | ملاحظة</p><textarea name="errors" rows={4} defaultValue={f?.errorsText} className="field" /></div>
        <div className="md:col-span-2"><label className="label">النشاط العلاجي المناسب</label><input name="remedial" defaultValue={initial?.remedial_activity ?? ''} className="field" /></div>
      </div>
      <div className="panel flex flex-wrap items-end justify-between gap-3">
        <div><label className="label">الحالة</label><select name="status" defaultValue={initial?.status ?? 'draft'} className="field"><option value="draft">مسودة</option><option value="review">قيد المراجعة</option><option value="published">منشور (يظهر للطلاب)</option></select></div>
        {state?.error && <p className="text-rose-600" role="alert">{state.error}</p>}
        <button disabled={pending} className="btn-star">حفظ</button>
      </div>
    </form>
  );
}
