'use client';
import { useEffect, useState } from 'react';
import type { GQ } from '@/lib/games';
import { EndScreen, QuestionCard, fetchQ, useFinish } from './kit';

const C = '#0284c7', COLORS = ['#0284c7', '#14b8a6', '#f59e0b', '#e8466c', '#8b5cf6', '#22c55e'];
/** بناء برج الأعداد: كل إجابة صحيحة طابق جديد، وثلاثة أخطاء توقف البناء */
export default function Tower() {
  const [qs, setQs] = useState<GQ[]>([]), [i, setI] = useState(0), [floors, setFloors] = useState(0), [miss, setMiss] = useState(0);
  const { res, finish, reset } = useFinish('tower');
  const load = () => { reset(); setI(0); setFloors(0); setMiss(0); fetchQ({ n: 25 }).then(setQs); };
  useEffect(load, []);
  const over = miss >= 3 || (qs.length > 0 && i >= qs.length);
  return (
    <div className="grid gap-5 md:grid-cols-[180px_1fr]">
      <div className="flex min-h-[260px] flex-col-reverse items-center rounded-3xl bg-gradient-to-t from-sky-100 to-white p-3">
        <div className="h-3 w-40 rounded bg-stone-400" />
        {Array.from({ length: floors }, (_, k) => <div key={k} className="game-drop mt-0.5 flex h-7 w-32 items-center justify-center rounded-md text-xs font-black text-white" style={{ background: COLORS[k % COLORS.length], width: `${128 - (k % 3) * 6}px` }}>{k + 1}</div>)}
        {floors > 0 && <span className="text-2xl">{over ? '🏁' : '🚩'}</span>}
      </div>
      <div>
        <div className="mb-3 flex justify-between font-bold"><span>الطوابق: {floors}</span><span>{'❤️'.repeat(3 - miss)}{'🤍'.repeat(miss)}</span></div>
        {over ? <EndScreen title={`برج من ${floors} ${floors === 1 ? 'طابق' : 'طوابق'}`} line={miss >= 3 ? 'توقف البناء بعد ثلاثة أخطاء' : 'اكتمل البناء'} correct={floors} total={i} res={res} onAgain={load} color={C} />
          : qs[i] && <QuestionCard tone={C} q={qs[i]} onDone={(ok) => { const f = floors + (ok ? 1 : 0), m = miss + (ok ? 0 : 1); setFloors(f); setMiss(m); setI((x) => x + 1); if (m >= 3 || i + 1 >= qs.length) finish(f); }} />}
      </div>
    </div>
  );
}
