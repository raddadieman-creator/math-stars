'use client';
import { useState } from 'react';
import { DOMAINS, type GQ } from '@/lib/games';
import { EndScreen, QuestionCard, fetchQ, useFinish } from './kit';

const C = '#e11d48', ROUNDS = 6;
const SLOTS = DOMAINS.flatMap((d) => [1, 3].map((lv) => ({ dom: d.key, name: d.name, lv, color: d.color })));
/** عجلة التحديات: تدور العجلة فتحدد المجال والمستوى */
export default function Wheel() {
  const [angle, setAngle] = useState(0), [spinning, setSpinning] = useState(false), [q, setQ] = useState<GQ | null>(null), [slot, setSlot] = useState<(typeof SLOTS)[number] | null>(null);
  const [round, setRound] = useState(0), [score, setScore] = useState(0);
  const { res, finish, reset } = useFinish('wheel');
  const seg = 360 / SLOTS.length;
  const spin = () => {
    if (spinning) return;
    const k = Math.floor(Math.random() * SLOTS.length);
    const target = angle + 360 * 4 + (360 - (k * seg + seg / 2)) - (angle % 360);
    setSpinning(true); setAngle(target); setQ(null);
    setTimeout(async () => { setSlot(SLOTS[k]); const [x] = await fetchQ({ dom: SLOTS[k].dom, d: SLOTS[k].lv, n: 1 }); setQ(x ?? null); setSpinning(false); }, 2600);
  };
  const done = round >= ROUNDS;
  const grad = SLOTS.map((s, i) => `${s.color}${i % 2 ? 'cc' : ''} ${i * seg}deg ${(i + 1) * seg}deg`).join(',');
  return (
    <div className="space-y-5">
      {done ? <EndScreen title="انتهت جولات العجلة" line={`${score} إجابات صحيحة في ${ROUNDS} جولات`} correct={score} total={ROUNDS} res={res} onAgain={() => { reset(); setRound(0); setScore(0); setQ(null); setSlot(null); }} color={C} />
        : (<>
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 text-3xl">🔻</span>
              <div className="relative h-64 w-64 rounded-full border-8 border-white shadow-xl" style={{ background: `conic-gradient(${grad})`, transform: `rotate(${angle}deg)`, transition: 'transform 2.5s cubic-bezier(.17,.67,.2,1)' }}>
                {SLOTS.map((s, i) => <span key={i} className="absolute left-1/2 top-1/2 w-24 origin-left text-[10px] font-black text-white" style={{ transform: `rotate(${i * seg + seg / 2 - 90}deg) translateX(18px)` }}>{s.name.split(' ')[0]} {s.lv === 1 ? '★' : '★★★'}</span>)}
              </div>
            </div>
            <button type="button" onClick={spin} disabled={spinning || !!q} className="rounded-2xl px-8 py-3 text-lg font-black text-white shadow-md disabled:opacity-50" style={{ background: C }}>{spinning ? 'تدور…' : 'تدوير العجلة'}</button>
            <p className="text-sm muted">الجولة {round + 1} من {ROUNDS} · الصحيحة: {score}</p>
          </div>
          {q && slot && <><p className="text-center font-bold">{slot.name} · {slot.lv === 1 ? 'مستوى سهل' : 'مستوى صعب'}</p>
            <QuestionCard tone={C} q={q} onDone={(ok) => { const s = score + (ok ? 1 : 0); setScore(s); setQ(null); const r = round + 1; setRound(r); if (r >= ROUNDS) finish(s); }} /></>}
        </>)}
    </div>
  );
}
