'use client';
import { useEffect, useState } from 'react';
import type { PublicQuestion } from '@/lib/types';

/** يعرض السؤال حسب نوعه ويعيد الإجابة عبر onChange (null = لم تكتمل الإجابة) */
export function QuestionView({ q, disabled, onChange }: { q: PublicQuestion; disabled: boolean; onChange: (a: unknown) => void }) {
  const [val, setVal] = useState<unknown>(null);
  useEffect(() => {
    if (q.qtype === 'ordering') setVal(q.options.map((o) => o.id));
    else setVal(null);
  }, [q.id, q.qtype, q.options]);
  useEffect(() => {
    if (q.qtype === 'matching' || q.qtype === 'drag_drop') {
      const lefts = q.options.filter((o) => !o.id.startsWith('r:'));
      const p = (val as Record<string, string>) ?? {};
      onChange(lefts.every((l) => p[l.id]) ? p : null);
    } else onChange(val);
  }, [val, onChange, q.qtype, q.options]);

  if (q.qtype === 'mcq' || q.qtype === 'image_mcq') {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {q.options.map((o) => (
          <button key={o.id} disabled={disabled} onClick={() => setVal(o.id)}
            className={`card-3d min-h-[64px] px-5 py-4 text-start text-xl font-bold transition ${val === o.id ? 'ring-2 ring-star-400 bg-star-400/15' : 'hover:bg-ink/5'}`}>
            {o.image && <img src={o.image} alt="" className="mb-2 max-h-32 rounded-lg" />}
            <span dir="auto">{o.text}</span>
          </button>
        ))}
      </div>
    );
  }
  if (q.qtype === 'true_false') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[{ v: true, t: 'صواب ✓' }, { v: false, t: 'خطأ ✗' }].map((o) => (
          <button key={String(o.v)} disabled={disabled} onClick={() => setVal(o.v)}
            className={`card-3d min-h-[72px] text-2xl font-black ${val === o.v ? 'ring-2 ring-star-400 bg-star-400/15' : 'hover:bg-ink/5'}`}>{o.t}</button>
        ))}
      </div>
    );
  }
  if (q.qtype === 'numeric') {
    return (
      <input inputMode="decimal" dir="ltr" disabled={disabled} placeholder="الإجابة"
        className="field max-w-xs text-center text-3xl font-black" value={(val as string) ?? ''}
        onChange={(e) => setVal(e.target.value.trim() === '' ? null : e.target.value)} />
    );
  }
  if (q.qtype === 'ordering') {
    const order = (val as string[]) ?? [];
    const move = (i: number, d: number) => {
      const j = i + d; if (j < 0 || j >= order.length) return;
      const n = [...order]; [n[i], n[j]] = [n[j], n[i]]; setVal(n);
    };
    return (
      <ol className="space-y-2">
        {order.map((id, i) => (
          <li key={id} className="card-3d flex items-center justify-between px-4 py-3 text-lg font-bold">
            <span>{i + 1}. <span dir="auto">{q.options.find((o) => o.id === id)?.text}</span></span>
            <span className="flex gap-2">
              <button disabled={disabled} onClick={() => move(i, -1)} className="chip" aria-label="أعلى">▲</button>
              <button disabled={disabled} onClick={() => move(i, 1)} className="chip" aria-label="أسفل">▼</button>
            </span>
          </li>
        ))}
      </ol>
    );
  }
  // المطابقة والسحب والإفلات: كل خيار له "left" ويُطابق مع أحد عناصر "right"
  const lefts = q.options.filter((o) => !o.id.startsWith('r:'));
  const rights = q.options.filter((o) => o.id.startsWith('r:'));
  const pairs = (val as Record<string, string>) ?? {};
  return (
    <div className="space-y-3">
      {lefts.map((l) => (
        <div key={l.id} className="card-3d flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="text-lg font-bold" dir="auto">{l.text}</span>
          <select disabled={disabled} className="field max-w-[220px]" value={pairs[l.id] ?? ''}
            onChange={(e) => {
              setVal({ ...pairs, [l.id]: e.target.value });
            }}>
            <option value="">—</option>
            {rights.map((r) => <option key={r.id} value={r.id}>{r.text}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}
