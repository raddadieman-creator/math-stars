'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const CARDS = [
  { href: '/review?tab=mult', title: 'جدول الضرب', sub: 'جدول تفاعلي وتحدي الدقيقة', big: '7 × 8', from: '#0284c7', to: '#38bdf8' },
  { href: '/review?tab=laws', title: 'القوانين والنظريات', sub: '34 قانونًا مع أمثلة وأسئلة تحقق', big: 'a² + b² = c²', from: '#7c3aed', to: '#a78bfa' },
  { href: '/videos', title: 'شروحات الفيديو', sub: 'منال التويجري · علي الأسمري · منصة عين', big: '▶', from: '#e11d48', to: '#fb7185' },
];

/** قسم المراجعة في الصفحة الرئيسية: بطاقات ملونة وسؤال ضرب سريع */
export function ReviewHero() {
  const [q, setQ] = useState<{ a: number; b: number; opts: number[] } | null>(null);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const next = () => {
    const a = rnd(3, 12), b = rnd(3, 12), ans = a * b;
    const set = new Set([ans]); while (set.size < 4) set.add(ans + [a, -a, b, -b, 1, -1, 10][rnd(0, 6)]);
    setQ({ a, b, opts: [...set].sort(() => Math.random() - 0.5) }); setPick(null);
  };
  useEffect(next, []);
  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-3xl font-black">المراجعة</h2>
          <p className="mt-1 muted">متاحة للجميع دون تسجيل دخول.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1.1fr]">
        {CARDS.map((c) => (
          <Link key={c.href} href={c.href} className="group relative overflow-hidden rounded-3xl p-6 text-white shadow-md transition hover:-translate-y-1 hover:shadow-xl" style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}>
            <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/15 transition group-hover:scale-125" />
            <p className="relative text-3xl font-black" dir="ltr">{c.big}</p>
            <h3 className="relative mt-3 text-xl font-extrabold">{c.title}</h3>
            <p className="relative mt-1 text-sm opacity-90">{c.sub}</p>
            <span className="relative mt-4 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-bold">فتح ←</span>
          </Link>
        ))}
        <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white p-5 text-center">
          <p className="text-sm font-bold text-amber-700">سؤال سريع · الصحيحة: {score}</p>
          {q && <p className="mt-2 text-4xl font-black" dir="ltr">{q.a} × {q.b} = ?</p>}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {q?.opts.map((o) => {
              const ok = o === q.a * q.b, chosen = pick !== null;
              return (
                <button key={o} type="button" disabled={chosen}
                  onClick={() => { setPick(o); if (ok) setScore((s) => s + 1); setTimeout(next, ok ? 700 : 1300); }}
                  className={`rounded-xl border-2 py-2 text-xl font-black transition ${chosen && ok ? 'border-emerald-500 bg-emerald-50' : chosen && pick === o ? 'border-rose-500 bg-rose-50' : 'border-ink/10 bg-white hover:border-amber-400'}`}>{o}</button>
              );
            })}
          </div>
          {pick !== null && q && <p className={`mt-2 text-sm font-bold ${pick === q.a * q.b ? 'text-emerald-600' : 'text-rose-600'}`}>{pick === q.a * q.b ? 'إجابة صحيحة' : `الإجابة: ${q.a * q.b}`}</p>}
        </div>
      </div>
    </section>
  );
}
