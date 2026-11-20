import 'server-only';
import all from '@/lib/booklet-items.json';
import type { DomKey, GQ } from '@/lib/games';

type Raw = { sheet: string; std: number; d: number; p: string; o: string[]; a: number; steps?: string[]; fig?: string };
const items = all as Raw[];
// أسئلة القياس القبلي والبعدي (آخر سؤالين لكل معيار) لا تدخل الألعاب، بالقاعدة نفسها المستعملة في توليد الكراسة
const reserved = new Set<number>();
for (let st = 1; st <= 19; st++) { const ix = items.map((x, k) => (x.std === st ? k : -1)).filter((k) => k >= 0); reserved.add(ix[ix.length - 1]); reserved.add(ix[ix.length - 2]); }

export const POOL: GQ[] = items
  .map((x, k) => ({ x, k }))
  .filter(({ k, x }) => !reserved.has(k) && x.o?.length >= 2)
  .map(({ x, k }) => ({ id: `bk${k}`, dom: x.sheet.split('-')[1] as DomKey, d: x.d, p: x.p, o: x.o, a: x.a, steps: x.steps ?? [], fig: x.fig }));

export function pick({ dom, d, n }: { dom?: DomKey | 'all'; d?: number; n: number }): GQ[] {
  let list = POOL.filter((q) => (!dom || dom === 'all' || q.dom === dom) && (!d || q.d === d));
  if (list.length < n && d) list = POOL.filter((q) => !dom || dom === 'all' || q.dom === dom);
  return [...list].sort(() => Math.random() - 0.5).slice(0, n);
}
