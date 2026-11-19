import type { NextRequest } from 'next/server';
import { withStudent } from '@/lib/api';
import { submitAnswer } from '@/lib/practice-service';
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  return withStudent((sid) => submitAnswer(sid, String(b.sessionId), String(b.questionId), b.answer, Number(b.timeMs) || 0, b.hintUsed === true));
}
