import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Shell } from '@/components/Shell';
import { Explainer } from '@/components/student/Explainer';
import { requireStudent } from '@/lib/student-data';
import { hasCustomScene } from '@/lib/explainer';
import booklet from '@/lib/booklet-items.json';

export const dynamic = 'force-dynamic';
const DOM: Record<string, string> = { num: 'الأعداد', alg: 'الجبر', geo: 'الهندسة والقياس', data: 'البيانات والاحتمالات' };
type B = { sheet: string; p: string; o: string[]; a: number; steps: string[]; fig?: string; cog: string };

export default async function Explain({ params, searchParams }: { params: Promise<{ sheet: string }>; searchParams: Promise<{ q?: string }> }) {
  await requireStudent();
  const { sheet } = await params; const sp = await searchParams;
  const items = (booklet as B[]).filter((x) => x.sheet === sheet);
  if (!items.length) notFound();
  const idx = Math.min(Math.max(0, Number(sp.q ?? 0) || 0), items.length - 1);
  const [, dom, n] = sheet.split('-');
  const sheets = [...new Set((booklet as B[]).map((x) => x.sheet))];
  return (
    <Shell right={<Link href="/student/library" className="chip hover:bg-ink/5">المكتبة</Link>}>
      <p className="text-sm muted">الشرح المتحرك · كراسة تدريبات المعلمات</p>
      <h1 className="text-2xl font-black">{DOM[dom]} · تدريب {n} · السؤال {idx + 1}</h1>
      <div className="mt-4"><Explainer key={`${sheet}-${idx}`} item={items[idx]} /></div>
      <h2 className="mt-6 font-extrabold">أسئلة التدريب</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((it, k) => (
          <Link key={k} href={`/student/explain/${sheet}?q=${k}`} className={`chip px-3 py-2 text-sm ${k === idx ? 'bg-ink text-white' : ''}`}>
            {k + 1}{hasCustomScene(it.fig) ? ' ✦' : it.fig ? ' ◧' : ''}
          </Link>
        ))}
      </div>
      <p className="mt-2 text-xs muted">✦ مشهد أُعيد رسمه وتحريكه · ◧ مع شكل الكراسة</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {sheets.map((s) => { const [, d, k] = s.split('-'); return <Link key={s} href={`/student/explain/${s}`} className={`chip px-3 py-1.5 text-xs ${s === sheet ? 'bg-star-400' : ''}`}>{DOM[d]} {k}</Link>; })}
      </div>
    </Shell>
  );
}
