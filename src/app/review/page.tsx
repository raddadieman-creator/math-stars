import { Shell } from '@/components/Shell';
import { Review } from '@/components/student/Review';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

/** المراجعة متاحة للجميع: جدول الضرب والقوانين والنظريات */
export default async function PublicReview({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const [{ tab }, s] = await Promise.all([searchParams, getSettings()]);
  return (
    <Shell school={s.school_name}>
      <h1 className="text-3xl font-black">المراجعة</h1>
      <p className="mt-1 mb-5 muted">جدول الضرب، والقوانين والنظريات المهمة للصف الثاني المتوسط.</p>
      <Review start={tab === 'laws' ? 'laws' : 'mult'} />
    </Shell>
  );
}
