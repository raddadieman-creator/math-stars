'use client';
import { useState } from 'react';
import { DOMAINS, type DomKey, type GQ } from '@/lib/games';
import { EndScreen, QuestionCard, fetchQ, useFinish } from './kit';

const C = '#6366f1', STATIONS = 5;
/** رحلة الفضاء والأرقام: كوكب لكل مجال، وخمس محطات تضيء بالإجابات الصحيحة */
export default function Space() {
  const [dom, setDom] = useState<DomKey | null>(null), [qs, setQs] = useState<GQ[]>([]), [i, setI] = useState(0), [lit, setLit] = useState<boolean[]>([]);
  const { res, finish, reset } = useFinish('space_numbers');
  const go = (d: DomKey) => { reset(); setDom(d); setI(0); setLit([]); fetchQ({ dom: d, n: STATIONS }).then(setQs); };
  const done = dom && qs.length > 0 && i >= qs.length;
  const score = lit.filter(Boolean).length;
  if (!dom) return (
    <div className="rounded-3xl bg-gradient-to-b from-indigo-950 to-indigo-800 p-6 text-white">
      <p className="mb-4 text-center font-bold">اختيار الكوكب</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {DOMAINS.map((d, k) => (
          <button key={d.key} type="button" onClick={() => go(d.key)} className="group flex flex-col items-center gap-2">
            <span className="grid h-24 w-24 place-items-center rounded-full text-3xl shadow-lg transition group-hover:scale-110" style={{ background: `radial-gradient(circle at 30% 30%, #fff8, ${d.color})`, animation: `game-float ${3 + k * 0.4}s ease-in-out infinite` }}>{d.icon}</span>
            <span className="font-bold">{d.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
  const D = DOMAINS.find((d) => d.key === dom)!;
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2 rounded-3xl bg-gradient-to-l from-indigo-950 to-indigo-800 p-4 text-white">
        <span className="text-3xl">🚀</span>
        {Array.from({ length: STATIONS }, (_, k) => <span key={k} className={`grid h-10 w-10 place-items-center rounded-full border-2 text-lg transition ${lit[k] ? 'border-amber-300 bg-amber-300 text-indigo-900' : lit[k] === false ? 'border-rose-300 bg-rose-400/40' : 'border-white/40'}`}>{lit[k] ? '★' : k + 1}</span>)}
        <span className="text-3xl">🪐</span>
      </div>
      {done ? <EndScreen title={`كوكب ${D.name}`} line={`أضاءت ${score} من ${STATIONS} محطات`} correct={score} total={STATIONS} res={res} onAgain={() => setDom(null)} color={C} />
        : qs[i] && <QuestionCard tone={C} q={qs[i]} onDone={(ok) => { const next = [...lit, ok]; setLit(next); setI((x) => x + 1); if (i + 1 >= qs.length) finish(next.filter(Boolean).length); }} />}
    </div>
  );
}
