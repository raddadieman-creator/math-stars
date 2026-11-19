import { Shell } from '@/components/Shell';
import { StudentNav } from '@/components/student/StudentNav';
import { Review } from '@/components/student/Review';
import { requireStudent } from '@/lib/student-data';

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  await requireStudent();
  return (
    <Shell>
      <StudentNav />
      <h1 className="text-3xl font-black">المراجعة</h1>
      <p className="mt-1 mb-5 muted">جدول الضرب، والقوانين والنظريات المهمة للصف الثاني المتوسط.</p>
      <Review />
    </Shell>
  );
}
