'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireStaff } from '@/lib/data';

export async function signOut() {
  const { sb } = await requireStaff();
  await sb.auth.signOut();
  redirect('/teacher/login');
}

const str = (f: FormData, k: string) => { const v = String(f.get(k) ?? '').trim(); return v === '' ? null : v; };
const lines = (f: FormData, k: string) => String(f.get(k) ?? '').split('\n').map((s) => s.trim()).filter(Boolean);
const num = (f: FormData, k: string) => Number(f.get(k));

// ---------- الإعدادات ----------
export async function saveSettings(f: FormData) {
  const { sb, staff } = await requireStaff();
  const { error } = await sb.from('school_settings').update({
    school_name: str(f, 'school_name'), principal_name: str(f, 'principal_name'),
    teacher_names: lines(f, 'teacher_names'), vision: str(f, 'vision'), mission: str(f, 'mission'),
    goals: lines(f, 'goals'), timss_intro: str(f, 'timss_intro'),
    program_weeks: num(f, 'program_weeks') || 20, program_start_date: str(f, 'program_start_date'),
    updated_at: new Date().toISOString(), updated_by: staff.id,
  }).eq('id', 1);
  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
}

export async function uploadBranding(f: FormData) {
  const { sb } = await requireStaff();
  const file = f.get('file') as File | null;
  const field = String(f.get('field'));
  if (!file || !file.size || !['school_logo_url', 'timss_logo_url'].includes(field)) return;
  if (!file.type.startsWith('image/') || file.size > 2_000_000) throw new Error('صورة فقط وبحجم أقل من 2MB');
  const path = `${field}-${Date.now()}.${file.name.split('.').pop() ?? 'png'}`;
  const { error } = await sb.storage.from('branding').upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);
  const { data } = sb.storage.from('branding').getPublicUrl(path);
  await sb.from('school_settings').update({ [field]: data.publicUrl }).eq('id', 1);
  revalidatePath('/', 'layout');
}

export async function saveRules(f: FormData) {
  const { sb, staff } = await requireStaff();
  const a = await sb.from('adaptive_rules').update({
    promote_after_independent_correct: num(f, 'promote'), demote_after_errors: num(f, 'demote'),
    mastery_min_items: num(f, 'min_items'), mastery_threshold: num(f, 'threshold') / 100,
    support_threshold: num(f, 'support') / 100, max_tries_before_reveal: num(f, 'max_tries'),
    updated_at: new Date().toISOString(), updated_by: staff.id,
  }).eq('id', 1);
  if (a.error) throw new Error(a.error.message);
  const r = await sb.from('reward_rules').update({
    stars_first_try: num(f, 's_first'), stars_after_hint: num(f, 's_hint'), stars_after_reveal: num(f, 's_reveal'),
    stars_session_complete: num(f, 's_session'), stars_skill_mastered: num(f, 's_mastered'),
    stars_personal_improvement: num(f, 's_improve'), monthly_sessions: num(f, 'm_sessions') || 8, monthly_models: num(f, 'm_models') || 2, monthly_independent: num(f, 'm_independent') || 30, updated_at: new Date().toISOString(), updated_by: staff.id,
  }).eq('id', 1);
  if (r.error) throw new Error(r.error.message);
  revalidatePath('/teacher/settings');
}

// ---------- الفصول والطلاب ----------
export async function createClass(f: FormData) {
  const { sb } = await requireStaff();
  const { data, error } = await sb.from('classes').insert({ name: str(f, 'name'), academic_year: str(f, 'year') }).select('id').single();
  if (error) throw new Error(error.message);
  const teachers = f.getAll('teacher_ids').map(String).filter(Boolean);
  if (teachers.length) await sb.from('class_teachers').insert(teachers.map((t) => ({ class_id: data.id, teacher_id: t })));
  revalidatePath('/teacher/students');
}

