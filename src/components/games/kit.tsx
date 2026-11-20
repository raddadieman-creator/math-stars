'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { dirOf, type DomKey, type GQ } from '@/lib/games';
import { usePrefs } from '@/components/Prefs';

export async function fetchQ(opts: { dom?: DomKey | 'all'; d?: number; n: number }): Promise<GQ[]> {
  const sp = new URLSearchParams({ dom: opts.dom ?? 'all', n: String(opts.n) });
  if (opts.d) sp.set('d', String(opts.d));
  const r = await fetch(`/api/games/pool?${sp}`, { cache: 'no-store' });
  return r.ok ? r.json() : [];
}

/** سؤال اختيار من متعدد مع تصحيح فوري وخطوات الحل */
export function QuestionCard({ q, onDone, quick = false, tone = '#0284c7' }: { q: GQ; onDone: (ok: boolean) => void; quick?: boolean; tone?: string }) {
  const [pick, setPick] = useState<number | null>(null);
  const { play } = usePrefs();
  useEffect(() => setPick(null), [q.id]);
  const ok = pick === q.a;
  const choose = (i: number) => {
    if (pick !== null) return;
    setPick(i); play(i === q.a ? 'correct' : 'retry');
    if (quick) setTimeout(() => onDone(i === q.a), i === q.a ? 350 : 900);
  };
  return (
    <div className="rounded-3xl border-2 bg-white p-5 shadow-sm" style={{ borderColor: `${tone}55` }}>
      <p className="text-lg font-bold leading-relaxed" dir={dirOf(q.p)}>{q.p}</p>
      {q.fig && <img src={`/booklet/${q.fig}.png`} alt="شكل السؤال" className="mx-auto mt-3 max-h-56 rounded-xl border border-ink/10" />}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {q.o.map((o, i) => {
          const st = pick === null ? 'border-ink/10 hover:border-ink/30' : i === q.a ? 'border-emerald-500 bg-emerald-50' : i === pick ? 'border-rose-500 bg-rose-50 game-shake' : 'border-ink/10 opacity-60';
          return <button key={i} type="button" onClick={() => choose(i)} className={`rounded-2xl border-2 px-4 py-3 text-start text-base font-bold transition ${st}`}><bdi dir={dirOf(o)}>{o}</bdi></button>;
        })}
      </div>
      {pick !== null && !quick && (
        <div className={`mt-4 rounded-2xl p-4 ${ok ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
          <p className="font-black">{ok ? 'إجابة صحيحة' : `الإجابة الصحيحة: ${q.o[q.a]}`}</p>
          {q.steps.length > 0 && <ul className="mt-2 list-disc space-y-1 pr-5 text-sm">{q.steps.map((s, i) => <li key={i}>{s}</li>)}</ul>}
          <button type="button" onClick={() => onDone(ok)} className="mt-3 rounded-xl px-5 py-2 font-bold text-white" style={{ background: tone }}>متابعة</button>
        </div>
      )}
    </div>
  );
}

/** إطار اللعبة وشاشة النهاية ومنح النجوم للطالبة المسجلة */
export function useFinish(game: string) {
  const [res, setRes] = useState<{ stars: number; guest?: boolean } | null>(null);
  const sent = useRef(false);
  const finish = useCallback(async (correct: number) => {
    if (sent.current) return; sent.current = true;
    try { const r = await fetch('/api/games/finish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game, correct }) }); setRes(await r.json()); } catch { setRes({ stars: 0, guest: true }); }
  }, [game]);
  const reset = () => { sent.current = false; setRes(null); };
  return { res, finish, reset };
}

export function EndScreen({ title, line, correct, total, res, onAgain, color }: { title: string; line: string; correct: number; total: number; res: { stars: number; guest?: boolean } | null; onAgain: () => void; color: string }) {
  return (
    <div className="rounded-3xl p-8 text-center text-white shadow-md game-pop" style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}>
      <p className="text-5xl">🎉</p>
      <h2 className="mt-2 text-3xl font-black">{title}</h2>
      <p className="mt-2 text-lg">{line}</p>
      <p className="mt-3 text-4xl font-black">{correct} من {total}</p>
      {res && (res.guest ? <p className="mt-3 text-sm opacity-90">النجوم تُضاف إلى رصيد الطالبة عند تسجيل الدخول.</p>
        : res.stars > 0 ? <p className="mt-3 text-xl font-black">+{res.stars} ★ أُضيفت إلى رصيدك</p> : <p className="mt-3 text-sm opacity-90">لا نجوم إضافية في هذه الجولة.</p>)}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={onAgain} className="rounded-xl bg-white px-5 py-2 font-black" style={{ color }}>جولة جديدة</button>
        <Link href="/games" className="rounded-xl bg-white/20 px-5 py-2 font-black">كل الألعاب</Link>
      </div>
    </div>
  );
}
