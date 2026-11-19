import type { NextRequest } from 'next/server';
import { withStudent } from '@/lib/api';
import { nextQuestion } from '@/lib/practice-service';
export async function POST(req: NextRequest) {
  const { sessionId, similarTo } = await req.json().catch(() => ({}));
  return withStudent((sid) => nextQuestion(sid, String(sessionId), similarTo ? String(similarTo) : undefined));
}
