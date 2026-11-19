import { requireStaff } from '@/lib/data';
import { toFormInput } from '@/lib/question-form';
import { QuestionEditor } from '@/components/teacher/QuestionEditor';

export const dynamic = 'force-dynamic';

export default async function EditQuestion({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb } = await requireStaff();
  const { data: skills } = await sb.from('skills').select('id, code, name_ar').order('code');
  if (id === 'new') return <QuestionEditor skills={skills ?? []} />;
  const { data: q } = await sb.from('questions').select('*').eq('id', id).single();
  if (!q) return <p className="panel">السؤال غير موجود.</p>;
  return <QuestionEditor skills={skills ?? []} initial={{ ...q, form: toFormInput(q) }} />;
}
