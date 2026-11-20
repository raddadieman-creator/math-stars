'use client';
import { useEffect, useState } from 'react';
import { Suha } from '@/components/Suha';
import { daysAr } from './StreakCard';

/** «مَدى» يحيّي الطالبة ويشجعها بحسب سلسلة التدريب */
export function MadaGreeting({ first, current, today }: { first: string; current: number; today: boolean }) {
  const lines = current === 0
    ? [`أهلًا ${first}، أنا مَدى، مساعدك في الرياضيات.`, 'كل يوم تدريب يضيف شعلة جديدة إلى سلسلتك، والبداية اليوم.']
    : today
      ? [`إنجاز رائع يا ${first}!`, `سلسلتك ${daysAr(current)} متتالية، وشعلة اليوم مضيئة. 🔥`]
      : [`مرحبًا ${first}، اشتقنا إليك!`, `سلسلتك ${daysAr(current)}، وتدريب اليوم يرفعها إلى ${daysAr(current + 1)}.`];
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % lines.length), 4500); return () => clearInterval(t); }, [lines.length]);
  return (
    <div className="flex items-end gap-3">
      <div className="mada-hop"><Suha size={86} mood={today ? 'correct' : 'idle'} /></div>
      <div className="relative max-w-sm rounded-2xl rounded-br-sm border border-sky-200 bg-white px-4 py-3 shadow-sm">
        <p key={i} className="mada-say font-bold leading-relaxed">{lines[i]}</p>
      </div>
    </div>
  );
}
