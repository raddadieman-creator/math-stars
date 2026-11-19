import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { requireStudent } from '@/lib/student-data';
import { listFiles, listModels } from '@/lib/library-service';
import { qCount } from '@/lib/types';

export const dynamic = 'force-dynamic';
const ACCENT: Record<string, string> = { iea: 'bg-star-400/60', num: 'bg-star-300/50', alg: 'bg-rose-300/40', geo: 'bg-aqua-300/40', data: 'bg-sky2-300/40', mix: 'bg-ink/10' };

const BOOKLET_DOMAINS: [string, string][] = [['number', 'الأعداد'], ['algebra', 'الجبر'], ['geometry_measurement', 'الهندسة والقياس'], ['data_probability', 'البيانات والاحتمالات']];

function ModelCard({ m }: { m: Awaited<ReturnType<typeof listModels>>[number] }) {
  return (
    <Link href={`/student/library/${m.id}`} className="card-3d tilt flex flex-col p-5">
      <span className={`mb-3 w-fit rounded-xl px-3 py-1 text-xs font-bold ${ACCENT[m.key] ?? 'bg-ink/10'}`}>{qCount(m.count)}</span>
      <b className="text-lg">{m.title}</b>
      <span className="mt-2 text-sm muted">{m.best !== null ? `أفضل نتيجة: ${m.best}%` : 'لم يُجرَّب بعد'}</span>
      <span className="btn-aqua mt-4">بدء النموذج</span>
    </Link>
  );
}

export default async function Library() {
  const { student } = await requireStudent();
  const [models, files] = await Promise.all([listModels(student.id), listFiles()]);
  return (
    <Shell right={<Link href="/student" className="chip hover:bg-ink/5">صفحتي</Link>}>
      <h1 className="text-3xl font-black">مكتبة نماذج الاختبارات</h1>
      <p className="mt-1 text-sm muted">نماذج تدريبية على نمط اختبارات TIMSS للصف الثاني المتوسط.</p>
      <h2 className="h-section mt-8">نماذج TIMSS</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {models.filter((m) => m.group === 'timss').map((m) => <ModelCard key={m.id} m={m} />)}
        {!models.length && <p className="muted">لا توجد نماذج منشورة.</p>}
      </div>
      {models.some((m) => m.group === 'booklet') && (
        <section className="mt-10">
          <h2 className="h-section">كراسة تدريبات المعلمات</h2>
          {BOOKLET_DOMAINS.map(([code, name]) => {
            const list = models.filter((m) => m.group === 'booklet' && m.domain === code);
            return list.length ? (
              <div key={code} className="mt-5">
                <h3 className="mb-3 font-extrabold">{name}</h3>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {list.map((m) => (
                    <Link key={m.id} href={`/student/library/${m.id}`} className="panel flex flex-col gap-1 hover:bg-ink/5">
                      <b>{m.title.split(' · ')[1] ?? m.title}</b>
                      <span className="text-xs muted">{qCount(m.count)}</span>
                      <span className="text-xs">{m.best !== null ? `أفضل نتيجة: ${m.best}%` : 'لم يُجرَّب بعد'}</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">{list.map((m) => <Link key={m.key} href={`/student/explain/${m.key}`} className="chip px-3 py-1 text-xs text-aqua-600">▶ الشرح المتحرك · {m.title.split(' · ')[1] ?? m.title}</Link>)}</div>
              </div>
            ) : null;
          })}
        </section>
      )}
      {files.length > 0 && (
        <section className="mt-10">
          <h2 className="h-section">ملفات الاختبارات</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {files.map((f) => (
              <a key={f.id} href={f.url} target="_blank" rel="noreferrer" className="panel flex items-center justify-between gap-3 hover:bg-ink/5">
                <div><b>{f.title}</b><p className="text-xs muted">{f.publisher}{f.language === 'en' ? ' · بالإنجليزية' : ''}</p></div>
                <span className="chip">{f.official ? 'رسمي' : 'من المعلم'}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </Shell>
  );
}
