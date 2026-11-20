import { requireStaff } from '@/lib/data';
import { Review } from '@/components/student/Review';
import { VideoLibrary } from '@/components/VideoLibrary';
import { FullscreenButton } from '@/components/teacher/FullscreenButton';

export const dynamic = 'force-dynamic';

/** لوحة المراجعة للمعلمة: تُعرض في الفصل على الشاشة، ومعها مكتبة الشروحات */
export default async function TeacherReview({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  await requireStaff();
  const { tab } = await searchParams;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">لوحة المراجعة</h1>
          <p className="mt-1 muted">جدول الضرب والقوانين والنظريات، جاهزة للعرض في الفصل.</p>
        </div>
        <FullscreenButton targetId="review-board" />
      </div>
      <div id="review-board" className="rounded-3xl bg-white p-4 [&:fullscreen]:overflow-auto [&:fullscreen]:p-10">
        <Review start={tab === 'laws' ? 'laws' : 'mult'} />
      </div>
      <section>
        <h2 className="mb-3 text-2xl font-black">شروحات الفيديو</h2>
        <VideoLibrary />
      </section>
    </div>
  );
}
