'use client';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const AXIS = { stroke: 'rgba(255,255,255,.55)', fontSize: 12 };
const TIP = { contentStyle: { background: '#141244', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12, direction: 'rtl' as const } };

export function WeeklyChart({ data }: { data: { week: number; items: number; firstTryPct: number | null }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,.08)" />
        <XAxis dataKey="week" {...AXIS} reversed tickFormatter={(w) => `أ${w}`} />
        <YAxis yAxisId="p" domain={[0, 100]} {...AXIS} orientation="right" unit="%" />
        <YAxis yAxisId="n" {...AXIS} orientation="left" allowDecimals={false} />
        <Tooltip {...TIP} labelFormatter={(w) => `الأسبوع ${w}`} />
        <Legend />
        <Line yAxisId="p" type="monotone" dataKey="firstTryPct" name="الصحيحة من المحاولة الأولى %" stroke="#3fdcc8" strokeWidth={3} connectNulls dot />
        <Line yAxisId="n" type="monotone" dataKey="items" name="عدد الأسئلة" stroke="#ffd04d" strokeWidth={2} strokeDasharray="4 4" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SimpleBars({ data, unit = '', color = '#ff86b5', max }: { data: { name: string; value: number }[]; unit?: string; color?: string; max?: number }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 42)}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid stroke="rgba(255,255,255,.08)" horizontal={false} />
        <XAxis type="number" {...AXIS} reversed domain={[0, max ?? 'auto']} unit={unit} allowDecimals={false} />
        <YAxis type="category" dataKey="name" {...AXIS} orientation="right" width={150} />
        <Tooltip {...TIP} />
        <Bar dataKey="value" name="القيمة" fill={color} radius={[6, 0, 0, 6]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
