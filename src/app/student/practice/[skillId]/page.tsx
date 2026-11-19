import { Shell } from '@/components/Shell';
import { requireStudent } from '@/lib/student-data';
import { PracticeRunner } from '@/components/student/PracticeRunner';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Practice({ params }: { params: Promise<{ skillId: string }> }) {
  const { skillId } = await params;
  const { db } = await requireStudent();
  const { data: skill } = await db.from('skills').select('id, name_ar').eq('id', skillId).single();
  if (!skill) return <Shell><p>المهارة غير موجودة.</p></Shell>;
  return (
    <Shell right={<Link href="/student" className="chip hover:bg-white/10">صفحتي</Link>}>
      <PracticeRunner skillId={skill.id} skillName={skill.name_ar} />
    </Shell>
  );
}
