import { badgeSVG, type BadgeIcon, type Tier } from '@/lib/badges';
import type { StudentAch } from '@/lib/report-data';

/** شهادة إنجاز قابلة للطباعة */
export function Certificate({ a, platform, school, principal }: { a: StudentAch; platform: string; school: string | null; principal: string | null }) {
  const today = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  return (
    <article id="certificate" className="doc-sheet mx-auto max-w-3xl rounded-3xl border-[10px] border-double border-amber-400 bg-gradient-to-b from-amber-50 to-white p-8 text-center shadow-sm">
      <p className="text-sm font-bold text-sky-700">{platform}</p>
      {school && <p className="text-sm muted">{school}</p>}
      <h1 className="mt-4 text-4xl font-black text-amber-600">شهادة إنجاز</h1>
      <p className="mt-6 text-lg">تُمنح هذه الشهادة للطالبة</p>
      <p className="mt-2 text-3xl font-black">{a.name}</p>
      <p className="muted">{a.className}</p>
      <p className="mt-5 text-lg">تقديرًا لاجتهادها في التدريب على مهارات الرياضيات، إذ جمعت</p>
      <p className="mt-2 text-4xl font-black text-amber-500">★ {a.stars} نجمة</p>
      <p className="mt-1 text-lg font-bold">و{a.badges.length} {a.badges.length === 1 ? 'شارة' : a.badges.length === 2 ? 'شارتين' : 'شارات'}</p>
      {a.badges.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {a.badges.map((b) => (
            <div key={b.code} className="w-20">
              <span dangerouslySetInnerHTML={{ __html: badgeSVG(b.icon as BadgeIcon, b.tier as Tier, true, 56) }} />
              <p className="text-[11px] font-bold leading-tight">{b.name_ar}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
        <p>المعلمة<br />.............................</p>
        <p>مديرة المدرسة<br />{principal ?? '.............................'}</p>
      </div>
      <p className="mt-6 text-xs muted">{today}</p>
    </article>
  );
}

export function shareText(a: StudentAch, platform: string) {
  const names = a.badges.slice(0, 6).map((b) => b.name_ar).join('، ');
  return `🌟 إنجاز في منصة «${platform}»\nالطالبة ${a.short} (${a.className}) جمعت ${a.stars} نجمة${a.badges.length ? ` و${a.badges.length} شارة: ${names}` : ''}.`;
}