/** إضافة طالبة: تدخل باسمها الثلاثي وفصلها، فلا يُصدر لها رمز */
export async function addStudent(f: FormData): Promise<{ ok?: boolean; error?: string }> {
  const { sb } = await requireStaff();
  const { normName } = await import('@/lib/names');
  const { randomBytes } = await import('node:crypto');
  const full = (str(f, 'full_name') ?? '').replace(/\s+/g, ' ');
  const classId = str(f, 'class_id');
  if (!full || !classId) return { error: 'الاسم والفصل مطلوبان' };
  if (full.split(' ').length < 3) return { error: 'يُكتب الاسم ثلاثيًا على الأقل' };
  const { data: dup } = await sb.from('students').select('full_name').eq('class_id', classId);
  if ((dup ?? []).some((d) => normName(d.full_name) === normName(full))) return { error: 'الاسم مسجل في هذا الفصل' };
  const { error } = await sb.from('students').insert({
    full_name: full, nickname: str(f, 'nickname') ?? full.split(' ').slice(0, 2).join(' '),
    class_id: classId, login_code_hash: 'name:' + randomBytes(16).toString('hex'),
  });
  if (error) return { error: error.message };
  revalidatePath('/teacher/students');
  return { ok: true };
}

/** حذف طالبة مع سجلاتها (للمعلم صاحب الفصل أو الإدارة) */
export async function deleteStudent(studentId: string): Promise<{ ok?: boolean; error?: string }> {
  const { sb } = await requireStaff();
  const { error } = await sb.from('students').delete().eq('id', studentId);
  if (error) return { error: error.message };
  revalidatePath('/teacher/students');
  return { ok: true };
}

export async function toggleStudent(studentId: string, active: boolean) {
  const { sb } = await requireStaff();
  await sb.from('students').update({ is_active: active }).eq('id', studentId);
  revalidatePath('/teacher/students');
}

/** استيراد أسماء الطلاب من Excel: [الاسم الثلاثي، الفصل اختياري]. يُنشأ الفصل للمعلم إن لم يوجد. */
export async function importStudents(rows: [string, string][], fallbackClassId: string): Promise<{ added: number; skipped: number; error?: string }> {
  const { staff, sb } = await requireStaff();
  const { normName } = await import('@/lib/names');
  const { randomBytes } = await import('node:crypto');
  const { data: links } = await sb.from('class_teachers').select('class_id, classes(id, name)').eq('teacher_id', staff.id);
  const mine = (links ?? []).map((l) => l.classes as unknown as { id: string; name: string }).filter(Boolean);
  const pool = staff.role === 'admin' ? ((await sb.from('classes').select('id, name')).data ?? []) : mine;
  const findClass = async (label: string) => {
    const w = normName(label); if (!w) return pool.find((c) => c.id === fallbackClassId) ?? null;
    const hit = pool.find((c) => normName(c.name) === w || normName(c.name).replace(/\s/g, '').endsWith(w.replace(/\s/g, '')));
    if (hit) return hit;
    const { data: c, error } = await sb.from('classes').insert({ name: label.trim() }).select('id, name').single();
    if (error || !c) return null;
    await sb.from('class_teachers').insert({ class_id: c.id, teacher_id: staff.id });
    pool.push(c); return c;
  };
  let added = 0, skipped = 0;
  for (const [nm, cl] of rows.slice(0, 1000)) {
    const name = String(nm ?? '').replace(/\s+/g, ' ').trim();
    if (name.split(' ').length < 2) { if (name) skipped++; continue; }
    const c = await findClass(String(cl ?? ''));
    if (!c) { skipped++; continue; }
    const { data: dup } = await sb.from('students').select('id, full_name').eq('class_id', c.id);
    if ((dup ?? []).some((d) => normName(d.full_name) === normName(name))) { skipped++; continue; }
    const { error } = await sb.from('students').insert({ full_name: name, nickname: name.split(' ').slice(0, 2).join(' '), class_id: c.id, login_code_hash: 'name:' + randomBytes(16).toString('hex') });
    if (error) skipped++; else added++;
  }
  revalidatePath('/teacher/students');
  return { added, skipped };
}

/** تغيير كلمة مرور المعلم بعد التحقق من الحالية */
export async function changePassword(f: FormData): Promise<{ ok?: boolean; error?: string }> {
  const { sb } = await requireStaff();
  const cur = String(f.get('current') ?? ''), next = String(f.get('next') ?? '');
  if (next.length < 6) return { error: 'كلمة المرور الجديدة ستة أحرف على الأقل' };
  const { data: u } = await sb.auth.getUser();
  const { error: e1 } = await sb.auth.signInWithPassword({ email: u.user?.email ?? '', password: cur });
  if (e1) return { error: 'كلمة المرور الحالية غير صحيحة' };
  const { error } = await sb.auth.updateUser({ password: next });
  return error ? { error: error.message } : { ok: true };
}
