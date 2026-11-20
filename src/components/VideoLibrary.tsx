import { VIDEO_SOURCES, VIDEO_TOPICS } from '@/lib/videos';

const COLORS: Record<string, string> = { manal: 'bg-rose-500', asmari: 'bg-violet-500', 'ien-yt': 'bg-teal-600', ien: 'bg-sky-600' };
const DOMAIN_TINT = ['from-sky-50', 'from-violet-50', 'from-amber-50', 'from-emerald-50'];

/** مكتبة الشروحات: لكل موضوع روابط بحث عند المعلمين المختارين ومنصة عين */
export function VideoLibrary() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {VIDEO_SOURCES.map((s) => <span key={s.id} className={`rounded-full px-3 py-1 text-sm font-bold text-white ${COLORS[s.id]}`}>{s.name} · {s.note}</span>)}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {VIDEO_TOPICS.map((d, i) => (
          <section key={d.domain} className={`card-3d bg-gradient-to-b ${DOMAIN_TINT[i]} to-white p-5`}>
            <h3 className="text-xl font-extrabold">{d.domain}</h3>
            <ul className="mt-3 space-y-3">
              {d.topics.map((t) => (
                <li key={t}>
                  <p className="font-bold">{t}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {VIDEO_SOURCES.map((s) => (
                      <a key={s.id} href={s.url(t)} target="_blank" rel="noopener noreferrer" className={`rounded-full px-2.5 py-1 text-xs font-bold text-white transition hover:brightness-110 ${COLORS[s.id]}`}>▶ {s.name}</a>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="text-xs muted">الروابط تفتح نتائج البحث في يوتيوب باسم المعلم والموضوع، ورابط منصة عين يفتح موقعها الرسمي.</p>
    </div>
  );
}
