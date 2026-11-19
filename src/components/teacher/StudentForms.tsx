'use client';
import { useState, useTransition } from 'react';
import { addStudent, resetCode, toggleStudent } from '@/app/teacher/(panel)/actions';

export function AddStudentForm({ classes }: { classes: { id: string; name: string }[] }) {
  const [res, setRes] = useState<{ code?: string; error?: string; name?: string } | null>(null);
  const [pending, start] = useTransition();
  return (
    <form className="panel grid gap-3 md:grid-cols-4" action={(f) => start(async () => { const r = await addStudent(f); setRes({ ...r, name: String(f.get('full_name')) }); })}>
      <h2 className="text-lg font-extrabold md:col-span-4">إضافة طالبة</h2>
      <div><label className="label">الاسم</label><input name="full_name" required className="field" /></div>
      <div><label className="label">اسم مستعار للوحة التميز</label><input name="nickname" className="field" placeholder="اختياري" /></div>
      <div><label className="label">الفصل</label><select name="class_id" required className="field">{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <div className="flex items-end"><button disabled={pending} className="btn-aqua w-full">إضافة وتوليد رمز</button></div>
      {res?.code && <p className="rounded-xl bg-star-400/15 p-3 md:col-span-4">رمز دخول {res.name}: <b dir="ltr" className="text-2xl tracking-widest text-star-600">{res.code}</b> — انسخيه الآن، فلن يظهر مرة أخرى.</p>}
      {res?.error && <p className="text-rose-600 md:col-span-4">{res.error}</p>}
    </form>
  );
}

export function StudentRowActions({ id, active }: { id: string; active: boolean }) {
  const [code, setCode] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-2">
      <a href={`/teacher/students/${id}`} className="chip">التقرير</a>
      <button disabled={pending} className="chip" onClick={() => { if (confirm('توليد رمز جديد يلغي الرمز الحالي. متابعة؟')) start(async () => setCode((await resetCode(id)).code ?? null)); }}>رمز جديد</button>
      <button disabled={pending} className="chip" onClick={() => start(() => toggleStudent(id, !active))}>{active ? 'إيقاف' : 'تفعيل'}</button>
      {code && <b dir="ltr" className="text-star-600">{code}</b>}
    </span>
  );
}
