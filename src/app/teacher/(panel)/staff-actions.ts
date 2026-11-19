'use server';
import { revalidatePath } from 'next/cache';
import { randomBytes, randomInt } from 'node:crypto';
import { requireStaff } from '@/lib/data';
import { supabaseAdmin } from '@/lib/supabase/admin';

type R = { ok?: boolean; code?: string; error?: string };

/** إدارة حسابات المعلمين: للإدارة فقط، ويُنفَّذ إنشاء الحسابات وحذفها بمفتاح الخدمة في الخادم */
async function requireAdmin() {
  const ctx = await requireStaff();
  if (ctx.staff.role !== 'admin') throw new Error('هذه الصفحة للإدارة فقط');
  return ctx;
}
const newCode = () => String(randomInt(100000, 1000000));

export async function addStaff(f: FormData): Promise<R> {
  await requireAdmin();
  const name = String(f.get('full_name') ?? '').replace(/\s+/g, ' ').trim();
  const role = f.get('role') === 'admin' ? 'admin' : 'teacher';
  const classes = f.getAll('class_ids').map(String).filter(Boolean);
  if (name.split(' ').length < 2) return { error: 'يُكتب الاسم ثنائيًا على الأقل' };
  const db = supabaseAdmin();
  const { data: same } = await db.from('staff').select('id').eq('full_name', name);
  if (same?.length) return { error: 'يوجد حساب بهذا الاسم' };
  const code = newCode();
  const email = `staff-${randomBytes(6).toString('hex')}@accounts.invalid`;
  const { data, error } = await db.auth.admin.createUser({ email, password: code, email_confirm: true, user_metadata: { full_name: name } });
  if (error || !data.user) return { error: error?.message ?? 'تعذر إنشاء الحساب' };
  const ins = await db.from('staff').insert({ id: data.user.id, full_name: name, role });
  if (ins.error) { await db.auth.admin.deleteUser(data.user.id); return { error: ins.error.message }; }
  if (classes.length) await db.from('class_teachers').insert(classes.map((c) => ({ class_id: c, teacher_id: data.user!.id })));
  revalidatePath('/teacher/staff');
  return { ok: true, code };
}

export async function resetStaffCode(id: string): Promise<R> {
  await requireAdmin();
  const code = newCode();
  const { error } = await supabaseAdmin().auth.admin.updateUserById(id, { password: code });
  return error ? { error: error.message } : { ok: true, code };
}

export async function deleteStaff(id: string): Promise<R> {
  const { staff } = await requireAdmin();
  if (id === staff.id) return { error: 'لا يمكن حذف الحساب المستخدم حاليًا' };
  const db = supabaseAdmin();
  const { data: admins } = await db.from('staff').select('id').eq('role', 'admin');
  if ((admins ?? []).length <= 1 && (admins ?? []).some((a) => a.id === id)) return { error: 'يلزم بقاء حساب إدارة واحد على الأقل' };
  const { error } = await db.auth.admin.deleteUser(id);   // يحذف سجل staff وروابط الفصول تبعًا
  if (error) return { error: error.message };
  revalidatePath('/teacher/staff');
  return { ok: true };
}

export async function updateStaff(id: string, name: string, role: 'teacher' | 'admin', classIds: string[]): Promise<R> {
  const { staff } = await requireAdmin();
  const full = name.replace(/\s+/g, ' ').trim();
  if (full.split(' ').length < 2) return { error: 'يُكتب الاسم ثنائيًا على الأقل' };
  if (id === staff.id && role !== 'admin') return { error: 'لا يمكن إزالة صلاحية الإدارة عن الحساب المستخدم حاليًا' };
  const db = supabaseAdmin();
  const u = await db.from('staff').update({ full_name: full, role }).eq('id', id);
  if (u.error) return { error: u.error.message };
  await db.from('class_teachers').delete().eq('teacher_id', id);
  if (classIds.length) await db.from('class_teachers').insert(classIds.map((c) => ({ class_id: c, teacher_id: id })));
  revalidatePath('/teacher/staff');
  return { ok: true };
}
