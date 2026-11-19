'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { PublicQuestion } from '@/lib/types';
import { STATUS_AR } from '@/lib/types';
import { QuestionView } from './QuestionView';
import { Suha } from '../Suha';
import { usePrefs } from '../Prefs';

const SESSION_LENGTH = 8;

type Feedback =
  | null
  | { kind: 'correct'; message: string; explanation: string | null; starsEarned: number; masteryStatus: keyof typeof STATUS_AR; level: number }
  | { kind: 'hint'; message: string; hint: string; triesLeft: number }
  | { kind: 'reveal'; correctText: string; steps: string[]; explanation: string | null; remedial: string | null; masteryStatus: keyof typeof STATUS_AR; level: number };

interface Summary { items: number; independent: number; withHint: number; revealed: number; bonusStars: number; newBadges: string[] }

async function post<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error ?? 'تعذر الاتصال');
  return j as T;
}

function hasAnswer(a: unknown) {
  if (a === null || a === undefined || a === '') return false;
  if (typeof a === 'object' && !Array.isArray(a)) return Object.values(a as object).every(Boolean) && Object.keys(a as object).length > 0;
  return true;
}

export function PracticeRunner({ skillId, skillName }: { skillId: string; skillName: string }) {
  const { play } = usePrefs();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [q, setQ] = useState<PublicQuestion | null>(null);
  const [answer, setAnswer] = useState<unknown>(null);
  const [fb, setFb] = useState<Feedback>(null);
  const [count, setCount] = useState(0);
  const [stars, setStars] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [stepShown, setStepShown] = useState(0);
  const t0 = useRef(Date.now());
  const started = useRef(false);

  const load = useCallback(async (sid: string, similarTo?: string) => {
    setBusy(true); setFb(null); setAnswer(null); setStepShown(0);
    try {
      const r = await post<{ done: boolean; question?: PublicQuestion }>('/api/practice/next', { sessionId: sid, similarTo });
      if (r.done || !r.question) await finish(sid);
      else { setQ(r.question); t0.current = Date.now(); }
    } catch (e) { setError((e as Error).message); }
    setBusy(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (started.current) return; started.current = true;
    post<{ sessionId: string }>('/api/practice/start', { skillId })
      .then((r) => { setSessionId(r.sessionId); return load(r.sessionId); })
      .catch((e) => setError(e.message));
  }, [skillId, load]);

  async function finish(sid = sessionId!) {
    try { setSummary(await post<Summary>('/api/practice/finish', { sessionId: sid })); } catch (e) { setError((e as Error).message); }
  }

  async function check() {
    if (!sessionId || !q) return;
    setBusy(true);
    try {
      const r = await post<NonNullable<Feedback> & { starsEarned?: number }>('/api/practice/answer', { sessionId, questionId: q.id, answer, timeMs: Date.now() - t0.current });
      setFb(r);
      if (r.kind === 'correct') { play('correct'); setStars((s) => s + (r.starsEarned ?? 0)); setCount((c) => c + 1); }
      else if (r.kind === 'reveal') { play('retry'); setCount((c) => c + 1); }
      else { play('retry'); t0.current = Date.now(); }
    } catch (e) { setError((e as Error).message); }
    setBusy(false);
  }

  useEffect(() => {
    if (fb?.kind !== 'reveal' || stepShown >= fb.steps.length) return;
    const t = setTimeout(() => setStepShown((n) => n + 1), 1100);
    return () => clearTimeout(t);
  }, [fb, stepShown]);

  const next = (similar = false) => {
    if (!sessionId) return;
    if (count >= SESSION_LENGTH && !similar) finish();
    else load(sessionId, similar ? q?.id : undefined);
  };

  if (error) return <div className="card-3d p-6 text-center"><p className="text-rose-600">{error}</p><Link href="/student" className="btn-ghost mt-4">العودة</Link></div>;

  if (summary) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-3d mx-auto max-w-xl p-8 text-center">
        <Suha size={110} mood="cheer" className="mx-auto" />
        <h2 className="mt-3 text-3xl font-black">أنهيتِ الجلسة</h2>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-ink/5 p-3"><p className="text-xs muted">من المحاولة الأولى</p><p className="text-2xl font-black text-aqua-600">{summary.independent}</p></div>
          <div className="rounded-xl bg-ink/5 p-3"><p className="text-xs muted">بعد تلميح</p><p className="text-2xl font-black text-sky2-600">{summary.withHint}</p></div>
          <div className="rounded-xl bg-ink/5 p-3"><p className="text-xs muted">تعلمتِ من الحل</p><p className="text-2xl font-black text-rose-600">{summary.revealed}</p></div>
        </div>
        <p className="mt-5 text-lg">نجوم هذه الجلسة: <b className="text-star-600">★ {stars + summary.bonusStars}</b></p>
        {summary.newBadges.length > 0 && <p className="mt-2 text-star-600">حصلتِ على وسام جديد! تجدينه في صفحتكِ.</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => location.reload()} className="btn-star">تدربي مرة أخرى</button>
          <Link href="/student" className="btn-ghost">صفحتي</Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div><p className="text-sm muted">تدريب</p><h1 className="text-2xl font-black">{skillName}</h1></div>
        <div className="flex items-center gap-3">
          <span className="chip">سؤال {Math.min(count + (fb && fb.kind !== 'hint' ? 0 : 1), SESSION_LENGTH)} من {SESSION_LENGTH}</span>
          <span className="chip text-star-600">★ {stars}</span>
        </div>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full bg-star-400 transition-all" style={{ width: `${(count / SESSION_LENGTH) * 100}%` }} /></div>

      <AnimatePresence mode="wait">
        {q && (
          <motion.div key={q.id} initial={{ opacity: 0, rotateX: -12, y: 20 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }} className="card-3d p-6 md:p-8" style={{ transformPerspective: 900 }}>
            <div className="mb-2 flex gap-2"><span className="chip">المستوى {q.difficulty}</span></div>
            <p className="text-2xl font-bold leading-[1.9]" dir="auto">{q.prompt}</p>
            {q.media_url && <img src={q.media_url} alt="" className="mt-4 max-h-72 rounded-xl bg-white p-2" />}
            <div className="mt-6">
              <QuestionView q={q} disabled={busy || (fb !== null && fb.kind !== 'hint')} onChange={setAnswer} />
            </div>
            {(!fb || fb.kind === 'hint') && (
              <button onClick={check} disabled={busy || !hasAnswer(answer)} className="btn-star mt-6 w-full sm:w-auto">تحقق من الإجابة</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fb && (
          <motion.div key={fb.kind + (q?.id ?? '')} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5" role="status" aria-live="polite">
            {fb.kind === 'correct' && (
              <div className="card-3d flex flex-col gap-3 border-aqua-400/40 p-6 sm:flex-row sm:items-center">
                <Suha size={70} mood="cheer" />
                <div className="flex-1">
                  <p className="text-xl font-extrabold text-aqua-600">{fb.message}</p>
                  {fb.starsEarned > 0 && <motion.p initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-star-600">+{fb.starsEarned} ★</motion.p>}
                  {fb.explanation && <p className="mt-1 muted">{fb.explanation}</p>}
                </div>
                <button onClick={() => next()} className="btn-aqua">التالي</button>
              </div>
            )}
            {fb.kind === 'hint' && (
              <div className="card-3d flex gap-4 border-sky2-400/40 p-6">
                <Suha size={64} mood="think" />
                <div><p className="text-lg font-bold">{fb.message}</p><p className="mt-2 rounded-xl bg-sky2-400/10 p-3 text-sky2-600">💡 {fb.hint}</p></div>
              </div>
            )}
            {fb.kind === 'reveal' && (
              <div className="card-3d border-rose-400/40 p-6">
                <div className="flex gap-4"><Suha size={64} mood="think" /><div>
                  <p className="text-lg font-bold">لنرَ الحل معًا خطوة بخطوة</p>
                  <p className="mt-1">الإجابة الصحيحة: <b className="text-star-600" dir="auto">{fb.correctText}</b></p>
                </div></div>
                <ol className="mt-4 space-y-2">
                  {fb.steps.slice(0, stepShown).map((s, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 rounded-xl bg-ink/5 p-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-400 font-black text-night-950">{i + 1}</span>
                      <span className="text-lg" dir="auto">{s}</span>
                    </motion.li>
                  ))}
                </ol>
                {stepShown >= fb.steps.length && fb.explanation && <p className="mt-3 muted">{fb.explanation}</p>}
                {stepShown >= fb.steps.length && fb.remedial && <p className="mt-3 rounded-xl bg-ink/5 p-3 text-sm">نشاط مقترح: {fb.remedial}</p>}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={() => next(true)} className="btn-rose">جرّبي سؤالًا مشابهًا</button>
                  <button onClick={() => next()} className="btn-ghost">التالي</button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 text-center">
        <button onClick={() => finish()} disabled={!sessionId || count === 0} className="chip hover:bg-ink/5">إنهاء الجلسة الآن</button>
      </div>
    </div>
  );
}
