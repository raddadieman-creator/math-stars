import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { Suha } from '@/components/Suha';
import { getPublicStats, getSettings } from '@/lib/data';
import { isConfigured } from '@/lib/env';
import { GAMES } from '@/lib/games';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [s, stats] = await Promise.all([getSettings(), getPublicStats()]);
  return (
    <Shell school={s.school_name}>
      {!isConfigured() && (
        <div className="mb-6 rounded-2xl border border-star-400/40 bg-star-400/10 p-4 text-sm">
          المنصة غير متصلة بقاعدة البيانات بعد. التفاصيل في صفحة <Link className="underline" href="/setup">الإعداد</Link>.
        </div>
      )}

      {/* الواجهة */}
      <section className="grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {s.school_logo_url && <img src={s.school_logo_url} alt="شعار المدرسة" className="h-14 w-14 rounded-xl bg-white object-contain p-1" />}
            {s.timss_logo_url && <img src={s.timss_logo_url} alt="شعار TIMSS" className="h-14 rounded-xl bg-white object-contain p-1" />}
            <div>
              <p className="text-lg font-bold">{s.school_name}</p>
              <p className="text-sm muted">الصف الثاني المتوسط</p>
            </div>
          </div>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            معًا نحو القمة – <span className="text-sky-600">TIMSS</span>
            <span className="mt-2 block bg-gradient-to-l from-star-500 via-rose-500 to-aqua-500 bg-clip-text text-2xl text-transparent md:text-3xl">
              {s.slogan}
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-lg muted">
            تدريب تفاعلي على مهارات الرياضيات.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/student/login" className="btn-star">دخول الطالب</Link>
            <Link href="/teacher/login" className="btn-ghost">دخول المعلم</Link>
          </div>
        </div>
        <div className="card-3d mx-auto flex w-full max-w-md justify-center px-8 pb-8 pt-14">
          <Suha size={150} mood="idle" named />
        </div>
      </section>

      {/* الإدارة والإعداد */}
      {(s.principal_name || s.teacher_names.length > 0) && (
        <section className="card-3d mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 px-6 py-4 text-center">
          {s.principal_name && <p><span className="muted">مديرة المدرسة:</span> <b>{s.principal_name}</b></p>}
          {s.teacher_names.length > 0 && <p><span className="muted">{s.teacher_names.length === 1 ? 'إعداد المعلمة:' : s.teacher_names.length === 2 ? 'إعداد المعلمتين:' : 'إعداد المعلمات:'}</span> <b>{s.teacher_names.length === 2 ? s.teacher_names.join(' و') : s.teacher_names.join('، ')}</b></p>}
        </section>
      )}

      {/* الرؤية والرسالة والأهداف: تظهر عند إضافتها فقط */}
      {(s.vision || s.mission || s.goals.length > 0) && (
        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {s.vision && <div className="card-3d p-6"><h2 className="text-xl font-extrabold text-star-600">الرؤية</h2><p className="mt-2 leading-8">{s.vision}</p></div>}
          {s.mission && <div className="card-3d p-6"><h2 className="text-xl font-extrabold text-aqua-600">الرسالة</h2><p className="mt-2 leading-8">{s.mission}</p></div>}
          {s.goals.length > 0 && <div className="card-3d p-6"><h2 className="text-xl font-extrabold text-rose-600">الأهداف</h2><ul className="mt-2 list-disc space-y-1 pr-5 leading-7">{s.goals.map((g) => <li key={g}>{g}</li>)}</ul></div>}
        </section>
      )}

      {/* رحلة التعلم */}
      <section className="mt-14">
        <h2 className="h-section">رحلة التعلم</h2>
        <div className="mt-6 grid gap-3 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-5">
          {[
            { t: 'القياس القبلي', d: 'تحديد المستوى', c: 'from-sky2-300 to-sky2-400' },
            { t: 'الأعداد', d: 'تدريب ودروس', c: 'from-star-300 to-star-500' },
            { t: 'الجبر', d: 'تدريب ودروس', c: 'from-rose-300 to-rose-500' },
            { t: 'الهندسة والقياس · البيانات والاحتمالات', d: 'تدريب ودروس', c: 'from-aqua-300 to-aqua-500' },
            { t: 'القياس البعدي', d: 'قياس التقدم', c: 'from-sky2-300 to-sky2-400' },
          ].map((st, i) => (
            <div key={i} className="card-3d tilt p-4" style={{ transform: `rotateX(10deg) translateZ(${i * 6}px)` }}>
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b ${st.c} text-xl font-black text-night-950`}>{i + 1}</div>
              <p className="font-extrabold">{st.t}</p><p className="text-sm muted">{st.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* الألعاب */}
      <section className="mt-14">
        <h2 className="h-section">الألعاب التعليمية</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((g) => (
            <div key={g.key} className="card-3d p-4">
              <p className="text-3xl">{g.icon}</p>
              <p className="mt-2 font-extrabold">{g.name}</p>
              <p className="mt-1 text-sm muted">{g.desc}</p>
              <span className="chip mt-3 text-ink/60">{g.ready ? 'متاحة' : 'قريبًا'}</span>
            </div>
          ))}
        </div>
      </section>

      {/* لوحة التميز والمؤشرات */}
      <section className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="card-3d p-6">
          <h2 className="text-xl font-extrabold">لوحة التميز</h2>
          <p className="mt-4 muted">تظهر لوحة التميز للطالبات بعد الدخول، وتعرض زميلات الفصل نفسه فقط. لا تُعرض نتائج فردية في الصفحة العامة.</p>
        </div>
        <div className="card-3d p-6">
          <h2 className="text-xl font-extrabold">مؤشرات عامة</h2>
          {stats ? (
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {[
                ['طلاب شاركوا', stats.participants], ['أسئلة أُجيب عنها', stats.answered_items],
                ['مهارات أُتقنت', stats.mastered_skills], ['أسئلة منشورة', stats.published_questions],
              ].map(([k, v]) => (
                <div key={String(k)} className="rounded-xl bg-ink/5 p-3"><dt className="text-xs muted">{k}</dt><dd className="text-2xl font-black">{v}</dd></div>
              ))}
            </dl>
          ) : <p className="mt-4 muted">تظهر بعد ربط قاعدة البيانات.</p>}
        </div>
      </section>
    </Shell>
  );
}
