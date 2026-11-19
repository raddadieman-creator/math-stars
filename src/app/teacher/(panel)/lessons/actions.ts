'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/data';
import { ScenarioSchema, type Scenario } from '@/lib/scenario';

export async function createLesson(f: FormData) {
  const { sb, staff } = await requireStaff();
  const { data, error } = await sb.from('lessons').insert({ title: String(f.get('title') || 'درس جديد'), created_by: staff.id }).select('id').single();
  if (error) throw new Error(error.message);
  redirect(`/teacher/lessons/${data.id}`);
}

export async function saveLesson(input: { id: string; title: string; skill_id: string | null; extracted_text: string; concept_summary: string; scenario: Scenario; source_file_path?: string | null; scenario_source?: 'manual' | 'ai_draft' }) {
  const { sb } = await requireStaff();
  const parsed = ScenarioSchema.safeParse(input.scenario);
  if (!parsed.success) return { error: 'في السيناريو حقول ناقصة أو غير صالحة: ' + parsed.error.issues[0]?.message };
  const patch: Record<string, unknown> = {
    title: input.title, skill_id: input.skill_id || null, extracted_text: input.extracted_text, concept_summary: input.concept_summary, scenario: parsed.data,
  };
  if (input.source_file_path !== undefined) patch.source_file_path = input.source_file_path;
  if (input.scenario_source) patch.scenario_source = input.scenario_source;
  // أي تعديل على درس منشور يعيده إلى المراجعة حتى تعتمده المعلم من جديد
  const { data: cur } = await sb.from('lessons').select('status').eq('id', input.id).single();
  if (cur?.status === 'published') patch.status = 'review';
  const { error } = await sb.from('lessons').update(patch).eq('id', input.id);
  if (error) return { error: error.message };
  revalidatePath(`/teacher/lessons/${input.id}`);
  return { ok: true, status: (patch.status as string) ?? cur?.status };
}

export async function setLessonStatus(id: string, status: 'draft' | 'published') {
  const { sb, staff } = await requireStaff();
  const { data: l } = await sb.from('lessons').select('scenario').eq('id', id).single();
  if (status === 'published' && !(l?.scenario as Scenario)?.scenes?.length) return { error: 'لا يمكن نشر درس بلا مشاهد' };
  const { error } = await sb.from('lessons').update(status === 'published'
    ? { status, approved_by: staff.id, approved_at: new Date().toISOString() }
    : { status, approved_by: null, approved_at: null }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/teacher/lessons');
  return { ok: true };
}
