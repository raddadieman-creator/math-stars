'use client';
import { useEffect, useState } from 'react';
import { dirOf, genOp, type GQ } from '@/lib/games';
import { EndScreen, useFinish } from './kit';
import { usePrefs } from '@/components/Prefs';

const C = '#0d9488', STEPS = 8;
/** متاهة العمليات: عند كل تفرع أبواب بإجابات، والباب الصحيح يفتح الطريق */
export default function Maze() {
  const make = () => Array.from({ length: STEPS }, () => genOp(2));
  const [qs, setQs] = useState<GQ[]>([]), [step, setStep] = useState(0), [wrong, setWrong] = useState<number | null>(null), [mistakes, setMistakes] = useState(0);
  const { res, finish, reset } = useFinish('maze');
  const { play } = usePrefs();
  useEffect(() => setQs(make()), []);
  const done = qs.length > 0 && step >= STEPS;
  const q = qs[step];
  const again = () => { reset(); setQs(make()); setStep(0); setWrong(null); setMistakes(0); };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-8 gap-1 rounded-3xl bg-teal-900 p-3">
        {Array.from({ length: STEPS }, (_, k) => <div key={k} className={`grid h-12 place-items-center rounded-lg text-xl ${k < step ? 'bg-teal-400' : k === step ? 'bg-amber-300 game-pulse' : 'bg-teal-800'}`}>{k === step && !done ? '🧭' : k < step ? '✓' : ''}</div>)}
      </div>
      {done ? <EndScreen title="الخروج من المتاهة!" line={mistakes ? `بـ ${mistakes} ${mistakes === 1 ? 'باب خاطئ' : 'أبواب خاطئة'}` : 'دون أي باب خاطئ'} correct={STEPS - Math.min(STEPS, mistakes)} total={STEPS} res={res} onAgain={again} color={C} />
        : q && (
          <div className="rounded-3xl border-2 border-teal-200 bg-white p-5 text-center">
            <p className="text-sm font-bold text-teal-700">التفرع {step + 1} من {STEPS}</p>
            <p className="mt-2 text-3xl font-black" dir={dirOf(q.p)}>{q.p}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {q.o.map((o, i) => (
                <button key={i} type="button" disabled={wrong === i}
                  onClick={() => { if (i === q.a) { play('correct'); setWrong(null); const s = step + 1; setStep(s); if (s >= STEPS) finish(STEPS - Math.min(STEPS, mistakes)); } else { play('retry'); setWrong(i); setMistakes((m) => m + 1); } }}
                  className={`flex flex-col items-center rounded-t-[2rem] border-4 px-2 pb-3 pt-5 text-xl font-black transition ${wrong === i ? 'border-rose-300 bg-rose-50 text-rose-400 game-shake' : 'border-teal-600 bg-teal-50 hover:-translate-y-1'}`}>
                  <span className="text-2xl">{wrong === i ? '🧱' : '🚪'}</span><span dir="ltr">{o}</span>
                </button>
              ))}
            </div>
            {wrong !== null && <p className="mt-3 text-sm font-bold text-rose-600">طريق مسدود. {q.steps[0]}</p>}
          </div>
        )}
    </div>
  );
}
