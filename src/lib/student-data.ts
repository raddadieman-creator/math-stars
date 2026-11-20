import 'server-only';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from './supabase/admin';
import { getStudentSession } from './student-session';
import { isConfigured } from './env';
import type { MasteryStatus } from './types';
import { monthlyGoals, studentStats } from './badge-service';
import { hijriMonth } from './badges';

export async function requireStudent() {
  if (!isConfigured()) redirect('/setup');
  const s = await getStudentSession();
  if (!s) redirect('/student/login');
  const db = supabaseAdmin();
  const { data: st } = await db.from('students').select('id, full_name, nickname, avatar, class_id, is_active').eq('id', s.sid).single();
  if (!st || !st.is_active) redirect('/student/login');
  return { db, student: st as { id: string; full_name: string; nickname: string; avatar: string; class_id: string } };
}

export async function studentHome() {
  const { db, student } = await requireStudent();
  const [stars, badges, mastery, skills, pubQ, lessons] = await Promise.all([
    db.from('star_ledger').select('amount').eq('student_id', student.id),
    db.from('student_badges').select('awarded_at, period, badges(code)').eq('student_id', student.id).order('awarded_at', { ascending: false }),
    db.from('skill_mastery').select('skill_id, level, status, items_seen').eq('student_id', student.id),
    db.from('skills').select('id, code, name_ar, sort_order, content_domains(name_ar, sort_order)').order('sort_order'),
    db.from('questions').select('skill_id').eq('status', 'published'),
    db.from('lessons').select('id, title, skill_id').eq('status', 'published').order('created_at', { ascending: false }),
  ]);
  const withQuestions = new Set((pubQ.data ?? []).map((q) => q.skill_id));
  const m = new Map((mastery.data ?? []).map((r) => [r.skill_id, r]));
  const skillList = (skills.data ?? [])
    .filter((s) => withQuestions.has(s.id))
    .map((s) => {
      const d = s.content_domains as unknown as { name_ar: string; sort_order: number } | null;
      const r = m.get(s.id);
      return { id: s.id, name: s.name_ar, domain: d?.name_ar ?? '', level: r?.level ?? 1, status: (r?.status ?? 'not_started') as MasteryStatus, seen: r?.items_seen ?? 0 };
    });
  return {
    student,
    totalStars: (stars.data ?? []).reduce((a, r) => a + r.amount, 0),
    owned: new Map((badges.data ?? []).filter((b) => !b.period).map((b) => [(b.badges as unknown as { code: string }).code, b.awarded_at as string])),
    monthlyWins: (badges.data ?? []).filter((b) => b.period).map((b) => b.period as string),
    stats: await studentStats(db, student.id),
    goals: await monthlyGoals(db),
    monthName: hijriMonth(new Date()).name,
    skills: skillList,
    lessons: lessons.data ?? [],
  };
}

const dayKey = (d: Date | string) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(new Date(d));

/** سلسلة الأيام المتتالية التي تدربت فيها الطالبة (بتوقيت الرياض) وآخر سبعة أيام */
export async function studentStreak(db: ReturnType<typeof supabaseAdmin>, studentId: string) {
  const since = new Date(Date.now() - 120 * 86400000).toISOString();
  const [{ data: o }, { data: a }] = await Promise.all([
    db.from('item_outcomes').select('created_at').eq('student_id', studentId).gte('created_at', since),
    db.from('assessment_attempts').select('submitted_at').eq('student_id', studentId).gte('submitted_at', since),
  ]);
  const days = new Set<string>([...(o ?? []).map((x) => dayKey(x.created_at)), ...(a ?? []).filter((x) => x.submitted_at).map((x) => dayKey(x.submitted_at as string))]);
  const back = (n: number) => dayKey(new Date(Date.now() - n * 86400000));
  const today = days.has(back(0));
  let current = 0;
  for (let i = today ? 0 : 1; days.has(back(i)); i++) current++;
  let best = 0, run = 0;
  for (let i = 120; i >= 0; i--) { if (days.has(back(i))) { run++; best = Math.max(best, run); } else run = 0; }
  const week = Array.from({ length: 7 }, (_, k) => {
    const i = 6 - k, d = new Date(Date.now() - i * 86400000);
    return { key: back(i), active: days.has(back(i)), label: new Intl.DateTimeFormat('ar-SA', { weekday: 'short', timeZone: 'Asia/Riyadh' }).format(d), today: i === 0 };
  });
  return { current, best, today, week, totalDays: days.size };
}
