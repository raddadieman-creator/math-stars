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

/** نموذج اختبار: سؤال في كل شاشة، تنقل حر بين الأسئلة، تسليم ثم مراجعة الحل. لا تلميحات أثناء النموذج. */
export function ModelRunner({ model }: { model: { id: string; title: string; source: string | null; sourceUrl: string | null; items: Item[] } }) {
  const { play } = usePrefs();
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<Record<string, unknown>>({});
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [res, setRes] = useState<Result | null>(null);
  const it = model.items[i];
  const left = model.items.filter((x) => !has(ans[x.id])).length;

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
        <div className="mt-6 flex flex-wrap gap-3"><button onClick={() => location.reload()} className="btn-star">إعادة النموذج</button><Link href="/student/library" className="btn-ghost">المكتبة</Link></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm muted">مكتبة النماذج</p><h1 className="text-2xl font-black">{model.title}</h1></div>
        <span className="chip">أُجيب عن {model.items.length - left} من {model.items.length}</span>
      </div>
      {model.source && <p className="mb-4 text-xs muted">{model.sourceUrl ? <a className="underline" href={model.sourceUrl} target="_blank" rel="noreferrer">{model.source}</a> : model.source}</p>}
      <div className="mb-5 flex flex-wrap gap-2">
        {model.items.map((x, k) => (
          <button key={x.id} onClick={() => setI(k)} className={`h-9 w-9 rounded-xl text-sm font-black ${k === i ? 'bg-ink text-white' : has(ans[x.id]) ? 'bg-aqua-300/60' : 'border border-ink/15 bg-white'}`}>{k + 1}</button>
        ))}
      </div>
      <div key={it.id} className="card-3d p-6 md:p-8">
        <div className="flex flex-wrap gap-2"><span className="chip">السؤال {i + 1}</span><span className="chip">{it.cognitive}</span></div>
        <p className="mt-3 text-xl font-bold leading-[1.9]" dir="auto">{it.prompt}</p>
        <div className="mt-5"><QuestionView q={it} disabled={false} onChange={(v) => setAns((a) => (a[it.id] === v ? a : { ...a, [it.id]: v }))} /></div>
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
