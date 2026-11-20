/** سلسلة التدريب: شعلة وعدد الأيام المتتالية وخط آخر سبعة أيام */
export const daysAr = (n: number) => (n === 1 ? 'يوم واحد' : n === 2 ? 'يومان' : n <= 10 ? `${n} أيام` : `${n} يومًا`);

export function StreakCard({ s }: { s: { current: number; best: number; today: boolean; week: { key: string; active: boolean; label: string; today: boolean }[] } }) {
  const lit = s.current > 0;
  return (
    <section className="mt-8 overflow-hidden rounded-3xl p-6 text-white shadow-md" style={{ background: lit ? 'linear-gradient(135deg,#f97316,#f59e0b 55%,#facc15)' : 'linear-gradient(135deg,#64748b,#94a3b8)' }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className={`text-6xl ${lit ? 'streak-flame' : 'opacity-60 grayscale'}`} aria-hidden>🔥</span>
          <div>
            <p className="text-sm font-bold opacity-90">سلسلة التدريب</p>
            <p className="text-4xl font-black">{daysAr(s.current)}</p>
            <p className="text-sm opacity-90">{s.today ? 'شعلة اليوم مضيئة' : lit ? 'تدريب اليوم يحافظ على السلسلة' : 'تبدأ السلسلة بأول يوم تدريب'}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white/20 px-4 py-2 text-center"><p className="text-xs font-bold">أطول سلسلة</p><p className="text-2xl font-black">{s.best}</p></div>
      </div>
      <div className="relative mt-6">
        <div className="absolute inset-x-4 top-[18px] h-1.5 rounded-full bg-white/30" />
        <div className="relative grid grid-cols-7">
          {s.week.map((d, i) => {
            const linked = d.active && s.week[i + 1]?.active;
            return (
              <div key={d.key} className="relative flex flex-col items-center">
                {linked && <span className="absolute left-[-50%] top-[18px] h-1.5 w-full rounded-full bg-white" />}
                <span className={`relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 text-lg ${d.active ? 'border-white bg-white text-orange-500' : 'border-white/60 bg-white/10 text-white/70'} ${d.today ? 'ring-4 ring-white/50' : ''}`}>{d.active ? '🔥' : '·'}</span>
                <span className="mt-1 text-xs font-bold">{d.today ? 'اليوم' : d.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
