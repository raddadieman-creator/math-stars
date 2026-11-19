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
