'use client';
import { useState, useTransition } from 'react';
import { IMPORT_COLUMNS, IMPORT_EXAMPLE, parseCSV, rowsToQuestions, type ImportedQuestion } from '@/lib/import-rows';
import { importQuestions } from '@/app/teacher/(panel)/library/actions';
import { COGNITIVE_AR, QTYPE_AR } from '@/lib/types';

/** استيراد أسئلة من Excel أو CSV: قراءة الملف في المتصفح، ثم شاشة مراجعة، ثم الحفظ */
export function ImportQuestions({ skills, models }: { skills: { id: string; code: string; name_ar: string }[]; models: { id: string; title: string }[] }) {
  const [ok, setOk] = useState<ImportedQuestion[]>([]);
  const [errors, setErrors] = useState<{ line: number; message: string }[]>([]);
  const [skillId, setSkillId] = useState('');
  const [target, setTarget] = useState('');
  const [publish, setPublish] = useState(true);
  const [msg, setMsg] = useState('');
  const [pending, start] = useTransition();

  async function onFile(file: File) {
    setMsg('');
    let rows: string[][];
    if (/\.(xlsx|xls)$/i.test(file.name)) {
      const mod = await import('read-excel-file/browser');
      const sheet = (await mod.default(file)) as unknown as unknown[][];
      rows = sheet.map((r) => r.map((c) => (c === null || c === undefined ? '' : String(c))));
    } else rows = parseCSV(await file.text());
    const res = rowsToQuestions(rows);
    setOk(res.ok); setErrors(res.errors);
  }

  const template = [IMPORT_COLUMNS.join(','), ...IMPORT_EXAMPLE.map((r) => r.map((c) => (/[,"\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(','))].join('\n');

  return (
    <section className="panel space-y-4">
      <h2 className="text-lg font-extrabold">استيراد أسئلة من Excel أو CSV</h2>
      <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-xs"><thead><tr>{IMPORT_COLUMNS.map((c) => <th key={c} className="border border-ink/10 bg-ink/5 p-2">{c}</th>)}</tr></thead>
        <tbody>{IMPORT_EXAMPLE.map((r, i) => <tr key={i}>{r.map((c, k) => <td key={k} className="border border-ink/10 p-2">{c}</td>)}</tr>)}</tbody></table></div>
      <p className="text-xs muted">الخيارات وخطوات الحل يُفصل بينها بالرمز |. الإجابة في الاختيار من متعدد حرف الخيار أو نصه. العملية المعرفية: معرفة أو تطبيق أو استدلال. الصعوبة من 1 إلى 3.</p>
      <div className="flex flex-wrap items-center gap-3">
        <a className="btn-ghost" download="قالب-الأسئلة.csv" href={`data:text/csv;charset=utf-8,${encodeURIComponent('﻿' + template)}`}>تنزيل القالب</a>
        <input type="file" accept=".csv,.xlsx,.xls,text/csv" className="field max-w-sm" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </div>
      {(ok.length > 0 || errors.length > 0) && (
        <div className="space-y-3">
          <p className="font-bold">المراجعة: {ok.length} سؤالًا صالحًا{errors.length ? `، و${errors.length} سطرًا يحتاج إلى تصحيح` : ''}</p>
          {errors.length > 0 && <ul className="rounded-xl bg-rose-300/20 p-3 text-sm text-rose-600">{errors.map((e) => <li key={e.line}>السطر {e.line}: {e.message}</li>)}</ul>}
          <div className="max-h-80 overflow-auto rounded-xl border border-ink/10">
            <table className="w-full text-sm"><thead className="sticky top-0 bg-white text-ink/60"><tr><th className="p-2 text-start">السؤال</th><th>النوع</th><th>العملية</th><th>الصعوبة</th><th>الإجابة</th></tr></thead>
              <tbody>{ok.map((q) => (
                <tr key={q.line} className="border-t border-ink/5"><td className="p-2" dir="auto">{q.prompt}</td><td className="text-center">{QTYPE_AR[q.qtype]}</td><td className="text-center">{COGNITIVE_AR[q.cognitive]}</td><td className="text-center">{q.difficulty}</td>
                  <td className="text-center">{q.qtype === 'mcq' ? q.payload.options.find((o) => o.id === q.payload.correct_answer.value)?.text : q.qtype === 'true_false' ? (q.payload.correct_answer.value ? 'صواب' : 'خطأ') : String(q.payload.correct_answer.value)}</td></tr>
              ))}</tbody></table>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <div><label className="label">المهارة</label><select value={skillId} onChange={(e) => setSkillId(e.target.value)} className="field"><option value="">—</option>{skills.map((s) => <option key={s.id} value={s.id}>{s.code} — {s.name_ar}</option>)}</select></div>
            <div><label className="label">الوجهة</label><select value={target} onChange={(e) => setTarget(e.target.value)} className="field"><option value="">بنك التدريب</option>{models.map((m) => <option key={m.id} value={m.id}>نموذج: {m.title}</option>)}</select></div>
            <label className="flex items-end gap-2 pb-3 text-sm"><input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} /> نشر مباشرة بعد المراجعة</label>
            <div className="flex items-end"><button disabled={pending || !ok.length || !skillId} onClick={() => start(async () => {
              const r = await importQuestions({ skillId, assessmentId: target || null, publish, items: ok });
              if ('error' in r && r.error) setMsg(r.error); else { setMsg(`حُفظ ${r.count} سؤالًا.`); setOk([]); setErrors([]); }
            })} className="btn-star w-full">حفظ {ok.length} سؤالًا</button></div>
          </div>
        </div>
      )}
      {msg && <p className="font-bold text-aqua-600">{msg}</p>}
    </section>
  );
}
