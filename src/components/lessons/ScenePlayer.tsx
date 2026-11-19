'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Scenario } from '@/lib/scenario';
import { SceneView } from './Scenes';
import { usePrefs } from '../Prefs';

/**
 * مشغل الدرس: يعرض المشاهد بالتتابع. إن وُجد تسجيل صوتي للمشهد ينتقل عند انتهائه،
 * وإلا بعد مدة المشهد. مشهد السؤال يتوقف حتى تجيب الطالب.
 */
export function ScenePlayer({ scenario, audioUrls = {} }: { scenario: Scenario; audioUrls?: Record<string, string> }) {
  const { calm } = usePrefs();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [answered, setAnswered] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const scene = scenario.scenes[i];
  const last = i >= scenario.scenes.length - 1;

  useEffect(() => { setAnswered(false); }, [i]);

  useEffect(() => {
    if (!playing || !scene) return;
    const url = audioUrls[scene.id];
    if (url) {
      const a = new Audio(url); audio.current = a;
      a.onended = () => { if (scene.template !== 'question' && !last) setI((x) => x + 1); else if (last) setPlaying(false); };
      a.play().catch(() => {});
      return () => { a.pause(); };
    }
    if (scene.template === 'question') return;
    const t = setTimeout(() => { if (!last) setI((x) => x + 1); else setPlaying(false); }, scene.duration * 1000);
    return () => clearTimeout(t);
  }, [playing, i, scene, audioUrls, last]);

  if (!scene) return <div className="panel muted">لا توجد مشاهد بعد.</div>;
  const d = calm ? 0 : Math.min(1.2, scene.duration / 8);

  return (
    <div className="card-3d overflow-hidden">
      <div className="relative aspect-video w-full bg-gradient-to-b from-[#f3efff] to-[#fffdf7] p-4 md:p-8">
        <p className="absolute right-4 top-3 text-sm font-bold text-ink/60">{scene.title}</p>
        <AnimatePresence mode="wait">
          <motion.div key={`${scene.id}-${playing}`} className="h-full" initial={{ opacity: 0, rotateY: 15 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: -15 }} transition={{ duration: calm ? 0 : 0.4 }}>
            <SceneView scene={scene} d={playing || i > 0 ? d : d} onAnswered={() => setAnswered(true)} />
          </motion.div>
        </AnimatePresence>
      </div>
      {scene.caption && <p className="border-t border-ink/10 bg-white/85 px-5 py-3 text-lg leading-8" dir="auto">{scene.caption}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 px-4 py-3 no-print">
        <div className="flex gap-2">
          <button className="chip px-3 py-2" disabled={i === 0} onClick={() => setI((x) => x - 1)}>السابق</button>
          <button className="btn-star min-h-0 px-5 py-2 text-base" onClick={() => setPlaying((p) => !p)}>{playing ? 'إيقاف مؤقت' : 'تشغيل'}</button>
          <button className="chip px-3 py-2" disabled={last || (scene.template === 'question' && !answered)} onClick={() => setI((x) => x + 1)}>التالي</button>
        </div>
        <div className="flex gap-1" aria-label="المشاهد">{scenario.scenes.map((s, k) => <button key={s.id} onClick={() => setI(k)} className={`h-2.5 w-6 rounded-full ${k === i ? 'bg-star-400' : 'bg-ink/15'}`} aria-label={`المشهد ${k + 1}`} />)}</div>
      </div>
    </div>
  );
}
