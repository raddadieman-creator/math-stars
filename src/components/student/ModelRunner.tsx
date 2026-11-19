'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { PublicQuestion } from '@/lib/types';
import { QuestionView } from './QuestionView';
import { Suha } from '../Suha';
import { usePrefs } from '../Prefs';

type Item = PublicQuestion & { cognitive: string };
interface Result { newBadges?: string[]; score: number; total: number; byCog: Record<string, [number, number]>; review: { id: string; ok: boolean; answer: unknown; correctText: string; steps: string[]; intlPct: number | null }[] }

const has = (v: unknown) => v !== undefined && v !== null && v !== '';

/** نموذج تدريبي: سؤال في كل شاشة، تغذية راجعة فورية بعد الاختيار (صحيح/خطأ، همسة، شرح الحل)، ثم ملخص عند التسليم. */
type Check = { ok: boolean; correctText: string; steps: string[]; hint: string | null };
export function ModelRunner({ model, exam = false }: { model: { id: string; title: string; source: string | null; sourceUrl: string | null; items: Item[] }; exam?: boolean }) {
  const { play } = usePrefs();
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<Record<string, unknown>>({});
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [res, setRes] = useState<Result | null>(null);
  const [checks, setChecks] = useState<Record<string, Check>>({});
  const [hints, setHints] = useState<Record<string, boolean>>({});
  const it = model.items[i];
  const left = model.items.filter((x) => !has(ans[x.id])).length;

  async function checkItem(id: string, v: unknown) {
    const r = await fetch('/api/library/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assessmentId: model.id, questionId: id, answer: v }) });
    const j = await r.json();
    if (!r.ok) { setErr(j.error ?? 'تعذر التحقق'); return; }
    setChecks((c) => ({ ...c, [id]: j })); play(j.ok ? 'correct' : 'retry');
  }

  async function submit() {
    if (left && !confirm) { setConfirm(true); return; }
    setBusy(true);
    const r = await fetch('/api/library/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assessmentId: model.id, answers: Object.fromEntries(model.items.map((x) => [x.id, ans[x.id] ?? null])) }) });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) { setErr(j.error); return; }
    setRes(j); play(j.score / j.total >= 0.5 ? 'correct' : 'retry'); window.scrollTo(0, 0);
  }

  if (res) {
    const pct = Math.round((res.score / res.total) * 100);
    const label = (q: Item, v: unknown) => !has(v) ? '—' : q.qtype === 'true_false' ? (v ? 'صواب' : 'خطأ') : q.options.find((o) => o.id === v)?.text ?? String(v);
    return (
      <div className="mx-auto max-w-3xl">
        <div className="card-3d p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-6"><Suha size={90} mood={pct >= 50 ? 'correct' : 'reveal'} />
            <div><p className="text-sm muted">{model.title}</p><p className="text-4xl font-black">{res.score} من {res.total}</p><p className="text-lg font-bold text-aqua-600">{pct}%</p></div></div>
          {res.newBadges && res.newBadges.length > 0 && <div className="mt-4 rounded-2xl bg-star-300/40 p-4"><p className="font-extrabold">أوسمة جديدة</p><p className="mt-1">{res.newBadges.join('، ')}</p></div>}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {['المعرفة', 'التطبيق', 'الاستدلال'].filter((c) => res.byCog[c]).map((c) => (
              <div key={c} className="rounded-xl bg-ink/5 p-3"><p className="text-xs muted">{c}</p><p className="text-xl font-black">{res.byCog[c][0]} من {res.byCog[c][1]}</p></div>
            ))}
          </div>
        </div>
        <h2 className="mt-8 text-xl font-extrabold">مراجعة الإجابات</h2>
        <div className="mt-3 space-y-3">
          {model.items.map((q, k) => {
            const r = res.review.find((x) => x.id === q.id);
            if (!r) return null;
            return (
              <details key={q.id} className="panel">
                <summary className="cursor-pointer font-bold"><span className={r.ok ? 'text-aqua-600' : 'text-rose-600'}>{r.ok ? '✓' : '✗'}</span> {k + 1}. {q.prompt}</summary>
                <p className="mt-3 text-sm">إجابتك: <b>{label(q, ans[q.id])}</b> · الإجابة الصحيحة: <b className="text-aqua-600">{r.correctText}</b></p>
                <ol className="mt-2 list-decimal space-y-1 pr-5 text-sm leading-7">{r.steps.map((s, n) => <li key={n}>{s}</li>)}</ol>
                {r.intlPct !== null && <p className="mt-2 text-xs muted">نسبة الإجابة الصحيحة دوليًا: {r.intlPct}%</p>}
              </details>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">{!exam && <button onClick={() => location.reload()} className="btn-star">إعادة النموذج</button>}<Link href="/student/library" className="btn-ghost">المكتبة</Link></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm muted">{exam ? 'قياس لتحديد المستوى' : 'مكتبة النماذج'}</p><h1 className="text-2xl font-black">{model.title}</h1>{exam && <p className="mt-2 rounded-xl bg-sky2-400/10 p-3 text-sm">لا تظهر الإجابة الصحيحة أثناء القياس. تظهر النتيجة وشرح كل سؤال بعد التسليم، ولا يُعاد القياس.</p>}</div>
        <span className="chip">أُجيب عن {model.items.length - left} من {model.items.length}</span>
      </div>
      {model.source && <p className="mb-4 text-xs muted">{model.sourceUrl ? <a className="underline" href={model.sourceUrl} target="_blank" rel="noreferrer">{model.source}</a> : model.source}</p>}
      <div className="mb-5 flex flex-wrap gap-2">
        {model.items.map((x, k) => (
          <button key={x.id} onClick={() => setI(k)} className={`h-9 w-9 rounded-xl text-sm font-black ${k === i ? 'bg-ink text-white' : has(ans[x.id]) ? 'bg-aqua-300/60' : 'border border-ink/15 bg-white'}`}>{k + 1}</button>
        ))}
      </div>
      <div key={it.id} className="card-3d p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2"><span className="chip">السؤال {i + 1}</span><span className="chip">{it.cognitive}</span>{!checks[it.id] && !hints[it.id] && it.hint && <button onClick={() => setHints((h) => ({ ...h, [it.id]: true }))} className="chip mr-auto font-bold text-sky2-600">💡 همسة</button>}</div>
        <p className="mt-3 text-xl font-bold leading-[1.9]" dir="auto">{it.prompt}</p>
        {it.media_url && <img src={it.media_url} alt="الشكل المرافق للسؤال" className="mt-4 max-h-72 max-w-full rounded-xl border border-ink/10 bg-white p-2" />}
        <div className="mt-5"><QuestionView key={it.id} q={it} disabled={!!checks[it.id]} onChange={(v) => { setAns((a) => (a[it.id] === v ? a : { ...a, [it.id]: v })); if (!exam && has(v) && !checks[it.id] && (it.qtype === 'mcq' || it.qtype === 'true_false')) checkItem(it.id, v); }} /></div>
        {!checks[it.id] && hints[it.id] && it.hint && <div className="mt-4 rounded-2xl border border-sky2-400/40 bg-sky2-400/10 p-4"><p className="text-sm font-bold text-sky2-600">همسة</p><p className="mt-1" dir="auto">{it.hint}</p></div>}
        {!exam && !checks[it.id] && has(ans[it.id]) && it.qtype !== 'mcq' && it.qtype !== 'true_false' && <button onClick={() => checkItem(it.id, ans[it.id])} className="btn-star mt-4">تحقق من الإجابة</button>}
        {checks[it.id] && (() => { const c = checks[it.id]; return (
          <div className={`mt-5 rounded-2xl border-2 p-5 ${c.ok ? 'border-aqua-400 bg-aqua-300/15' : 'border-rose-400 bg-rose-300/10'}`} role="status">
            <p className={`text-xl font-extrabold ${c.ok ? 'text-aqua-600' : 'text-rose-600'}`}>{c.ok ? '✓ إجابة صحيحة' : '✗ إجابة غير صحيحة'}</p>
            {!c.ok && c.hint && <div className="mt-3 rounded-xl bg-sky2-400/10 p-3"><p className="text-sm font-bold text-sky2-600">همسة</p><p className="mt-1" dir="auto">{c.hint}</p></div>}
            {!c.ok && <p className="mt-3">الإجابة الصحيحة: <b className="text-aqua-600" dir="auto">{c.correctText}</b></p>}
            <p className="mt-3 font-bold">{c.ok ? 'لماذا هذه هي الإجابة الصحيحة؟' : 'شرح الإجابة الصحيحة'}</p>
            <ol className="mt-2 space-y-2">{c.steps.map((st, k) => <li key={k} className="flex gap-3 rounded-xl bg-white/70 p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-black text-white">{k + 1}</span><span className="leading-8" dir="auto">{st}</span></li>)}</ol>
          </div>); })()}
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-3">
        <div className="flex gap-2">
          <button disabled={i === 0} onClick={() => setI(i - 1)} className="btn-ghost">السابق</button>
          <button disabled={i === model.items.length - 1} onClick={() => setI(i + 1)} className="btn-ghost">التالي</button>
        </div>
        <button disabled={busy} onClick={submit} className="btn-star">{confirm && left ? `بقي ${left} دون إجابة · تأكيد التسليم` : 'تسليم النموذج'}</button>
      </div>
      {err && <p className="mt-3 text-rose-600">{err}</p>}
    </div>
  );
}
