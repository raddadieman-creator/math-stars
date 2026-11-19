import type { NextRequest } from 'next/server';
import { withStudent } from '@/lib/api';
import { finishSession } from '@/lib/practice-service';
export async function POST(req: NextRequest) {
  const { sessionId } = await req.json().catch(() => ({}));
  return withStudent((sid) => finishSession(sid, String(sessionId)));
}
