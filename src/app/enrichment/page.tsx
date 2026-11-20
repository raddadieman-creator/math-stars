import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { REFS } from '@/lib/enrichment';

export default function Enrichment() {
  return (
    <Shell>
      <h1 className="text-3xl font-black">مراجع إثرائية</h1>
      <p className="mt-1 mb-6 muted">مواقع رسمية ومنصات وأدوات تفيد في التدريب على رياضيات الصف الثاني المتوسط واختبارات TIMSS.</p>
      <div className="space-y-8">
        {REFS.map((g) => (
          <section key={g.group}>
            <h2 className="mb-3 text-2xl font-black">{g.group}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((r) => (
                <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="card-3d group block border-t-4 p-5 transition hover:-translate-y-1" style={{ borderTopColor: r.color }}>
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: r.color }}>{r.tag}</span>
                  <h3 className="mt-2 text-lg font-extrabold">{r.name}</h3>
                  <p className="text-xs muted">{r.by}</p>
                  <p className="mt-2 text-sm">{r.what}</p>
                  <p className="mt-3 text-sm font-bold" style={{ color: r.color }} dir="ltr">{r.url.replace('https://', '').replace(/\/.*$/, '')} ↗</p>
                </a>
              ))}
            </div>
          </section>
        ))}
        <section className="card-3d p-5">
          <h2 className="text-xl font-extrabold">داخل المنصة</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/review?tab=laws" className="chip px-4 py-2 font-bold">القوانين والنظريات</Link>
            <Link href="/review?tab=mult" className="chip px-4 py-2 font-bold">جدول الضرب</Link>
            <Link href="/videos" className="chip px-4 py-2 font-bold">شروحات الفيديو</Link>
            <Link href="/games" className="chip px-4 py-2 font-bold">الألعاب التعليمية</Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}
