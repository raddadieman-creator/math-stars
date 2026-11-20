'use client';
import { useEffect, useRef, useState } from 'react';
import { genOp, type GQ } from '@/lib/games';
import { EndScreen, QuestionCard, useFinish } from './kit';

const C = '#16a34a', SECS = 60;
/** تحدي الوقت: أكبر عدد من العمليات في دقيقة، للمتعة فقط */
export default function Timed() {
  const [run, setRun] = useState(false), [left, setLeft] = useState(SECS), [q, setQ] = useState<GQ | null>(null), [ok, setOk] = useState(0), [n, setN] = useState(0);
  const { res, finish, reset } = useFinish('timed');
  const t = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const start = () => { reset(); setOk(0); setN(0); setLeft(SECS); setQ(genOp(2)); setRun(true); const end = Date.now() + SECS * 1000; t.current = setInterval(() => { const l = Math.max(0, Math.ceil((end - Date.now()) / 1000)); setLeft(l); if (l <= 0) { clearInterval(t.current); setRun(false); } }, 250); };
  useEffect(() => () => clearInterval(t.current), []);
  useEffect(() => { if (!run && n > 0 && left <= 0) finish(ok); }, [run]);
  return (
    <div className="space-y-4">
      <div className="h-3 overflow-hidden rounded-full bg-ink/10"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${(left / SECS) * 100}%` }} /></div>
      <div className="flex justify-between font-bold"><span>⏱️ {left} ثانية</span><span>✓ {ok} من {n}</span></div>
      {!run && n === 0 && <div className="rounded-3xl bg-emerald-50 p-6 text-center"><p className="font-bold">دقيقة واحدة لأكبر عدد من العمليات. السرعة هنا للمتعة فقط ولا تدخل في حساب الإتقان.</p><button type="button" onClick={start} className="mt-4 rounded-2xl px-8 py-3 text-lg font-black text-white" style={{ background: C }}>البدء</button></div>}
      {run && q && <QuestionCard quick tone={C} q={q} onDone={(r) => { setN((x) => x + 1); if (r) setOk((x) => x + 1); setQ(genOp(Math.random() < 0.5 ? 2 : 3)); }} />}
      {!run && n > 0 && <EndScreen title="انتهى الوقت" line={`${ok} إجابة صحيحة من ${n}`} correct={ok} total={n} res={res} onAgain={start} color={C} />}
    </div>
  );
}
