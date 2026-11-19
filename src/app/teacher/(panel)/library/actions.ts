'use server';
import { revalidatePath } from 'next/cache';
import { requireStaff } from '@/lib/data';
import type { ImportedQuestion } from '@/lib/import-rows';

const s = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

export async function createModel(f: FormData) {
  const { sb, staff } = await requireStaff();
  const title = s(f, 'title');
  if (!title) return;
  const { error } = await sb.from('assessments').insert({
    kind: 'model', form_label: `m-${Date.now().toString(36)}`, title, domain_code: s(f, 'domain') || null,
    is_open: true, sort_order: 50, created_by: staff.id, source_label: s(f, 'source') || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/teacher/library');
}

export async function toggleModel(id: string, open: boolean) {
  const { sb } = await requireStaff();
  await sb.from('assessments').update({ is_open: open }).eq('id', id).eq('kind', 'model');
  revalidatePath('/teacher/library');
}

/** حفظ الأسئلة بعد مراجعتها في شاشة المعاينة. أسئلة النماذج تذهب إلى بنك المكتبة، وغيرها إلى بنك التدريب */
export async function importQuestions(input: { skillId: string; assessmentId: string | null; publish: boolean; items: ImportedQuestion[] }) {
  const { sb, staff } = await requireStaff();
  if (!input.skillId) return { error: 'اختيار المهارة مطلوب' };
  if (!input.items.length || input.items.length > 500) return { error: 'عدد الأسئلة غير صالح' };
  const bank = input.assessmentId ? 'library' : 'practice';
  const rows = input.items.map((q) => ({
    skill_id: input.skillId, cognitive: q.cognitive, difficulty: q.difficulty, qtype: q.qtype, prompt: q.prompt,
    hint: q.hint, source_label: q.source_label, ...q.payload, status: input.publish ? 'published' : 'review', bank, created_by: staff.id,
  }));
  const { data, error } = await sb.from('questions').insert(rows).select('id');
  if (error) return { error: error.message };
  if (input.assessmentId && data?.length) {
    const { data: last } = await sb.from('assessment_items').select('position').eq('assessment_id', input.assessmentId).order('position', { ascending: false }).limit(1);
    const start = (last?.[0]?.position ?? 0) + 1;
    const { error: e2 } = await sb.from('assessment_items').insert(data.map((r, i) => ({ assessment_id: input.assessmentId, question_id: r.id, position: start + i })));
    if (e2) return { error: e2.message };
  }
  revalidatePath('/teacher/library');
  revalidatePath('/teacher/questions');
  return { ok: true, count: data?.length ?? 0 };
}

export async function uploadLibraryFile(f: FormData) {
  const { sb, staff } = await requireStaff();
  const file = f.get('file') as File | null;
  if (!file || !file.size) return;
  const okType = file.type === 'application/pdf' || file.type.startsWith('image/');
  if (!okType || file.size > 25_000_000) throw new Error('ملف PDF أو صورة بحجم أقل من 25MB');
  const path = `library/${Date.now()}-${file.name.replace(/[^\w.\-]+/g, '_')}`;
  const up = await sb.storage.from('content').upload(path, file, { contentType: file.type });
  if (up.error) throw new Error(up.error.message);
  const { error } = await sb.from('library_files').insert({ title: s(f, 'title') || file.name, publisher: s(f, 'publisher') || null, language: s(f, 'language') || 'ar', storage_path: path, created_by: staff.id, sort_order: 100 });
  if (error) throw new Error(error.message);
  revalidatePath('/teacher/library');
}

export async function addLibraryLink(f: FormData) {
  const { sb, staff } = await requireStaff();
  const url = s(f, 'url');
  if (!/^https:\/\//.test(url)) throw new Error('رابط https مطلوب');
  const { error } = await sb.from('library_files').insert({ title: s(f, 'title') || url, publisher: s(f, 'publisher') || null, language: s(f, 'language') || 'ar', external_url: url, created_by: staff.id, sort_order: 100 });
  if (error) throw new Error(error.message);
  revalidatePath('/teacher/library');
}

export async function toggleFile(id: string, visible: boolean) {
  const { sb } = await requireStaff();
  await sb.from('library_files').update({ is_visible: visible }).eq('id', id);
  revalidatePath('/teacher/library');
}

export async function deleteFile(id: string) {
  const { sb } = await requireStaff();
  const { data } = await sb.from('library_files').select('storage_path').eq('id', id).single();
  if (data?.storage_path) await sb.storage.from('content').remove([data.storage_path]);
  await sb.from('library_files').delete().eq('id', id);
  revalidatePath('/teacher/library');
}
