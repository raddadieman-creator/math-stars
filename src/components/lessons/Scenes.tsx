'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Scene } from '@/lib/scenario';
import { Suha } from '../Suha';

const fmt = (v: number, paren: boolean) => (v < 0 ? (paren ? `(−${-v})` : `−${-v}`) : String(v));
const COLORS = ['#ffd04d', '#3fdcc8', '#ff86b5', '#6aa8ff', '#b892ff', '#ff9f5a', '#7ff0e0', '#ffe08a'];

/** d = زمن التأخير الأساسي لكل عنصر؛ يصبح صفرًا في الوضع المبسط */
export function SceneView({ scene, d, onAnswered }: { scene: Scene; d: number; onAnswered?: () => void }) {
  switch (scene.template) {
    case 'title':
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <motion.div initial={{ scale: 0.4, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ duration: d ? 0.8 : 0 }}><Suha size={110} mood="correct" /></motion.div>
          <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: d * 0.6 }} className="text-4xl font-black md:text-5xl">{scene.title}</motion.h2>
          {scene.data.subtitle && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 1.2 }} className="text-xl text-star-600">{scene.data.subtitle}</motion.p>}
        </div>
      );
    case 'cycle': {
      const n = scene.data.stages.length;
      const R = 140;
      return (
        <svg viewBox="-220 -200 440 400" className="h-full w-full">
          <defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2b2457" /></marker></defs>
          <circle r={R} fill="none" stroke="rgba(43,36,87,.15)" strokeWidth="2" strokeDasharray="6 10" />
          {scene.data.stages.map((st, i) => {
            const a = (-Math.PI / 2) - (i * 2 * Math.PI) / n; // عكس عقارب الساعة يناسب القراءة من اليمين
            const x = R * Math.cos(a), y = R * Math.sin(a);
            const gap = Math.min(0.42, Math.PI / n * 0.75);
            const p1 = [R * Math.cos(a - gap), R * Math.sin(a - gap)];
            const an = a - (2 * Math.PI) / n;
            const p2 = [R * Math.cos(an + gap), R * Math.sin(an + gap)];
            return (
              <g key={i}>
                <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: d * (i + 0.7), duration: d ? 0.6 : 0 }}
                  d={`M${p1[0]} ${p1[1]} A ${R} ${R} 0 0 0 ${p2[0]} ${p2[1]}`}
                  fill="none" stroke="#2b2457" strokeWidth="3" markerEnd="url(#arr)" />
                <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: d * i, type: 'spring' }} style={{ originX: `${x}px`, originY: `${y}px` }}>
                  <circle cx={x} cy={y} r="46" fill={COLORS[i % COLORS.length]} />
                  <text x={x} y={y + 6} textAnchor="middle" fontSize="17" fontWeight="800" fill="#141244">{st.length > 12 ? st.slice(0, 12) + '…' : st}</text>
                </motion.g>
              </g>
            );
          })}
        </svg>
      );
    }
    case 'steps':
      return (
        <ol className="mx-auto flex h-full max-w-2xl flex-col justify-center gap-3">
          {scene.data.steps.map((s, i) => (
            <motion.li key={i} initial={{ x: 60, opacity: 0, rotateY: -30 }} animate={{ x: 0, opacity: 1, rotateY: 0 }} transition={{ delay: d * i * 1.2 }}
              className="card-3d flex items-center gap-4 p-4 text-xl font-bold">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-black text-night-950" style={{ background: COLORS[i % COLORS.length] }}>{i + 1}</span>
              <span dir="auto">{s}</span>
            </motion.li>
          ))}
        </ol>
      );
    case 'number_line': {
      const pts = scene.data.moves.reduce<number[]>((acc, m) => [...acc, acc[acc.length - 1] + m], [scene.data.start]);
      const lo = Math.min(...pts, 0) - 2, hi = Math.max(...pts, 0) + 2;
      const W = 600, X = (v: number) => -W / 2 + ((v - lo) / (hi - lo)) * W;
      return (
        <div className="flex h-full flex-col items-center justify-center">
        {/* المعادلة تُكتب من اليمين إلى اليسار كما في الكتاب، مع إبقاء كل عدد سالب متماسكًا */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * (pts.length * 1.6 + 0.5) }} dir="rtl" className="flex gap-3 text-3xl font-black">
          {[fmt(scene.data.start, true), ...scene.data.moves.flatMap((m) => ['+', fmt(m, true)]), '=', fmt(pts[pts.length - 1], false)].map((t, k) => <span key={k} dir="ltr">{t}</span>)}
        </motion.div>
        <svg viewBox="-330 -110 660 200" className="w-full flex-1" style={{ direction: 'ltr' }}>
          <line x1={-W / 2 - 10} x2={W / 2 + 10} y1="40" y2="40" stroke="#2b2457" strokeWidth="3" />
          {Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).map((v) => (
            <g key={v}><line x1={X(v)} x2={X(v)} y1="32" y2="48" stroke="#2b2457" strokeWidth={v === 0 ? 3 : 1.5} />
              {(hi - lo <= 24 || v % 2 === 0) && <text x={X(v)} y="72" textAnchor="middle" fontSize="15" fill={v === 0 ? '#d98e04' : '#2b2457'} fontWeight="700">{fmt(v, false)}</text>}</g>
          ))}
          {scene.data.moves.map((m, i) => {
            const a = X(pts[i]), b = X(pts[i + 1]);
            return (
              <g key={i}>
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: d * (i * 1.6 + 0.5), duration: d ? 1 : 0 }}
                  d={`M${a} 30 Q ${(a + b) / 2} ${-60 - i * 10} ${b} 30`} fill="none" stroke={m >= 0 ? '#3fdcc8' : '#ff86b5'} strokeWidth="4" />
                <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * (i * 1.6 + 1) }} x={(a + b) / 2} y={-30 - i * 10} textAnchor="middle" fontSize="20" fontWeight="900" fill={m >= 0 ? '#3fdcc8' : '#ff86b5'}>{m >= 0 ? `+${m}` : fmt(m, false)}</motion.text>
              </g>
            );
          })}
          <motion.circle r="12" cy="40" fill="#ffd04d" stroke="#141244" strokeWidth="3"
            initial={{ cx: X(pts[0]) }} animate={{ cx: pts.map(X) }} transition={{ delay: d * 0.5, duration: d ? pts.length * 1.6 : 0, times: pts.map((_, i) => i / Math.max(1, pts.length - 1)) }} />
        </svg>
        </div>
      );
    }
    case 'balance': {
      const states = [{ left: scene.data.left, right: scene.data.right, note: '' }, ...scene.data.steps];
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <svg viewBox="-200 -40 400 200" className="w-full max-w-md shrink">
            <motion.g animate={d ? { rotate: [0, -4, 3, 0] } : undefined} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}>
              <line x1="-150" x2="150" y1="20" y2="20" stroke="#ffd04d" strokeWidth="6" strokeLinecap="round" />
              <rect x="-185" y="22" width="90" height="10" rx="4" fill="#ff86b5" /><rect x="95" y="22" width="90" height="10" rx="4" fill="#3fdcc8" />
            </motion.g>
            <path d="M0 20 L-30 140 L30 140 Z" fill="#d9d1ff" stroke="#2b2457" strokeOpacity=".3" />
          </svg>
          <div className="w-full max-w-xl space-y-2" dir="rtl">
            {states.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d * i * 1.8 }}
                className="card-3d flex items-center justify-between gap-3 px-5 py-3 text-2xl font-black" dir="rtl">
                <span className="text-aqua-600">{s.left}</span><span>=</span><span className="text-rose-600">{s.right}</span>
                {s.note && <span className="text-sm font-bold text-ink/70" dir="rtl">{s.note}</span>}
              </motion.div>
            ))}
          </div>
        </div>
      );
    }
    case 'percent_grid': {
      const filled = Math.round(scene.data.percent);
      return (
        <div className="flex h-full items-center justify-center gap-6">
          <svg viewBox="0 0 102 102" className="h-full max-h-full" style={{ aspectRatio: '1' }}>
            {Array.from({ length: 100 }, (_, i) => (
              <motion.rect key={i} x={1 + (i % 10) * 10} y={1 + Math.floor(i / 10) * 10} width="9" height="9" rx="1.5"
                initial={{ fill: 'rgba(43,36,87,.15)' }} animate={{ fill: i < filled ? '#ffd04d' : 'rgba(43,36,87,.15)' }}
                transition={{ delay: i < filled ? d * 0.04 * i : 0, duration: d ? 0.2 : 0 }} />
            ))}
          </svg>
          <div className="text-center">
            <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: d * 0.04 * filled + d }} className="text-5xl font-black text-star-600">{scene.data.percent}%</motion.p>
            {scene.data.label && <p className="mt-2 text-xl">{scene.data.label}</p>}
          </div>
        </div>
      );
    }
    case 'question':
      return <QuestionScene scene={scene} onAnswered={onAnswered} />;
  }
}

function QuestionScene({ scene, onAnswered }: { scene: Extract<Scene, { template: 'question' }>; onAnswered?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const ok = picked === scene.data.correct;
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col justify-center gap-4">
      <p className="text-2xl font-bold" dir="auto">{scene.data.prompt}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {scene.data.options.map((o, i) => (
          <button key={i} onClick={() => { if (picked === null || !ok) { setPicked(i); if (i === scene.data.correct) onAnswered?.(); } }}
            className={`card-3d px-4 py-4 text-xl font-bold ${picked === i ? (ok ? 'ring-2 ring-aqua-400' : 'ring-2 ring-rose-400') : 'hover:bg-ink/5'}`}>{o}</button>
        ))}
      </div>
      {picked !== null && <p className={ok ? 'text-aqua-600' : 'text-rose-600'}>{ok ? `أحسنت. ${scene.data.explain}` : 'إجابة غير صحيحة، والمحاولة متاحة مجددًا.'}</p>}
    </div>
  );
}
