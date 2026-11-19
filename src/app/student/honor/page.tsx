import { Shell } from '@/components/Shell';
import { StudentNav } from '@/components/student/StudentNav';
import { requireStudent } from '@/lib/student-data';
import { honorBoard } from '@/lib/library-service';
import { badgeSVG, MONTHLY_BADGE, hijriMonth } from '@/lib/badges';

export const dynamic = 'force-dynamic';

export default async function Honor() {
  const { student } = await requireStudent();
  const rows = await honorBoard(student.class_id);
  const month = hijriMonth(new Date());
  return (
    <Shell>
      <StudentNav />
      <div className="flex flex-wrap items-center gap-4">
        <span dangerouslySetInnerHTML={{ __html: badgeSVG(MONTHLY_BADGE.icon, 'special', true, 70) }} />
        <div><h1 className="text-3xl font-black">لوحة التميز</h1><p className="muted">فصلك في آخر 30 يومًا · {month.name}</p></div>
      </div>
      <div className="panel mt-6 overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="text-ink/60"><tr><th className="py-2 text-start">المركز</th><th className="text-start">الاسم</th><th>النجوم</th><th>الأوسمة</th><th>تميّز الشهر</th></tr></thead>
          <tbody>{rows.map((r, k) => (
            <tr key={r.id} className={`border-t border-ink/5 ${r.id === student.id ? 'bg-star-300/20 font-bold' : ''}`}>
              <td className="py-2">{k < 3 ? ['🥇', '🥈', '🥉'][k] : k + 1}</td><td>{r.name}{r.id === student.id ? ' (أنت)' : ''}</td>
              <td className="text-center">★ {r.stars}</td><td className="text-center">{r.badges}</td><td className="text-center">{r.monthly ? `×${r.monthly}` : '—'}</td></tr>))}</tbody>
        </table>
        {!rows.length && <p className="muted">لا توجد بيانات بعد.</p>}
      </div>
      <p className="mt-2 text-xs muted">تظهر في اللوحة الأسماء المختصرة لطلاب الفصل فقط.</p>
    </Shell>
  );
}
