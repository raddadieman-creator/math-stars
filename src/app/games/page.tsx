import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { GAMES } from '@/lib/games';

export default function GamesHome() {
  return (
    <Shell>
      <h1 className="text-3xl font-black">الألعاب التعليمية</h1>
      <p className="mt-1 mb-6 muted">ألعاب مبنية على أسئلة كراسة الصف الثاني المتوسط، مع تصحيح فوري وخطوات الحل. تُضاف النجوم إلى رصيد الطالبة عند تسجيل الدخول.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {GAMES.map((g) => (
          <Link key={g.key} href={`/games/${g.key}`} className="group relative overflow-hidden rounded-3xl p-5 text-white shadow-md transition hover:-translate-y-1 hover:shadow-xl" style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}bb)` }}>
            <span className="absolute -left-5 -top-5 h-20 w-20 rounded-full bg-white/15 transition group-hover:scale-150" />
            <p className="relative text-4xl">{g.icon}</p>
            <p className="relative mt-2 text-lg font-extrabold">{g.name}</p>
            <p className="relative mt-1 text-sm opacity-90">{g.desc}</p>
            <span className="relative mt-3 inline-block rounded-full bg-white/25 px-3 py-1 text-sm font-bold">بدء اللعب ←</span>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
