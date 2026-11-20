'use client';
import { useEffect, useState } from 'react';
import { genPairs } from '@/lib/games';
import { EndScreen, useFinish } from './kit';
import { usePrefs } from '@/components/Prefs';

const C = '#7c3aed';
/** مطابقة الأشكال والأنماط: بطاقتان متكافئتان تُطابَقان معًا */
export default function Patterns() {
  const build = () => { const p = genPairs(6); return [...p.map((x) => ({ k: `l${x.id}`, pair: x.id, t: x.left })), ...p.map((x) => ({ k: `r${x.id}`, pair: x.id, t: x.right }))].sort(() => Math.random() - 0.5); };
  const [cards, setCards] = useState<ReturnType<typeof build>>([]), [sel, setSel] = useState<string | null>(null), [matched, setMatched] = useState<number[]>([]), [bad, setBad] = useState<string[]>([]), [moves, setMoves] = useState(0);
  const { res, finish, reset } = useFinish('patterns');
  const { play } = usePrefs();
  useEffect(() => setCards(build()), []);
  const done = matched.length === 6;
  const click = (k: string) => {
    const c = cards.find((x) => x.k === k)!; if (matched.includes(c.pair) || k === sel) return;
    if (!sel) { setSel(k); return; }
    const s = cards.find((x) => x.k === sel)!; setMoves((m) => m + 1);
    if (s.pair === c.pair) { play('correct'); const m = [...matched, c.pair]; setMatched(m); setSel(null); if (m.length === 6) finish(Math.max(0, 12 - Math.max(0, moves + 1 - 6))); }
    else { play('retry'); setBad([sel, k]); setTimeout(() => { setBad([]); setSel(null); }, 700); }
  };
  return (
    <div className="space-y-4">
      <p className="text-center font-bold">مطابقة كل بطاقة مع البطاقة المكافئة لها · المحاولات: {moves}</p>
      {done ? <EndScreen title="اكتملت المطابقة!" line={`في ${moves} محاولة`} correct={6} total={6} res={res} onAgain={() => { reset(); setCards(build()); setMatched([]); setMoves(0); setSel(null); }} color={C} />
        : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {cards.map((c) => {
              const m = matched.includes(c.pair), s = sel === c.k, b = bad.includes(c.k);
              return <button key={c.k} type="button" onClick={() => click(c.k)} className={`min-h-[84px] rounded-2xl border-2 p-2 text-lg font-black transition ${m ? 'border-emerald-400 bg-emerald-50 text-emerald-700 opacity-70' : b ? 'border-rose-400 bg-rose-50 game-shake' : s ? 'border-violet-500 bg-violet-100 -translate-y-1' : 'border-violet-200 bg-white hover:border-violet-400'}`}><span dir="auto">{c.t}</span></button>;
            })}
          </div>
        )}
    </div>
  );
}
