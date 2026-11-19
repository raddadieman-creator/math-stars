import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { requireStudent } from '@/lib/student-data';
import { loadModel, measureStatus } from '@/lib/library-service';
import { MeasureRunner } from '@/components/student/MeasureRunner';

export const dynamic = 'force-dynamic';

export default async function MeasurePage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const { student } = await requireStudent();
  const st = await measureStatus(student.id);
  const m = kind === 'pre' ? st.pre : kind === 'post' ? st.post : null;
  const model = m && m.open && !m.done ? await loadModel(m.id, true) : null;
  return (
    <Shell right={<Link href="/student" className="chip hover:bg-ink/5">صفحتي</Link>}>
      {model ? <MeasureRunner model={model} />
        : <p className="panel">{m?.done ? 'أُنجز هذا القياس من قبل، ونتيجته في صفحتك.' : 'هذا القياس غير متاح الآن.'}</p>}
    </Shell>
  );
}
