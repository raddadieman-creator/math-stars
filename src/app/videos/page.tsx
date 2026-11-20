import { Shell } from '@/components/Shell';
import { VideoLibrary } from '@/components/VideoLibrary';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function Videos() {
  const s = await getSettings();
  return (
    <Shell school={s.school_name}>
      <h1 className="text-3xl font-black">شروحات الفيديو</h1>
      <p className="mt-1 mb-5 muted">شروحات لموضوعات رياضيات الصف الثاني المتوسط من أكثر من مصدر.</p>
      <VideoLibrary />
    </Shell>
  );
}
