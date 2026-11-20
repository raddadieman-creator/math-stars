'use client';
import { useEffect, useState } from 'react';
import type { GQ } from '@/lib/games';
import { EndScreen, QuestionCard, fetchQ, useFinish } from './kit';

const LEN = 10, C = '#f59e0b';
/** سباق النجوم: سيارتك تتقدم مع كل إجابة صحيحة، ومنافس آلي يتقدم مع كل سؤال */
export default function StarRace() {
  const [qs, setQs] = useState<GQ[]>([]), [i, setI] = useState(0), [me, setMe] = useState(0), [bot, setBot] = useState(0);
  const { res, finish, reset } = useFinish('star_race');
  const load = () => { reset(); setI(0); setMe(0); setBot(0); fetchQ({ n: LEN }).then(setQs); };
  useEffect(load, []);
  const done = qs.length > 0 && i >= qs.length;
  useEffect(() => { if (done) finish(me); }, [done]);
  const lane = (pos: number, icon: string, label: string, color: string) => (
    <div className="relative h-14 rounded-2xl bg-white/70">
      <div className="absolute inset-y-0 left-3 flex items-center text-2xl">🏁</div>
      <div className="absolute top-1/2 -translate-y-1/2 text-3xl transition-all duration-700" style={{ right: `calc(${(pos / LEN) * 88}% + 4px)` }}>{icon}</div>
      <span className="absolute right-3 top-1 text-[11px] font-black" style={{ color }}>{label}</span>
    </div>
  );
  return (
    <div className="space-y-5">
      <div className="space-y-2 rounded-3xl p-4" style={{ background: 'repeating-linear-gradient(90deg,#fde68a 0 40px,#fcd34d 40px 80px)' }}>
        {lane(me, '🏎️', 'أنت', '#b45309')}{lane(bot, '🚙', 'المنافس', '#475569')}
      </div>
      {done ? <EndScreen title={me > bot ? 'فوز في السباق!' : me === bot ? 'تعادل' : 'سباق قوي'} line={`وصلت إلى ${me} من ${LEN} محطات`} correct={me} total={LEN} res={res} onAgain={load} color={C} />
        : qs[i] && <QuestionCard tone={C} q={qs[i]} onDone={(ok) => { if (ok) setMe((x) => x + 1); if (Math.random() < 0.6) setBot((x) => x + 1); setI((x) => x + 1); }} />}
      {!done && <p className="text-center text-sm muted">السؤال {Math.min(i + 1, LEN)} من {LEN}</p>}
    </div>
  );
}
