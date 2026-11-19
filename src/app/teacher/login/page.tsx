'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Shell } from '@/components/Shell';
import { supabaseBrowser } from '@/lib/supabase/browser';

function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg('');
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMsg('بيانات الدخول غير صحيحة.');
    else { router.push('/teacher'); router.refresh(); }
  };
  return (
    <form onSubmit={submit} className="card-3d mx-auto max-w-md space-y-4 p-8">
      <h1 className="text-2xl font-black">دخول المعلم والإدارة</h1>
      {sp.get('e') === 'nostaff' && <p className="rounded-xl bg-rose-500/15 p-3 text-sm text-rose-600">هذا الحساب غير مسجل معلمًا أو إدارةً في المنصة.</p>}
      <div><label className="label" htmlFor="em">البريد الإلكتروني</label><input id="em" dir="ltr" type="email" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div><label className="label" htmlFor="pw">كلمة المرور</label><input id="pw" dir="ltr" type="password" required className="field" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      {msg && <p className="text-rose-600" role="alert">{msg}</p>}
      <button disabled={busy} className="btn-star w-full">دخول</button>
    </form>
  );
}
export default function TeacherLogin() {
  return <Shell><Suspense><Form /></Suspense></Shell>;
}
