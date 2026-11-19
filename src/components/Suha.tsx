'use client';
import { useEffect, useRef } from 'react';

/** «مَدى» — الشخصية المرشدة: مكعب ثلاثي الأبعاد أوجهه مجالات المحتوى الأربعة (الأعداد، الجبر، الهندسة والقياس، البيانات).
 *  idle: يتجول ويدور ويستجيب للمؤشر والسحب والنقر · correct · hint · reveal */
function madaHTML(size: number, mood: string, named?: boolean): string {
  const tri = '<svg viewBox="0 0 40 40"><path d="M20 5 L36 34 H4 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><path d="M20 34 V22" stroke="currentColor" stroke-width="2.5" stroke-dasharray="3 3"/></svg>';
  const bars = '<svg viewBox="0 0 40 40"><rect x="5" y="22" width="7" height="13" rx="2" fill="currentColor"/><rect x="16.5" y="12" width="7" height="23" rx="2" fill="currentColor"/><rect x="28" y="5" width="7" height="30" rx="2" fill="currentColor"/></svg>';
  const front = mood === 'correct' ? '<b>✓</b>' : mood === 'hint' ? '<b>؟</b>' : mood === 'reveal'
    ? '<svg viewBox="0 0 40 40"><path d="M20 5a11 11 0 0 0-6 20v4h12v-4a11 11 0 0 0-6-20z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><path d="M15 34h10" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>'
    : '<b dir="ltr">123</b><i>الأعداد</i>';
  const frontCls = mood === 'correct' ? 'mh-ba' : mood === 'hint' ? 'mh-le' : mood === 'reveal' ? 'mh-ri' : 'mh-fr';
  const star = '<svg viewBox="0 0 40 40" style="width:30%;height:30%"><path d="M20 6 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3 l9 -3 z" fill="#ffd04d" opacity=".9"/></svg>';
  return `<span class="mh mh-${mood}" style="--s:${size}px" role="img" aria-label="مَدى">
    <span class="mh-scene"><span class="mh-cube">
      <span class="mh-f ${frontCls}" style="transform:translateZ(calc(var(--s) / 2))">${front}</span>
      <span class="mh-f mh-ri"><b>س²</b><i>الجبر</i></span>
      <span class="mh-f mh-ba">${tri}<i>الهندسة والقياس</i></span>
      <span class="mh-f mh-le">${bars}<i>البيانات</i></span>
      <span class="mh-f mh-to">${star}</span><span class="mh-f mh-bo"></span>
    </span></span><span class="mh-shadow"></span>${named ? '<span class="mh-name">مَدى</span>' : ''}</span>`;
}


