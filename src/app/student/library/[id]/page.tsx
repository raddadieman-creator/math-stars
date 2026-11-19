import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { requireStudent } from '@/lib/student-data';
import { loadModel } from '@/lib/library-service';
import { ModelRunner } from '@/components/student/ModelRunner';

export const dynamic = 'force-dynamic';

export default async function ModelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireStudent();
  const model = await loadModel(id);
  return (
    <Shell right={<Link href="/student/library" className="chip hover:bg-ink/5">المكتبة</Link>}>
      {model ? <ModelRunner model={model} /> : <p className="panel">النموذج غير متاح.</p>}
    </Shell>
  );
}
