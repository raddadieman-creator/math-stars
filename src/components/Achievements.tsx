import { BADGES, MONTHLY_BADGE, badgeSVG, type BadgeIcon } from '@/lib/badges';

type Top = { name: string; class_name: string; stars: number; badges: string[] };
type Recent = { name: string; class_name: string; badge: string; awarded_at: string };
const DEFS = new Map<string, { name: string; tier: Parameters<typeof badgeSVG>[1]; icon: BadgeIcon }>(
  [...BADGES, MONTHLY_BADGE].map((b) => [b.code, { name: b.name, tier: b.tier, icon: b.icon }]),
);
const Badge = ({ code, size = 34 }: { code: string; size?: number }) => {
  const d = DEFS.get(code); if (!d) return null;
  return <span title={d.name} className="inline-block" dangerouslySetInnerHTML={{ __html: badgeSVG(d.icon, d.tier, true, size) }} />;
};
const rankStyle = ['from-amber-300 to-amber-500', 'from-slate-200 to-slate-400', 'from-orange-300 to-orange-500'];

/** قسم «المنجزات والنجوم» في الصفحة الرئيسية */
export function Achievements({ top, recent }: { top: Top[]; recent: Recent[] }) {
  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black">المنجزات والنجوم</h2>
          <p className="mt-1 muted">الأكثر جمعًا للنجوم والشارات في البرنامج.</p>
        </div>
      </div>
      {top.length ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((t, i) => (
            <div key={i} className="card-3d flex items-start gap-4 p-5">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br text-lg font-black text-white ${rankStyle[i] ?? 'from-sky-400 to-sky-600'}`}>{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-extrabold">{t.name}</p>
                <p className="text-sm muted">{t.class_name}</p>
                <p className="mt-1 font-bold text-amber-600">★ {t.stars} نجمة</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {t.badges.length ? t.badges.slice(0, 8).map((b) => <Badge key={b} code={b} />) : <span className="text-xs muted">لا شارات بعد</span>}
                  {t.badges.length > 8 && <span className="chip text-xs">+{t.badges.length - 8}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="card-3d mt-5 p-6 muted">تظهر هنا أسماء الطالبات مع نجومهن وشاراتهن بعد بدء التدريب.</p>
      )}
      <div className="card-3d mt-5 p-6">
        <h3 className="text-xl font-extrabold">الشارات</h3>
        {recent.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {recent.map((r, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl bg-ink/5 p-3">
                <Badge code={r.badge} size={44} />
                <span><b>{r.name}</b> <span className="text-sm muted">({r.class_name})</span><br /><span className="text-sm">حصلت على شارة «{DEFS.get(r.badge)?.name ?? r.badge}»</span></span>
              </li>
            ))}
          </ul>
        ) : <p className="mt-3 muted">تظهر هنا أحدث الشارات التي تحصل عليها الطالبات.</p>}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
          {BADGES.slice(0, 22).map((b) => <span key={b.code} title={`${b.name}: ${b.desc}`} dangerouslySetInnerHTML={{ __html: badgeSVG(b.icon, b.tier, true, 30) }} />)}
        </div>
        <p className="mt-2 text-xs muted">مجموعة الشارات المتاحة في البرنامج.</p>
      </div>
    </section>
  );
}
