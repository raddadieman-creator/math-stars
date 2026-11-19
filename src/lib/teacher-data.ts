import 'server-only';
import type { OutcomeRow } from './metrics';
import type { MasteryStatus } from './types';

type SB = Awaited<ReturnType<typeof import('./supabase/server').supabaseServer>>;

/** يجلب كل الصفوف مع تجاوز حد الـ 1000 صف الافتراضي في Supabase */
async function all<T>(q: () => any, page = 1000): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += page) {
    const { data, error } = await q().range(from, from + page - 1);
    if (error) throw new Error(error.message);
    out.push(...(data ?? []));
    if (!data || data.length < page) break;
  }
  return out;
}

export async function classData(sb: SB, classId: string) {
  const { data: students } = await sb.from('students').select('id, full_name, nickname, is_active, is_demo').eq('class_id', classId).order('full_name');
  const ids = (students ?? []).map((s) => s.id);
  if (!ids.length) return { students: [], outcomes: [] as OutcomeRow[], mastery: [] as { student_id: string; skill_id: string; status: MasteryStatus; level: number }[] };
  const outcomes = await all<OutcomeRow>(() => sb.from('item_outcomes').select('student_id, skill_id, session_id, tries, outcome, total_time_ms, created_at').in('student_id', ids).order('created_at'));
  const mastery = await all<{ student_id: string; skill_id: string; status: MasteryStatus; level: number }>(() => sb.from('skill_mastery').select('student_id, skill_id, status, level').in('student_id', ids));
  return { students: students ?? [], outcomes, mastery };
}

export async function skillNames(sb: SB) {
  const { data } = await sb.from('skills').select('id, name_ar, code');
  return new Map((data ?? []).map((s) => [s.id, s.name_ar as string]));
}
