'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/Shell';
import { Suha } from '@/components/Suha';
import { usePrefs } from '@/components/Prefs';

/** دخول الطالب: اختيار الفصل وكتابة الاسم الثلاثي كما سجّله المعلم */
export default function StudentLogin() {
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [classId, setClassId] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { play } = usePrefs();
  useEffect(() => { fetch('/api/classes').then((r) => r.json()).then(setClasses).catch(() => {}); }, []);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg('');
    const r = await fetch('/api/student/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ classId, name }) });
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
            <option value="">اختر الفصل</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div className="text-start"><label className="label" htmlFor="nm">الاسم الثلاثي</label>
          <input id="nm" required autoComplete="off" className="field" placeholder="كما سجّله المعلم" value={name} onChange={(e) => setName(e.target.value)} /></div>
        {msg && <p className="rounded-xl bg-rose-500/15 p-3 text-sm text-rose-600" role="alert">{msg}</p>}
        <button disabled={busy} className="btn-star w-full">دخول</button>
      </form>
    </Shell>
  );
}
