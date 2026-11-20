import { NextResponse, type NextRequest } from 'next/server';
import { pick } from '@/lib/game-pool';
import type { DomKey } from '@/lib/games';

export const dynamic = 'force-dynamic';
/** أسئلة الألعاب من الكراسة (دون أسئلة القياس القبلي والبعدي) */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const dom = (sp.get('dom') ?? 'all') as DomKey | 'all';
  const d = Number(sp.get('d')) || undefined;
  const n = Math.min(30, Math.max(1, Number(sp.get('n')) || 10));
  return NextResponse.json(pick({ dom, d, n }), { headers: { 'Cache-Control': 'no-store' } });
}
