import 'server-only';
import { redirect } from 'next/navigation';
import { supabaseServer } from './supabase/server';
import { isConfigured } from './env';

export interface Settings {
  platform_name: string;
  slogan: string;
  school_name: string | null;
  school_logo_url: string | null;
  principal_name: string | null;
  teacher_names: string[];
  vision: string | null;
  mission: string | null;
  goals: string[];
  timss_intro: string | null;
  timss_logo_url: string | null;
  program_weeks: number;
  program_start_date: string | null;
}

export const FALLBACK_SETTINGS: Settings = {
  platform_name: 'نجوم الرياضيات | Math Stars',
  slogan: 'أتعلم، أتحدى، أتقدم، وأتألق.',
  school_name: null, school_logo_url: null, principal_name: null, teacher_names: [],
  vision: null, mission: null, goals: [], timss_intro: null, timss_logo_url: null,
  program_weeks: 20, program_start_date: null,
};

export async function getSettings(): Promise<Settings> {
  if (!isConfigured()) return FALLBACK_SETTINGS;
  const sb = await supabaseServer();
  const { data } = await sb.from('school_settings').select('*').eq('id', 1).single();
  return (data as Settings) ?? FALLBACK_SETTINGS;
}

export async function getPublicStats() {
  if (!isConfigured()) return null;
  const sb = await supabaseServer();
  const { data } = await sb.rpc('public_stats');
  return data as null | { participants: number; answered_items: number; mastered_skills: number; published_questions: number; published_lessons: number };
}

export async function getLeaderboard() {
  if (!isConfigured()) return [];
  const sb = await supabaseServer();
  const { data } = await sb.rpc('leaderboard', { lim: 10 });
  return (data ?? []) as { nickname: string; avatar: string; stars: number }[];
}

export async function getDomains() {
  if (!isConfigured()) return [];
  const sb = await supabaseServer();
  const { data } = await sb
    .from('content_domains')
    .select('id, code, name_ar, name_en, target_percent, topic_areas(id, code, name_ar, name_en, target_percent, sort_order)')
    .order('sort_order');
  return (data ?? []) as {
    id: string; code: string; name_ar: string; name_en: string; target_percent: number | null;
    topic_areas: { id: string; code: string; name_ar: string; name_en: string; target_percent: number | null; sort_order: number }[];
  }[];
}

export interface StaffUser { id: string; full_name: string; role: 'teacher' | 'admin' }

export async function requireStaff(): Promise<{ staff: StaffUser; sb: Awaited<ReturnType<typeof supabaseServer>> }> {
  if (!isConfigured()) redirect('/setup');
  const sb = await supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) redirect('/teacher/login');
  const { data: staff } = await sb.from('staff').select('id, full_name, role').eq('id', auth.user.id).single();
  if (!staff) redirect('/teacher/login?e=nostaff');
  return { staff: staff as StaffUser, sb };
}
