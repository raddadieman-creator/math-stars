'use client';
import { useEffect, useRef } from 'react';
import { mountReview, emptyReview, type ReviewData } from '@/lib/review';
import { usePrefs } from '@/components/Prefs';

/** قسم المراجعة (جدول الضرب والقوانين). يُحفظ التقدم في هذا الجهاز. */
export function Review() {
  const ref = useRef<HTMLDivElement>(null);
  const { play } = usePrefs();
  useEffect(() => {
    if (!ref.current) return;
    const KEY = 'ms_review_v1';
    return mountReview(ref.current, {
      get: () => { try { return Object.assign(emptyReview(), JSON.parse(localStorage.getItem(KEY) ?? '{}')) as ReviewData; } catch { return emptyReview(); } },
      set: (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* التخزين غير متاح */ } },
      play: (k) => play(k === 'ok' ? 'correct' : 'retry'),
    });
  }, [play]);
  return <div ref={ref} />;
}
