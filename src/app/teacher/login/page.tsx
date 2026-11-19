'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Shell } from '@/components/Shell';

function Form() {
  const [staff, setStaff] = useState<{ id: string; full_name: string }[]>([]);
  const [staffId, setStaffId] = useState('');
  useEffect(() => { fetch('/api/staff-list').then((r) => r.json()).then(setStaff).catch(() => {}); }, []);
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg('');
    const r = await fetch('/api/teacher/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ staffId, password }) });
    const j = await r.json(); setBusy(false);
    if (!r.ok) setMsg(j.error ?? 'بيانات الدخول غير صحيحة.');
    else { router.push('/teacher'); router.refresh(); }
  };
  return (
    <form onSubmit={submit} className="card-3d mx-auto max-w-md space-y-4 p-8">
      <h1 className="text-2xl font-black">دخول المعلم</h1>
      {sp.get('e') === 'nostaff' && <p className="rounded-xl bg-rose-500/15 p-3 text-sm text-rose-600">هذا الحساب غير مسجل معلمًا أو إدارةً في المنصة.</p>}
      <div><label className="label" htmlFor="who">الاسم</label><select id="who" required className="field" value={staffId} onChange={(e) => setStaffId(e.target.value)}><option value="">اختر الاسم</option>{staff.map((x) => <option key={x.id} value={x.id}>{x.full_name}</option>)}</select></div>
      <div><label className="label" htmlFor="pw">كلمة المرور</label><input id="pw" dir="ltr" type="password" required className="field" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      {msg && <p className="text-rose-600" role="alert">{msg}</p>}
      <button disabled={busy} className="btn-star w-full">دخول</button>
    </form>
  );
}
export default function TeacherLogin() {
  return <Shell><Suspense><Form /></Suspense></Shell>;
}
