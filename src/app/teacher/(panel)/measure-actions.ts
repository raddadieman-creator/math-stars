'use server';
import { revalidatePath } from 'next/cache';
import { requireStaff } from '@/lib/data';

export async function togglePost(f: FormData) {
  const { sb } = await requireStaff();
  await sb.from('assessments').update({ is_open: f.get('open') === '1' }).eq('id', String(f.get('id'))).eq('kind', 'post');
  revalidatePath('/teacher');
}
