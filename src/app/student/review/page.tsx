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
      <Review />
    </Shell>
  );
}
