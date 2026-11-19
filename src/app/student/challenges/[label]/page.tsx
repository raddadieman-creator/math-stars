import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { requireStudent } from '@/lib/student-data';
import { challengesOverview, loadModel } from '@/lib/library-service';
import { ModelRunner } from '@/components/student/ModelRunner';

export const dynamic = 'force-dynamic';

export default async function Challenge({ params }: { params: Promise<{ label: string }> }) {
  const { label } = await params;
  const { student } = await requireStudent();
  const c = (await challengesOverview(student.id)).find((x) => x.label === label);
  const model = c ? await loadModel(c.id, false, student.id) : null;
  return (
    <Shell right={<Link href="/student/challenges" className="chip hover:bg-ink/5">التحديات</Link>}>
      {model && model.items.length ? <ModelRunner model={model} timeLimitSec={label === 'ch-speed' ? 300 : undefined} />
        : <p className="panel">{label === 'ch-mistakes' ? 'لا توجد أسئلة سابقة أخطأت فيها حتى الآن.' : 'التحدي غير متاح الآن.'}</p>}
    </Shell>
  );
}
