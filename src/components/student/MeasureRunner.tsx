'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { PublicQuestion } from '@/lib/types';
import { QuestionView } from './QuestionView';

type Item = PublicQuestion & { cognitive: string };
interface Result { score: number; total: number; byCog: Record<string, [number, number]>; review: { id: string; ok: boolean; answer: unknown; correctText: string; steps: string[] }[] }
const has = (v: unknown) => v !== undefined && v !== null && v !== '';

/** القياس القبلي/البعدي على نمط اختبارات القدرات والتحصيلي:
 *  لا انتقال إلى السؤال التالي قبل الإجابة، قائمة أسئلة بحالاتها، تمييز للمراجعة،
 *  وشاشة مراجعة قبل التسليم، ولا تسليم قبل الإجابة عن جميع الأسئلة. */
export function MeasureRunner({ model }: { model: { id: string; title: string; items: Item[] } }) {
  const n = model.items.length;
  const [i, setI] = useState(0);
  const [max, setMax] = useState(0);
  const [ans, setAns] = useState<Record<string, unknown>>({});
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [review, setReview] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [res, setRes] = useState<Result | null>(null);
  const it = model.items[i];
  const done = model.items.filter((x) => has(ans[x.id])).length;
  const unanswered = n - done;
  const go = (k: number) => { setReview(false); setI(k); setMax((m) => Math.max(m, k)); window.scrollTo(0, 0); };
  const canGo = (k: number) => k <= max || (k === max + 1 && has(ans[model.items[max].id]));
  const toggleFlag = () => setFlags((f) => { const g = new Set(f); if (g.has(it.id)) g.delete(it.id); else g.add(it.id); return g; });

  async function submit() {
    if (unanswered) return;
    if (!confirm) { setConfirm(true); return; }
    setBusy(true);
    const r = await fetch('/api/library/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assessmentId: model.id, answers: ans }) });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) { setErr(j.error ?? 'تعذر التسليم'); return; }
    setRes(j); window.scrollTo(0, 0);
  }

  if (res) {
    const pct = Math.round((res.score / Math.max(1, res.total)) * 100);
    return (
      <div className="mx-auto max-w-3xl">
        <div className="card-3d p-6 md:p-8"><p className="text-sm muted">نتيجة {model.title}</p><p className="text-4xl font-black">{res.score} من {res.total} <span className="text-xl text-aqua-600">{pct}٪</span></p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">{Object.entries(res.byCog).map(([k, [a, t]]) => <div key={k} className="rounded-xl bg-ink/5 p-3"><p className="text-xs muted">{k}</p><p className="text-xl font-black">{a} من {t}</p></div>)}</div></div>
        <h2 className="mt-8 text-xl font-extrabold">مراجعة الأسئلة</h2>
        <div className="mt-3 space-y-3">{model.items.map((q, k) => { const r = res.review.find((x) => x.id === q.id); if (!r) return null; return (
          <details key={q.id} className="panel"><summary className="cursor-pointer font-bold"><span className={r.ok ? 'text-aqua-600' : 'text-rose-600'}>{r.ok ? '✓' : '✗'}</span> {k + 1}. {q.prompt}</summary>
            <p className="mt-3 text-sm">الإجابة الصحيحة: <b className="text-aqua-600">{r.correctText}</b></p>
            <ol className="mt-2 list-decimal space-y-1 pr-5 text-sm leading-7">{r.steps.map((s, j) => <li key={j}>{s}</li>)}</ol></details>); })}</div>
        <Link href="/student" className="btn-star mt-6">صفحتي</Link>
      </div>
    );
  }

  if (review) {
    const flagged = model.items.filter((x) => flags.has(x.id)).length;
    return (
      <div className="card-3d mx-auto max-w-4xl p-6 md:p-8">
        <h1 className="text-2xl font-black">مراجعة الإجابات قبل التسليم</h1>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-ink/5 p-3"><p className="text-xs muted">مُجاب</p><p className="text-2xl font-black">{done}</p></div>
          <div className={`rounded-xl p-3 ${unanswered ? 'bg-rose-300/20' : 'bg-ink/5'}`}><p className="text-xs muted">لم يُجب</p><p className="text-2xl font-black">{unanswered}</p></div>
          <div className={`rounded-xl p-3 ${flagged ? 'bg-star-300/30' : 'bg-ink/5'}`}><p className="text-xs muted">مميّز للمراجعة</p><p className="text-2xl font-black">{flagged}</p></div>
        </div>
        <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-10">{model.items.map((x, k) => (
          <button key={x.id} onClick={() => go(k)} disabled={!canGo(k)} className={`relative h-11 rounded-lg text-sm font-bold disabled:opacity-40 ${!has(ans[x.id]) ? 'border-2 border-rose-400 bg-white text-rose-600' : flags.has(x.id) ? 'border-2 border-star-500 bg-star-300/30' : 'bg-ink text-white'}`}>{k + 1}{flags.has(x.id) && <span className="absolute -left-1.5 -top-1.5 text-xs">🚩</span>}</button>))}</div>
        <p className="mt-4 text-sm muted">{unanswered ? 'يجب الإجابة عن جميع الأسئلة قبل التسليم. اضغط رقم السؤال للعودة إليه.' : flagged ? 'جميع الأسئلة مُجابة. يمكن العودة إلى الأسئلة المميّزة قبل التسليم.' : 'جميع الأسئلة مُجابة.'}</p>
        <div className="mt-5 flex flex-wrap gap-3"><button onClick={() => setReview(false)} className="btn-ghost">العودة إلى الأسئلة</button>
          <button onClick={submit} disabled={busy || unanswered > 0} className="btn-star disabled:opacity-50">{confirm ? 'تأكيد التسليم النهائي' : 'تسليم القياس'}</button></div>
        {err && <p className="mt-3 text-rose-600">{err}</p>}
      </div>
    );
  }

  const answered = has(ans[it.id]);
  return (
    <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_250px]">
      <div>
        <div className="mb-3"><p className="text-sm muted">{model.title}</p><h1 className="text-xl font-black">السؤال {i + 1} من {n}</h1></div>
        <div className="card-3d p-6 md:p-8">
          <p className="text-xl font-bold leading-[1.9]" dir="auto">{it.prompt}</p>
          {it.media_url && <img src={it.media_url} alt="الشكل المرافق للسؤال" className="mt-4 max-h-72 max-w-full rounded-xl border border-ink/10 bg-white p-2" />}
          <div className="mt-5"><QuestionView key={it.id} q={it} disabled={busy} onChange={(v) => setAns((a) => (a[it.id] === v ? a : { ...a, [it.id]: v }))} /></div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button disabled={i === 0} onClick={() => go(i - 1)} className="btn-ghost">السابق</button>
          <button onClick={toggleFlag} className={flags.has(it.id) ? 'btn-star' : 'btn-ghost'}>{flags.has(it.id) ? '🚩 مميّز للمراجعة' : 'تمييز للمراجعة'}</button>
          {i < n - 1 ? <button disabled={!answered} onClick={() => go(i + 1)} className="btn-star disabled:opacity-50">التالي</button>
            : <button disabled={!answered} onClick={() => setReview(true)} className="btn-star disabled:opacity-50">مراجعة الإجابات</button>}
        </div>
        {!answered && <p className="mt-2 text-sm muted">اختر إجابة للانتقال إلى السؤال التالي.</p>}
      </div>
      <aside className="panel h-fit">
        <p className="font-extrabold">قائمة الأسئلة</p><p className="mt-1 text-sm muted">أُجيب عن {done} من {n}</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full bg-aqua-400" style={{ width: `${(done / n) * 100}%` }} /></div>
        <div className="mt-4 grid grid-cols-5 gap-2">{model.items.map((x, k) => (
          <button key={x.id} onClick={() => go(k)} disabled={!canGo(k)} className={`relative h-10 rounded-lg text-sm font-bold disabled:opacity-40 ${k === i ? 'border-2 border-ink bg-white' : has(ans[x.id]) ? 'bg-ink text-white' : 'border border-ink/20 bg-white'}`}>{k + 1}{flags.has(x.id) && <span className="absolute -left-1.5 -top-1.5 text-xs">🚩</span>}</button>))}</div>
        <div className="mt-4 space-y-1 text-xs muted"><p>■ مُجاب · □ لم يُجب · 🚩 مميّز للمراجعة</p></div>
        <button onClick={() => setReview(true)} className="btn-ghost mt-4 w-full">شاشة المراجعة</button>
      </aside>
    </div>
  );
}
