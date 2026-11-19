import { BADGES, GROUP_AR, MONTHLY_BADGE, badgeProgress, badgeSVG, monthlyProgress, type BadgeGroup, type MonthlyGoals, type StudentStats } from '@/lib/badges';

/** خزانة الأوسمة: المكتسب ملوّن بتاريخ منحه، والمقفل باهت مع شريط التقدم، وتحدي الشهر في الأعلى */
export function BadgeCase({ stats, goals, owned, monthName, monthlyWins }: {
  stats: StudentStats; goals: MonthlyGoals; owned: Map<string, string>; monthName: string; monthlyWins: string[];
}) {
  const progress = new Map(badgeProgress(stats, goals).map((p) => [p.code, p]));
  const monthly = monthlyProgress(stats, goals);
  const earnedCount = BADGES.filter((b) => owned.has(b.code)).length;
  const groups = (['tasks', 'mastery', 'library', 'challenges', 'persistence'] as BadgeGroup[]);
  return (
    <section className="mt-10 space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="h-section">خزانة الأوسمة</h2>
        <span className="chip">{earnedCount} من {BADGES.length}{monthlyWins.length ? ` · تميّز الشهر ×${monthlyWins.length}` : ''}</span>
      </div>

      <div className="card-3d grid items-center gap-5 p-6 md:grid-cols-[auto_1fr]">
        <span dangerouslySetInnerHTML={{ __html: badgeSVG(MONTHLY_BADGE.icon, 'special', monthly.done, 96) }} />
        <div>
          <p className="text-sm muted">تحدي الشهر · {monthName}</p>
          <p className="text-xl font-black">{monthly.done ? 'حصلت على وسام تميّز الشهر' : 'وسام تميّز الشهر'}</p>
          <div className="mt-3 space-y-3">
            {monthly.items.map((m) => (
              <div key={m.key}>
                <div className="mb-1 flex justify-between text-sm"><span>{m.label}</span><b>{m.value} من {m.target}</b></div>
                <div className="h-2.5 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-gradient-to-l from-rose-400 to-star-400" style={{ width: `${(m.value / m.target) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {groups.map((g) => (
        <div key={g}>
          <h3 className="mb-3 font-extrabold">{GROUP_AR[g]}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {BADGES.filter((b) => b.group === g).map((b) => {
              const at = owned.get(b.code);
              const p = progress.get(b.code)!;
              return (
                <div key={b.code} className={`card-3d flex flex-col items-center p-3 text-center ${at ? '' : 'opacity-80'}`} title={b.desc}>
                  <span dangerouslySetInnerHTML={{ __html: badgeSVG(b.icon, b.tier, !!at, 70) }} />
                  <b className="mt-1 text-sm">{b.name}</b>
                  <span className="text-[11px] muted">{b.desc}</span>
                  {at ? <span className="mt-1 text-[11px] text-aqua-600">{new Date(at).toLocaleDateString('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long' })}</span>
                    : <div className="mt-2 w-full"><div className="h-1.5 overflow-hidden rounded-full bg-ink/10"><div className="h-full bg-star-400" style={{ width: `${(p.value / p.target) * 100}%` }} /></div><span className="text-[11px] muted">{p.value} من {p.target}</span></div>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
