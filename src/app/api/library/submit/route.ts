import type { NextRequest } from 'next/server';
import { withStudent } from '@/lib/api';
import { submitModel } from '@/lib/library-service';
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  return withStudent((sid) => submitModel(sid, String(b.assessmentId), (b.answers ?? {}) as Record<string, unknown>));
}
