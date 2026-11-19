import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { StudentNav } from '@/components/student/StudentNav';
import { requireStudent } from '@/lib/student-data';
import { challengesOverview } from '@/lib/library-service';

export const dynamic = 'force-dynamic';

export default async function Challenges() {
  const { student } = await requireStudent();
  const list = await challengesOverview(student.id);
  return (
    <Shell>
      <StudentNav />
      <h1 className="text-3xl font-black">التحديات</h1>
      <p className="mt-1 muted">أسئلة من بنك المنصة كله، تتكرر بصيغ مختلفة حتى تثبت المهارة.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {list.map((c) => (
          <Link key={c.id} href={`/student/challenges/${c.label}`} className="card-3d tilt flex flex-col p-6">
            <b className="text-xl">{c.title}</b>
            <span className="mt-1 text-sm muted">{c.desc}</span>
            <span className="mt-3 text-sm">{c.label === 'ch-daily' ? (c.doneToday ? '✓ أُنجز تحدي اليوم' : 'تحدٍّ جديد اليوم') : c.best !== null ? `أفضل نتيجة: ${c.best}٪` : 'لم يُجرَّب بعد'}</span>
            <span className="btn-star mt-4">بدء التحدي</span>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
