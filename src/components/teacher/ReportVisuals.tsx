// رسومات خفيفة بلا مكتبات (SVG وجداول)، تظهر في الشاشة والطباعة، وتنتقل الجداول منها إلى ملف Word.

export const PALETTE = ['#0284c7', '#14b8a6', '#f59e0b', '#e8466c', '#8b5cf6', '#22c55e', '#f97316', '#06b6d4'];

export function KpiTiles({ items }: { items: { label: string; value: string | number | null; hint?: string; color: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((k) => (
        <div key={k.label} className="doc-break rounded-2xl p-4 text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${k.color}, ${k.color}cc)` }}>
          <p className="text-sm font-bold opacity-90">{k.label}</p>
          <p className="mt-1 text-3xl font-black">{k.value ?? '—'}</p>
          {k.hint && <p className="text-xs opacity-85">{k.hint}</p>}
        </div>
      ))}
    </div>
  );
}

/** حلقة نسب مع مفتاح */
export function Donut({ data, size = 170, center }: { data: { name: string; value: number; color: string }[]; size?: number; center?: string }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  const r = 60, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 160 160" role="img" aria-label="رسم دائري">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#eef2f7" strokeWidth="26" />
        {total > 0 && data.map((d) => {
          const len = (d.value / total) * c;
          const el = <circle key={d.name} cx="80" cy="80" r={r} fill="none" stroke={d.color} strokeWidth="26" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-acc} transform="rotate(-90 80 80)" />;
          acc += len; return el;
        })}
        <text x="80" y="86" textAnchor="middle" fontSize="20" fontWeight="900" fill="#0f172a">{center ?? total}</text>
      </svg>
      <table className="text-sm">
        <tbody>
          {data.map((d) => (
            <tr key={d.name}>
              <td className="py-1 pl-2"><span className="inline-block h-3 w-3 rounded-sm align-middle" style={{ background: d.color }} /></td>
              <td className="py-1 pl-3">{d.name}</td>
              <td className="py-1 font-black">{d.value}{total ? ` (${Math.round((d.value / total) * 100)}%)` : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** أعمدة أفقية ملونة على شكل جدول (تُطبع وتنتقل إلى Word) */
export function HBars({ data, max, unit = '' }: { data: { name: string; value: number | null; color?: string }[]; max?: number; unit?: string }) {
  const m = max ?? Math.max(1, ...data.map((d) => d.value ?? 0));
  return (
    <table className="w-full text-sm">
      <tbody>
        {data.map((d, i) => {
          const pct = d.value === null ? 0 : Math.max(2, Math.round((d.value / m) * 100));
          return (
            <tr key={d.name + i}>
              <td className="w-[38%] py-1.5 pl-3 font-bold">{d.name}</td>
              <td className="py-1.5">
                <table className="w-full"><tbody><tr>
                  <td className="bar h-4 rounded-full" style={{ width: `${pct}%`, background: d.color ?? PALETTE[i % PALETTE.length] }} />
                  <td style={{ width: `${100 - pct}%` }} />
                </tr></tbody></table>
              </td>
              <td className="w-16 py-1.5 pr-2 text-center font-black">{d.value ?? '—'}{d.value !== null ? unit : ''}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
