import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { StudentNav } from '@/components/student/StudentNav';
import { studentHome, studentStreak } from '@/lib/student-data';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { StreakCard } from '@/components/student/StreakCard';
import { MadaGreeting } from '@/components/student/MadaGreeting';
import { STATUS_AR } from '@/lib/types';
import { LogoutStudent } from '@/components/student/LogoutStudent';
import { BadgeCase } from '@/components/student/BadgeCase';
import { MeasureCard } from '@/components/student/MeasureCard';
import { measureStatus } from '@/lib/library-service';

export const dynamic = 'force-dynamic';

const STATUS_STYLE = {
  not_started: 'bg-ink/10 text-ink/70',
  developing: 'bg-sky2-400/20 text-sky2-600',
  needs_support: 'bg-rose-500/20 text-rose-600',
  mastered: 'bg-star-400/20 text-star-600',
} as const;


export default async function StudentHome() {
  const h = await studentHome();
  const [ms, streak] = await Promise.all([measureStatus(h.student.id), studentStreak(supabaseAdmin(), h.student.id)]);
  const mastered = h.skills.filter((s) => s.status === 'mastered').length;
  const first = h.student.full_name.split(' ')[0];
  return (
    <Shell right={<LogoutStudent />}>
      <StudentNav />
      <section className="grid items-center gap-6 md:grid-cols-[auto_1fr_auto]">
        <div className="md:col-span-2"><MadaGreeting first={first} current={streak.current} today={streak.today} /></div>
        <div className="card-3d flex items-center gap-3 px-5 py-3"><span className="text-3xl">⭐</span><div><p className="text-xs muted">نجومي</p><p className="text-2xl font-black text-star-600">{h.totalStars}</p></div></div>
      </section>

      <StreakCard s={streak} />

      <MeasureCard pre={ms.pre} post={ms.post} />

      {/* رحلة التقدم */}
      <section className="card-3d mt-8 p-6">
        <div className="flex items-baseline justify-between"><h2 className="text-xl font-extrabold">رحلتي</h2><p className="text-sm muted">{mastered} من {h.skills.length} مهارات متقنة</p></div>
        <div className="mt-4 h-4 overflow-hidden rounded-full bg-ink/10">
          <div className="h-full rounded-full bg-gradient-to-l from-star-300 via-rose-300 to-aqua-300" style={{ width: `${h.skills.length ? (mastered / h.skills.length) * 100 : 0}%` }} />
        </div>
      </section>

      <Link href="/student/library" className="card-3d tilt mt-8 flex flex-wrap items-center justify-between gap-4 p-6">
        <div><b className="text-2xl">مكتبة نماذج الاختبارات</b><p className="mt-1 muted">نماذج على نمط TIMSS وأسئلة رسمية مقتبسة، مع مراجعة الحل بعد التسليم</p></div>
        <span className="btn-star">فتح المكتبة</span>
      </Link>

      <section className="mt-8">
        <h2 className="h-section">المهارات</h2>
        {!h.skills.length && <p className="mt-3 muted">لم تُنشر أسئلة بعد. ستظهر المهارات هنا عندما تنشرها معلمك.</p>}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {h.skills.map((s) => (
            <div key={s.id} className="card-3d tilt flex flex-col p-5">
              <p className="text-xs muted">{s.domain}</p>
              <p className="mt-1 text-lg font-extrabold">{s.name}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`chip ${STATUS_STYLE[s.status]}`}>{STATUS_AR[s.status]}</span>
                <span className="chip">المستوى {s.level} من 3</span>
              </div>
              <Link href={`/student/practice/${s.id}`} className="btn-aqua mt-4">{s.seen ? 'متابعة التدريب' : 'بدء التدريب'}</Link>
            </div>
          ))}
        </div>
      </section>

      {h.lessons.length > 0 && (
        <section className="mt-10">
          <h2 className="h-section">الدروس المرئية</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {h.lessons.map((l) => (
              <Link key={l.id} href={`/student/lessons/${l.id}`} className="card-3d tilt p-5 hover:bg-ink/5">
                <p className="text-3xl">🎬</p><p className="mt-2 text-lg font-extrabold">{l.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <BadgeCase stats={h.stats} goals={h.goals} owned={h.owned} monthName={h.monthName} monthlyWins={h.monthlyWins} />
    </Shell>
  );
}
