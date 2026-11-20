'use client';
import { useState, useTransition } from 'react';
import { addStudent, deleteStudent, toggleStudent } from '@/app/teacher/(panel)/actions';

export function AddStudentForm({ classes }: { classes: { id: string; name: string }[] }) {
  const [res, setRes] = useState<{ ok?: boolean; code?: string; error?: string; name?: string } | null>(null);
  const [pending, start] = useTransition();
  return (
    <form className="panel grid gap-3 md:grid-cols-4" action={(f) => start(async () => { const r = await addStudent(f); setRes({ ...r, name: String(f.get('full_name')) }); })}>
      <h2 className="text-lg font-extrabold md:col-span-4">إضافة طالبة</h2>
      <div><label className="label">الاسم الثلاثي أو الكامل</label><input name="full_name" required className="field" /></div>
      <div><label className="label">اسم مختصر للوحة التميز</label><input name="nickname" className="field" placeholder="اختياري: الاسم الأول واسم الأب" /></div>
      <div><label className="label">الفصل</label><select name="class_id" required className="field">{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <div className="flex items-end"><button disabled={pending} className="btn-aqua w-full">إضافة</button></div>
      {res?.ok && <p className="rounded-xl bg-teal-50 p-3 md:col-span-4">أُضيفت {res.name}. تدخل باختيار فصلها ثم اسمها من القائمة.</p>}
      {res?.error && <p className="text-rose-600 md:col-span-4">{res.error}</p>}
    </form>
  );
}

export function StudentRowActions({ id, active, name }: { id: string; active: boolean; name?: string }) {
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-2">
      <a href={`/teacher/students/${id}`} className="chip">التقرير</a>
      <button disabled={pending} className="chip" onClick={() => start(() => toggleStudent(id, !active))}>{active ? 'إيقاف' : 'تفعيل'}</button>
      <button disabled={pending} className="chip text-rose-600" onClick={() => { if (confirm(`حذف ${name ?? 'الطالبة'} وجميع سجلاتها نهائيًا؟`)) start(async () => { const r = await deleteStudent(id); if (r.error) setErr(r.error); }); }}>حذف</button>
      {err && <span className="text-rose-600">{err}</span>}
    </span>
  );
}
