import { NextResponse, type NextRequest } from 'next/server';
import { getStudentSession } from '@/lib/student-session';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { isConfigured } from '@/lib/env';
import { GAMES } from '@/lib/games';

const DAILY_CAP = 10;
/** نجوم الألعاب للطالبة المسجلة: نجمة لكل 3 إجابات صحيحة، بحد 3 نجوم للعبة و10 نجوم في اليوم */
export async function POST(req: NextRequest) {
  const s = isConfigured() ? await getStudentSession() : null;
  if (!s) return NextResponse.json({ stars: 0, guest: true });
  const b = await req.json().catch(() => ({}));
  const game = String(b.game ?? ''), correct = Math.max(0, Math.min(60, Number(b.correct) || 0));
  if (!GAMES.some((g) => g.key === game)) return NextResponse.json({ stars: 0 });
  const db = supabaseAdmin();
  const since = new Date(); since.setUTCHours(-3, 0, 0, 0); // بداية اليوم بتوقيت الرياض تقريبًا
  const { data: today } = await db.from('star_ledger').select('amount').eq('student_id', s.sid).like('reason', 'game:%').gte('created_at', since.toISOString());
  const used = (today ?? []).reduce((a, x) => a + x.amount, 0);
  const stars = Math.max(0, Math.min(3, Math.floor(correct / 3), DAILY_CAP - used));
  if (stars > 0) await db.from('star_ledger').insert({ student_id: s.sid, amount: stars, reason: `game:${game}` });
  return NextResponse.json({ stars, capped: used + stars >= DAILY_CAP });
}
