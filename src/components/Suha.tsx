'use client';
import { useEffect, useRef } from 'react';
import { planetHTML, planetLive, mountMadaAssistant, type Mood as PMood } from '@/lib/mada';

/** «مَدى» — منقلة رياضية تدور ذراعها وتقيس الزوايا، وتتنقل بهدوء وتميل نحو المؤشر (المنطق في src/lib/mada.ts) */
type Mood = 'idle' | 'correct' | 'hint' | 'reveal' | 'happy' | 'cheer' | 'think';
const MAP: Record<string, PMood> = { happy: 'idle', cheer: 'correct', think: 'hint' };

export function Suha({ size = 120, mood = 'idle', named = false, className = '' }: { size?: number; mood?: Mood; named?: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const m = (MAP[mood] ?? mood) as PMood;
  useEffect(() => {
    if (m !== 'idle' || !ref.current) return;
    return planetLive(ref.current);
  }, [m]);
  return <span ref={ref} className={`inline-block ${className}`} dangerouslySetInnerHTML={{ __html: planetHTML(size, m, named) }} />;
}
export const Mada = Suha;

/** زر «مَدى» العائم ونافذة أسئلته في صفحات الطالب */
export function MadaAssistant() {
  useEffect(() => mountMadaAssistant(), []);
  return null;
}
