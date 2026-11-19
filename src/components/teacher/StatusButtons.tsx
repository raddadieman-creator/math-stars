'use client';
import { useTransition } from 'react';
import { setStatus } from '@/app/teacher/(panel)/questions/actions';
export function StatusButtons({ id, status }: { id: string; status: string }) {
  const [p, start] = useTransition();
  return status === 'published'
    ? <button disabled={p} className="chip px-3 py-2" onClick={() => start(() => setStatus(id, 'draft'))}>إلغاء النشر</button>
    : <button disabled={p} className="chip bg-aqua-500/20 px-3 py-2 text-aqua-300" onClick={() => start(() => setStatus(id, 'published'))}>اعتماد ونشر</button>;
}
