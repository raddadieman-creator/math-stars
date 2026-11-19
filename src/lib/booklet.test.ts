import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import items from './booklet-items.json';

describe('أسئلة كراسة المعلمات', () => {
  it('كل سؤال له أربعة خيارات مختلفة وإجابة صحيحة ضمنها', () => {
    for (const q of items) {
      expect(q.o).toHaveLength(4);
      expect(new Set(q.o).size).toBe(4);
      expect(q.a).toBeGreaterThanOrEqual(0);
      expect(q.a).toBeLessThan(4);
      expect(q.std).toBeGreaterThanOrEqual(1);
      expect(q.std).toBeLessThanOrEqual(19);
      expect(q.steps.length).toBeGreaterThan(0);
    }
  });
  it('كل شكل مذكور موجود في المجلد العام', () => {
    for (const q of items as { fig?: string }[]) if (q.fig) expect(existsSync(`public/booklet/${q.fig}.png`)).toBe(true);
  });
  it('تغطي الكراسة المعايير الـ19 كلها', () => {
    expect(new Set(items.map((q) => q.std)).size).toBe(19);
  });
});
