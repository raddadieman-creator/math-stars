import { requireStaff } from '@/lib/data';
import { aiConfigured } from '@/lib/env';
import { LessonEditor } from '@/components/lessons/LessonEditor';
import { ScenarioSchema } from '@/lib/scenario';

export const dynamic = 'force-dynamic';

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb } = await requireStaff();
  const [{ data: l }, { data: skills }] = await Promise.all([
    sb.from('lessons').select('*').eq('id', id).single(),
    sb.from('skills').select('id, code, name_ar').order('code'),
  ]);
  if (!l) return <p className="panel">الدرس غير موجود.</p>;
  const parsed = ScenarioSchema.safeParse(l.scenario);
  return (
    <LessonEditor
      aiEnabled={aiConfigured()}
      skills={skills ?? []}
      lesson={{ id: l.id, title: l.title, skill_id: l.skill_id, status: l.status, extracted_text: l.extracted_text ?? '', concept_summary: l.concept_summary ?? '', source_file_path: l.source_file_path, scenario_source: l.scenario_source, scenario: parsed.success ? parsed.data : { scenes: [] } }}
    />
  );
}