// تحريك «مَدى» تفاعليًا: تجوال في كل الاتجاهات + ميلان نحو المؤشر + سحب للدوران بالقصور + نقرة للانتقال إلى الوجه التالي
function madaLive(root: HTMLElement | null): () => void {
  if (!root || root.dataset.live) return () => {};
  root.dataset.live = '1';
  root.classList.add('mh-live');
  const scene = root.querySelector('.mh-scene') as HTMLElement, cube = root.querySelector('.mh-cube') as HTMLElement, shadow = root.querySelector('.mh-shadow') as HTMLElement | null;
  const S = parseFloat(getComputedStyle(root).getPropertyValue('--s')) || 160;
  const calm = () => document.documentElement.classList.contains('calm') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  let rx = -20, ry = -32, vx = 0, vy = 0, hop = 0, hopV = 0;
  let targetRy: number | null = null;
  let dragging = false, moved = 0, px = 0, py = 0, lastInteract = 0, raf = 0;
  let pointer: { x: number; y: number; at: number } | null = null;
  let targetRyV: number | null = null; void targetRyV;
  const t0 = performance.now();
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const onDown = (e: PointerEvent) => {
    dragging = true; moved = 0; px = e.clientX; py = e.clientY; vx = vy = 0; targetRy = null;
    lastInteract = performance.now(); root.setPointerCapture?.(e.pointerId); root.style.cursor = 'grabbing';
  };
  const onMove = (e: PointerEvent) => {
    pointer = { x: e.clientX, y: e.clientY, at: performance.now() };
    if (!dragging) return;
    const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
    ry += dx * 0.6; rx = clamp(rx - dy * 0.6, -75, 75); vy = dx * 0.6; vx = -dy * 0.6; lastInteract = performance.now();
  };
  const onUp = () => {
    if (!dragging) return; dragging = false; root.style.cursor = 'grab'; lastInteract = performance.now();
    if (moved < 6) { // نقرة: قفزة ودوران إلى الوجه التالي
      targetRy = Math.round((ry - 32) / 90) * 90 - 90 + 32 - 64; hopV = S * 0.09; vx = vy = 0;
    }
  };
  root.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  root.style.cursor = 'grab'; root.style.touchAction = 'none';

  const frame = (now: number) => {
    const t = (now - t0) / 1000, idle = now - lastInteract > 2500, still = calm();
    if (!dragging) {
      if (targetRy !== null) { ry += (targetRy - ry) * 0.12; if (Math.abs(targetRy - ry) < 0.3) { ry = targetRy; targetRy = null; } }
      else if (Math.abs(vx) + Math.abs(vy) > 0.05) { ry += vy; rx = clamp(rx + vx, -75, 75); vx *= 0.94; vy *= 0.94; }
      else {
        let tx = -20, tyOff = 0;
        if (pointer && now - pointer.at < 2500) { // الميلان نحو المؤشر
          const r = root.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          tyOff = clamp((pointer.x - cx) / 12, -35, 35); tx = clamp(-20 - (pointer.y - cy) / 14, -55, 20);
          ry += ((Math.round((ry + 32) / 90) * 90 - 32 + tyOff) - ry) * 0.06;
        } else if (idle && !still) ry -= 0.22; // دوران هادئ تلقائي
        rx += (tx + (still ? 0 : Math.sin(t * 0.8) * 4) - rx) * 0.05;
      }
    }
    hop += hopV; hopV -= S * 0.012; if (hop < 0) { hop = 0; hopV = 0; }
    const wx = still ? 0 : Math.sin(t * 0.33) * S * 0.32 + Math.sin(t * 0.91) * S * 0.06; // تجوال يمينًا ويسارًا
    const wy = still ? 0 : Math.sin(t * 0.52) * S * 0.10 - hop;                               // وصعودًا ونزولًا
    const wz = still ? 1 : 1 + Math.sin(t * 0.27) * 0.06;                                      // اقترابًا وابتعادًا
    scene.style.transform = `translate(${wx}px, ${wy}px) scale(${wz})`;
    cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    const nm = root.querySelector(".mh-name") as HTMLElement | null; if (nm) nm.style.transform = `translateX(${wx}px)`;
    if (shadow) shadow.style.transform = `translateX(${wx}px) scale(${clamp(1 - (wy + hop) / (S * 0.8), 0.6, 1.15) * wz})`;
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); root.removeEventListener('pointerdown', onDown); };
}


type Mood = 'idle' | 'correct' | 'hint' | 'reveal' | 'happy' | 'cheer' | 'think';
const MAP: Record<string, string> = { happy: 'idle', cheer: 'correct', think: 'hint' };

export function Suha({ size = 120, mood = 'idle', named = false, className = '' }: { size?: number; mood?: Mood; named?: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const m = MAP[mood] ?? mood;
  useEffect(() => {
    if (m !== 'idle' || !ref.current) return;
    return madaLive(ref.current.querySelector('.mh'));
  }, [m]);
  return <span ref={ref} className={`inline-block ${className}`} dangerouslySetInnerHTML={{ __html: madaHTML(size, m, named) }} />;
}
export const Mada = Suha;
