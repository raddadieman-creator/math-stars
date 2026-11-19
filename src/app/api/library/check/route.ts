import type { NextRequest } from 'next/server';
import { withStudent } from '@/lib/api';
import { checkModelItem } from '@/lib/library-service';
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  return withStudent((sid) => checkModelItem(sid, String(b.assessmentId), String(b.questionId), b.answer));
}
