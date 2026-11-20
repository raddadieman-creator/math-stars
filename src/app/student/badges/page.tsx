import { Shell } from '@/components/Shell';
import { StudentNav } from '@/components/student/StudentNav';
import { BadgeCase } from '@/components/student/BadgeCase';
import { studentHome } from '@/lib/student-data';

export const dynamic = 'force-dynamic';

export default async function Badges() {
  const h = await studentHome();
  return (
    <Shell>
      <StudentNav />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">أوسمتي وشاراتي</h1>
        <a href="/student/certificate" className="btn-star">شهادة منجزاتي: طباعة ومشاركة واتساب</a>
      </div>
      <BadgeCase stats={h.stats} goals={h.goals} owned={h.owned} monthName={h.monthName} monthlyWins={h.monthlyWins} />
    </Shell>
  );
}
