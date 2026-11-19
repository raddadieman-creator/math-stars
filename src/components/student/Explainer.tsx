'use client';
import { useEffect, useRef } from 'react';
import { mountExplainer, type XItem } from '@/lib/explainer';

/** غلاف React لمشغّل الشرح المتحرك (المنطق في src/lib/explainer.ts) */
export function Explainer({ item }: { item: XItem }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const p = mountExplainer(ref.current, item, { figBase: '/booklet/' });
    return () => p.destroy();
  }, [item]);
  return <div ref={ref} />;
}
