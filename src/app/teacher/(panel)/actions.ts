'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireStaff } from '@/lib/data';
import { generateLoginCode, hashLoginCode } from '@/lib/codes';

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
    stars_personal_improvement: num(f, 's_improve'), updated_at: new Date().toISOString(), updated_by: staff.id,
  }).eq('id', 1);
  if (r.error) throw new Error(r.error.message);
  revalidatePath('/teacher/settings');
}

// ---------- الفصول والطالبات ----------
export async function createClass(f: FormData) {
  const { sb } = await requireStaff();
  const { data, error } = await sb.from('classes').insert({ name: str(f, 'name'), academic_year: str(f, 'year') }).select('id').single();
  if (error) throw new Error(error.message);
  const teachers = f.getAll('teacher_ids').map(String).filter(Boolean);
  if (teachers.length) await sb.from('class_teachers').insert(teachers.map((t) => ({ class_id: data.id, teacher_id: t })));
  revalidatePath('/teacher/students');
}

export async function addStudent(f: FormData): Promise<{ code?: string; error?: string }> {
  const { sb } = await requireStaff();
  const pepper = process.env.STUDENT_CODE_PEPPER ?? '';
  const full = str(f, 'full_name');
  const classId = str(f, 'class_id');
  if (!full || !classId) return { error: 'الاسم والفصل مطلوبان' };
  for (let i = 0; i < 5; i++) {
    const code = generateLoginCode();
    const { error } = await sb.from('students').insert({
      full_name: full, nickname: str(f, 'nickname') ?? `نجمة ${Math.floor(100 + Math.random() * 900)}`,
      class_id: classId, login_code_hash: hashLoginCode(code, pepper),
    });
    if (!error) { revalidatePath('/teacher/students'); return { code }; }
    if (!error.message.includes('duplicate')) return { error: error.message };
  }
  return { error: 'تعذر توليد رمز فريد، أعيدي المحاولة' };
}

export async function resetCode(studentId: string): Promise<{ code?: string; error?: string }> {
  const { sb } = await requireStaff();
  const code = generateLoginCode();
  const { error } = await sb.from('students').update({ login_code_hash: hashLoginCode(code, process.env.STUDENT_CODE_PEPPER ?? '') }).eq('id', studentId);
  return error ? { error: error.message } : { code };
}

export async function toggleStudent(studentId: string, active: boolean) {
  const { sb } = await requireStaff();
  await sb.from('students').update({ is_active: active }).eq('id', studentId);
  revalidatePath('/teacher/students');
}
