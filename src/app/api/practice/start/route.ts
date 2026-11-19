import type { NextRequest } from 'next/server';
import { withStudent } from '@/lib/api';
import { startSession } from '@/lib/practice-service';
export async function POST(req: NextRequest) {
  const { skillId } = await req.json().catch(() => ({}));
  return withStudent(async (sid) => ({ sessionId: await startSession(sid, String(skillId)) }));
}
