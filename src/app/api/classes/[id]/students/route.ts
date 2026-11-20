import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { isConfigured } from '@/lib/env';
import { classLabels } from '@/lib/names';

export const dynamic = 'force-dynamic';
/** قائمة أسماء طالبات الفصل لشاشة الدخول (الاسم الثلاثي فقط، دون أي بيانات أخرى) */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isConfigured()) return NextResponse.json([]);
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json([]);
  const { data } = await supabaseAdmin().from('students').select('id, full_name').eq('class_id', id).eq('is_active', true);
  return NextResponse.json(classLabels(data ?? []), { headers: { 'Cache-Control': 'no-store' } });
}
