import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { isConfigured } from '@/lib/env';

export const dynamic = 'force-dynamic';
/** أسماء الفصول فقط لشاشة دخول الطالب */
export async function GET() {
  if (!isConfigured()) return NextResponse.json([]);
  const { data } = await supabaseAdmin().from('classes').select('id, name').order('name');
  return NextResponse.json(data ?? []);
}
