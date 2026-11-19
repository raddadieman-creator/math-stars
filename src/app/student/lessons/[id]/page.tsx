import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { requireStudent } from '@/lib/student-data';
import { ScenePlayer } from '@/components/lessons/ScenePlayer';
import { ScenarioSchema } from '@/lib/scenario';

export const dynamic = 'force-dynamic';

export default async function StudentLesson({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { db } = await requireStudent();
  const { data: l } = await db.from('lessons').select('id, title, skill_id, scenario').eq('id', id).eq('status', 'published').single();
  const parsed = ScenarioSchema.safeParse(l?.scenario);
  if (!l || !parsed.success) return <Shell><p className="panel">الدرس غير متاح.</p></Shell>;
  const urls: Record<string, string> = {};
  for (const s of parsed.data.scenes) {
    if (!s.audio_path) continue;
    const { data } = await db.storage.from('content').createSignedUrl(s.audio_path, 3600);
    if (data?.signedUrl) urls[s.id] = data.signedUrl;
  }
  return (
    <Shell right={<Link href="/student" className="chip hover:bg-ink/5">صفحتي</Link>}>
      <h1 className="mb-4 text-3xl font-black">{l.title}</h1>
      <ScenePlayer scenario={parsed.data} audioUrls={urls} />
      {l.skill_id && <div className="mt-6 text-center"><Link href={`/student/practice/${l.skill_id}`} className="btn-aqua">انتقلي إلى التدريب على الدرس</Link></div>}
    </Shell>
  );
}
