'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface PrefsCtx { calm: boolean; muted: boolean; toggleCalm: () => void; toggleMuted: () => void; play: (k: 'correct' | 'retry' | 'star' | 'tap') => void }
const Ctx = createContext<PrefsCtx>({ calm: false, muted: true, toggleCalm: () => {}, toggleMuted: () => {}, play: () => {} });
export const usePrefs = () => useContext(Ctx);

function read(key: string, def: boolean) {
  try { const v = localStorage.getItem(key); return v === null ? def : v === '1'; } catch { return def; }
}
function write(key: string, v: boolean) { try { localStorage.setItem(key, v ? '1' : '0'); } catch { /* */ } }

/** تفضيلات العرض: الوضع المبسط (تقليل الحركة) والمؤثرات الصوتية (نغمات قصيرة، بلا صوت آلي) */
export function Prefs({ children }: { children: React.ReactNode }) {
  const [calm, setCalm] = useState(false);
  const [muted, setMuted] = useState(false);
  const ac = useRef<AudioContext | null>(null);

  useEffect(() => { setCalm(read('ms_calm', false)); setMuted(read('ms_muted', false)); }, []);
  useEffect(() => { document.documentElement.classList.toggle('calm', calm); }, [calm]);

  const play = useCallback((k: 'correct' | 'retry' | 'star' | 'tap') => {
    if (muted) return;
    try {
      ac.current ??= new AudioContext();
      const ctx = ac.current;
      const notes = k === 'correct' ? [660, 880, 1320] : k === 'star' ? [990, 1320] : k === 'retry' ? [440, 392] : [520];
      notes.forEach((f, i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        const t = ctx.currentTime + i * 0.11;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.3);
      });
    } catch { /* المتصفح لا يدعم الصوت */ }
  }, [muted]);

  return (
    <Ctx.Provider value={{
      calm, muted, play,
      toggleCalm: () => setCalm((v) => { write('ms_calm', !v); return !v; }),
      toggleMuted: () => setMuted((v) => { write('ms_muted', !v); return !v; }),
    }}>{children}</Ctx.Provider>
  );
}

export function PrefsToggles() {
  const { calm, muted, toggleCalm, toggleMuted } = usePrefs();
  return (
    <div className="flex gap-2 no-print">
      <button onClick={toggleMuted} className="chip hover:bg-ink/5" aria-pressed={!muted}>{muted ? '🔇 الصوت مكتوم' : '🔊 المؤثرات'}</button>
      <button onClick={toggleCalm} className="chip hover:bg-ink/5" aria-pressed={calm}>{calm ? '◐ الوضع المبسط' : '✦ الحركة'}</button>
    </div>
  );
}
