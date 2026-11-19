'use client';
import { useTransition } from 'react';
import { deleteFile, toggleFile, toggleModel } from '@/app/teacher/(panel)/library/actions';

export function ModelToggle({ id, open }: { id: string; open: boolean }) {
  const [p, start] = useTransition();
  return <button disabled={p} onClick={() => start(() => toggleModel(id, !open))} className={`chip px-3 py-2 ${open ? 'bg-aqua-300/40' : ''}`}>{open ? 'منشور · إخفاء' : 'مخفي · نشر'}</button>;
}

export function FileRowActions({ id, visible }: { id: string; visible: boolean }) {
  const [p, start] = useTransition();
  return (
    <span className="flex gap-2">
      <button disabled={p} onClick={() => start(() => toggleFile(id, !visible))} className="chip px-3 py-2">{visible ? 'إخفاء' : 'إظهار'}</button>
      <button disabled={p} onClick={() => { if (confirm('حذف الملف نهائيًا؟')) start(() => deleteFile(id)); }} className="chip px-3 py-2 text-rose-600">حذف</button>
    </span>
  );
}
