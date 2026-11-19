'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/Shell';
import { Suha } from '@/components/Suha';
import { usePrefs } from '@/components/Prefs';

export default function StudentLogin() {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { play } = usePrefs();

  const press = (d: string) => { play('tap'); setMsg(''); setCode((c) => (c.length < 6 ? c + d : c)); };
  const submit = async () => {
    setBusy(true);
    const r = await fetch('/api/student/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
    const j = await r.json();
    setBusy(false);
    if (r.ok) router.push('/student');
    else { setMsg(j.error); setCode(''); play('retry'); }
  };

  return (
    <Shell>
      <div className="mx-auto max-w-md text-center">
        <Suha size={110} mood="cheer" className="floaty mx-auto" />
        <h1 className="mt-2 text-3xl font-black">مرحبًا بكِ</h1>
        <p className="mt-1 muted">اكتبي رمز الدخول المكوّن من ستة أرقام</p>
        <div className="mt-6 flex justify-center gap-2" dir="ltr" aria-live="polite">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`flex h-14 w-11 items-center justify-center rounded-xl border text-2xl font-black ${code[i] ? 'border-star-400 bg-star-400/15' : 'border-white/15 bg-white/5'}`}>
              {code[i] ? '●' : ''}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-6 grid max-w-xs grid-cols-3 gap-3" dir="ltr">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button key={d} onClick={() => press(d)} className="card-3d h-16 text-2xl font-black hover:bg-white/10">{d}</button>
          ))}
          <button onClick={() => setCode((c) => c.slice(0, -1))} className="card-3d h-16 text-lg font-bold hover:bg-white/10" aria-label="حذف">⌫</button>
          <button onClick={() => press('0')} className="card-3d h-16 text-2xl font-black hover:bg-white/10">0</button>
          <button onClick={submit} disabled={code.length !== 6 || busy} className="btn-star h-16 rounded-3xl">دخول</button>
        </div>
        {msg && <p className="mt-4 rounded-xl bg-rose-500/15 p-3 text-rose-300" role="alert">{msg}</p>}
      </div>
    </Shell>
  );
}
