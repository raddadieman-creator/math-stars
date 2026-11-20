'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/Shell';
import { Suha } from '@/components/Suha';
import { usePrefs } from '@/components/Prefs';

/** دخول الطالب: اختيار الفصل، ثم الاسم من قائمة الفصل */
export default function StudentLogin() {
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [classId, setClassId] = useState('');
  const [names, setNames] = useState<{ id: string; label: string }[]>([]);
  const [studentId, setStudentId] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { play } = usePrefs();
  useEffect(() => { fetch('/api/classes').then((r) => r.json()).then(setClasses).catch(() => {}); }, []);
  useEffect(() => {
    setNames([]); setStudentId('');
    if (classId) fetch(`/api/classes/${classId}/students`).then((r) => r.json()).then(setNames).catch(() => {});
  }, [classId]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg('');
    const r = await fetch('/api/student/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ classId, studentId }) });
    const j = await r.json(); setBusy(false);
    if (r.ok) { play('correct'); router.push('/student'); router.refresh(); } else { play('retry'); setMsg(j.error ?? 'تعذر الدخول'); }
  };
  return (
    <Shell>
      <form onSubmit={submit} className="card-3d mx-auto max-w-md space-y-4 p-8 text-center">
        <div className="mx-auto w-fit"><Suha size={100} named /></div>
        <h1 className="text-2xl font-black">دخول الطالب</h1>
        <div className="text-start"><label className="label" htmlFor="cls">الفصل</label>
          <select id="cls" required className="field" value={classId} onChange={(e) => setClassId(e.target.value)}>
            <option value="">اختيار الفصل</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div className="text-start"><label className="label" htmlFor="nm">الاسم</label>
          <select id="nm" required disabled={!classId} className="field" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            <option value="">{classId ? 'اختيار الاسم' : 'يُختار الفصل أولًا'}</option>{names.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}</select></div>
        {msg && <p className="rounded-xl bg-rose-500/15 p-3 text-sm text-rose-600" role="alert">{msg}</p>}
        <button disabled={busy} className="btn-star w-full">دخول</button>
      </form>
    </Shell>
  );
}
