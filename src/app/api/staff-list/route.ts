import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { isConfigured } from '@/lib/env';

export const dynamic = 'force-dynamic';
/** أسماء المعلمين والإدارة فقط لشاشة دخول المعلم (دون البريد) */
export async function GET() {
  if (!isConfigured()) return NextResponse.json([]);
  const { data } = await supabaseAdmin().from('staff').select('id, full_name').order('full_name');
  return NextResponse.json(data ?? []);
}
