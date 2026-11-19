import Link from 'next/link';
import { requireStaff } from '@/lib/data';
import { BADGES, MONTHLY_BADGE, badgeSVG, hijriMonth, type BadgeIcon, type Tier } from '@/lib/badges';

export const dynamic = 'force-dynamic';

export default async function Awards({ searchParams }: { searchParams: Promise<{ class?: string }> }) {
  const { sb } = await requireStaff();
  const sp = await searchParams;
  const { data: classes } = await sb.from('classes').select('id, name').order('name');
  if (!classes?.length) return <p className="panel">لا توجد فصول مرتبطة بالحساب.</p>;
  const classId = sp.class && classes.some((c) => c.id === sp.class) ? sp.class : classes[0].id;
  const { data: students } = await sb.from('students').select('id, full_name, nickname').eq('class_id', classId).eq('is_active', true).order('full_name');
  const ids = (students ?? []).map((s) => s.id);
  const [{ data: earned }, { data: stars }] = await Promise.all([
    ids.length ? sb.from('student_badges').select('student_id, period, awarded_at, badges(code, icon, tier, name_ar)').in('student_id', ids) : Promise.resolve({ data: [] as never[] }),
    ids.length ? sb.from('star_ledger').select('student_id, amount').in('student_id', ids) : Promise.resolve({ data: [] as never[] }),
  ]);
  const month = hijriMonth(new Date());
  const rows = (students ?? []).map((s) => {
    const mine = (earned ?? []).filter((e) => e.student_id === s.id);
    const regular = mine.filter((e) => !e.period).map((e) => e.badges as unknown as { code: string; icon: BadgeIcon; tier: Tier; name_ar: string });
    const monthWins = mine.filter((e) => e.period);
    return {
      ...s, regular, monthWins: monthWins.length, thisMonth: monthWins.some((e) => e.period === month.key),
      stars: (stars ?? []).filter((x) => x.student_id === s.id).reduce((a, x) => a + x.amount, 0),
    };
  }).sort((a, b) => b.regular.length - a.regular.length || b.stars - a.stars);
  const honor = rows.filter((r) => r.thisMonth);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">الجوائز والأوسمة</h1>
        <div className="flex flex-wrap gap-2">{classes.map((c) => <Link key={c.id} href={`/teacher/awards?class=${c.id}`} className={`chip px-4 py-2 ${c.id === classId ? 'bg-star-400' : ''}`}>{c.name}</Link>)}</div>
      </div>

      <section className="card-3d grid items-center gap-5 p-6 md:grid-cols-[auto_1fr]">
        <span dangerouslySetInnerHTML={{ __html: badgeSVG(MONTHLY_BADGE.icon, 'special', true, 90) }} />
        <div>
          <p className="text-sm muted">لوحة تميّز الشهر · {month.name}</p>
          {honor.length ? <div className="mt-2 flex flex-wrap gap-2">{honor.map((r) => <span key={r.id} className="chip bg-star-300/50 px-3 py-1.5 text-sm">{r.full_name}</span>)}</div>
            : <p className="mt-2 muted">لم يكمل أحد مهام الشهر بعد.</p>}
        </div>
      </section>

      <section className="panel overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-ink/60"><tr><th className="py-2 text-start">الطالب</th><th>الأوسمة</th><th>تميّز الشهر</th><th>النجوم</th><th className="text-start">ما حصده</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-ink/5 align-middle">
                <td className="py-2"><Link href={`/teacher/students/${r.id}`} className="font-bold hover:underline">{r.full_name}</Link></td>
                <td className="text-center font-black">{r.regular.length} من {BADGES.length}</td>
                <td className="text-center">{r.monthWins ? `×${r.monthWins}` : '—'}</td>
                <td className="text-center">★ {r.stars}</td>
                <td><div className="flex flex-wrap gap-1">{r.regular.map((b) => <span key={b.code} title={b.name_ar} dangerouslySetInnerHTML={{ __html: badgeSVG(b.icon, b.tier, true, 30) }} />)}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="muted">لا يوجد طلاب في هذا الفصل.</p>}
      </section>
    </div>
  );
}
