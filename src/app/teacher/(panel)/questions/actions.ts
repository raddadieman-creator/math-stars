'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/data';
import { buildQuestionPayload } from '@/lib/question-form';
import type { QType } from '@/lib/types';

const s = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

export async function saveQuestion(_: unknown, f: FormData): Promise<{ error?: string }> {
  const { sb, staff } = await requireStaff();
  const id = s(f, 'id');
  let payload;
  try {
    payload = buildQuestionPayload({ qtype: s(f, 'qtype') as QType, optionsText: s(f, 'options'), correct: s(f, 'correct'), stepsText: s(f, 'steps'), errorsText: s(f, 'errors') });
  } catch (e) {
    return { error: (e as Error).message };
  }
  const row = {
    skill_id: s(f, 'skill_id'), cognitive: s(f, 'cognitive'), difficulty: Number(s(f, 'difficulty')), qtype: s(f, 'qtype'),
    objective: s(f, 'objective') || null, prompt: s(f, 'prompt'), media_url: s(f, 'media_url') || null,
    explanation: s(f, 'explanation') || null, hint: s(f, 'hint') || null, remedial_activity: s(f, 'remedial') || null,
    status: s(f, 'status') || 'draft', ...payload,
  };
  if (!row.prompt || !row.skill_id) return { error: 'نص السؤال والمهارة مطلوبان' };
  const res = id ? await sb.from('questions').update(row).eq('id', id) : await sb.from('questions').insert({ ...row, created_by: staff.id });
  if (res.error) return { error: res.error.message };
  revalidatePath('/teacher/questions');
  redirect('/teacher/questions');
}

export async function setStatus(id: string, status: 'draft' | 'review' | 'published' | 'archived') {
  const { sb } = await requireStaff();
  await sb.from('questions').update({ status }).eq('id', id);
  revalidatePath('/teacher/questions');
}

export async function addSkill(f: FormData) {
  const { sb } = await requireStaff();
  const topicId = s(f, 'topic_id');
  const { data: topic } = await sb.from('topic_areas').select('domain_id').eq('id', topicId).single();
  if (!topic) throw new Error('اختاري مجال الموضوع');
  const { error } = await sb.from('skills').insert({ domain_id: topic.domain_id, topic_id: topicId, code: s(f, 'code'), name_ar: s(f, 'name_ar'), description: s(f, 'description') || null });
  if (error) throw new Error(error.message);
  revalidatePath('/teacher/questions');
}
