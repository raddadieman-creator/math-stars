'use client';
import { useState } from 'react';
import { importStudents, changePassword } from '@/app/teacher/(panel)/actions';
import { normName } from '@/lib/names';

/** رفع أسماء الطلاب من Excel أو CSV: عمود «الاسم الثلاثي» وعمود «الفصل» اختياري */
export function ImportStudents({ classes }: { classes: { id: string; name: string }[] }) {
  const [cls, setCls] = useState(classes[0]?.id ?? '');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const onFile = async (f: File | undefined) => {
    if (!f) return; setBusy(true); setMsg('جارٍ القراءة…');
    try {
      let rows: unknown[][];
      if (f.name.toLowerCase().endsWith('.csv')) rows = (await f.text()).split(/\r?\n/).map((l) => l.split(/[,;\t]/));
      else { const { default: read } = await import('read-excel-file/browser'); rows = (await read(f)) as unknown as unknown[][]; }
      rows = rows.filter((r) => r && r.some((v) => String(v ?? '').trim()));
      const head = rows[0].map((v) => normName(v));
      let ni = head.findIndex((h) => h.includes('اسم')); const ci = head.findIndex((h) => h.includes('فصل') || h.includes('شعبه'));
      if (ni >= 0) rows = rows.slice(1); else ni = 0;
      const r = await importStudents(rows.map((x) => [String(x[ni] ?? ''), ci >= 0 ? String(x[ci] ?? '') : '']), cls);
      setMsg(r.error ?? `أُضيف ${r.added}، وتُرك ${r.skipped} (مكرر أو اسم غير مكتمل).`);
    } catch { setMsg('تعذرت قراءة الملف. تأكد أنه Excel ‎(.xlsx)‎ أو CSV.'); }
    setBusy(false);
  };
  return (
    <section className="panel">
      <h2 className="text-lg font-extrabold">رفع أسماء الطلاب من Excel</h2>
      <p className="mt-1 text-sm muted">عمود «الاسم الثلاثي»، وعمود «الفصل» اختياري. إذا لم يوجد عمود الفصل يُضاف الطلاب إلى الفصل المختار، وإذا كتب فصل غير موجود يُنشأ لك.</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <select className="field max-w-xs" value={cls} onChange={(e) => setCls(e.target.value)}>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <label className={`btn-ghost cursor-pointer ${busy ? 'opacity-50' : ''}`}>اختيار الملف<input type="file" accept=".xlsx,.csv" className="hidden" disabled={busy} onChange={(e) => onFile(e.target.files?.[0])} /></label>
      </div>
      {msg && <p className="mt-2 text-sm" role="status">{msg}</p>}
    </section>
  );
}

export function ChangePassword() {
  const [msg, setMsg] = useState('');
  return (
    <form action={async (f) => { const r = await changePassword(f); setMsg(r.error ?? 'تم تغيير كلمة المرور.'); }} className="panel grid gap-3 sm:grid-cols-3">
      <h2 className="text-lg font-extrabold sm:col-span-3">تغيير كلمة المرور</h2>
      <input name="current" type="password" dir="ltr" required className="field" placeholder="كلمة المرور الحالية" />
      <input name="next" type="password" dir="ltr" required minLength={6} className="field" placeholder="كلمة المرور الجديدة" />
      <button className="btn-star">حفظ</button>
      {msg && <p className="text-sm sm:col-span-3" role="status">{msg}</p>}
    </form>
  );
}
