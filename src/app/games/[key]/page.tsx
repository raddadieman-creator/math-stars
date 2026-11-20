import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Shell } from '@/components/Shell';
import { GAMES } from '@/lib/games';
import { GamePlayer } from '@/components/games/GamePlayer';

export default async function GamePage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const g = GAMES.find((x) => x.key === key);
  if (!g) notFound();
  return (
    <Shell>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-black">{g.icon} {g.name}</h1><p className="mt-1 muted">{g.desc}</p></div>
        <Link href="/games" className="chip px-4 py-2 font-bold">كل الألعاب</Link>
      </div>
      <div className="mx-auto max-w-3xl"><GamePlayer k={g.key} /></div>
    </Shell>
  );
}
