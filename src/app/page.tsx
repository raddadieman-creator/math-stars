import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { Suha } from '@/components/Suha';
import { getDomains, getLeaderboard, getPublicStats, getSettings } from '@/lib/data';
import { isConfigured } from '@/lib/env';
import { GAMES } from '@/lib/games';

export const dynamic = 'force-dynamic';

const COGNITIVE = [
  { name: 'المعرفة', en: 'Knowing', pct: 35, desc: 'استرجاع الحقائق والمفاهيم والإجراءات والتعرف عليها.' },
  { name: 'التطبيق', en: 'Applying', pct: 40, desc: 'توظيف المعرفة والإجراءات في حل مسائل مألوفة.' },
  { name: 'الاستدلال', en: 'Reasoning', pct: 25, desc: 'التحليل والتعميم والتبرير وحل المسائل غير المألوفة.' },
];

function Pending({ what }: { what: string }) {
  return <span className="text-ink/45">({what} — تُضاف من لوحة الإعدادات)</span>;
}

export default async function Home() {
  const [s, domains, stats, board] = await Promise.all([getSettings(), getDomains(), getPublicStats(), getLeaderboard()]);
  return (
    <Shell school={s.school_name}>
      {!isConfigured() && (
        <div className="mb-6 rounded-2xl border border-star-400/40 bg-star-400/10 p-4 text-sm">
          المنصة غير متصلة بقاعدة البيانات بعد. راجعي صفحة <Link className="underline" href="/setup">الإعداد</Link>.
        </div>
      )}

      {/* الواجهة */}
      <section className="grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {s.school_logo_url && <img src={s.school_logo_url} alt="شعار المدرسة" className="h-14 w-14 rounded-xl bg-white object-contain p-1" />}
            {s.timss_logo_url && <img src={s.timss_logo_url} alt="شعار TIMSS" className="h-14 rounded-xl bg-white object-contain p-1" />}
            <div>
              <p className="text-lg font-bold">{s.school_name ?? <Pending what="اسم المدرسة" />}</p>
              <p className="text-sm muted">الصف الثاني المتوسط · برنامج مدته {s.program_weeks} أسبوعًا</p>
            </div>
          </div>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            نجوم الرياضيات
            <span className="mt-2 block bg-gradient-to-l from-star-500 via-rose-500 to-aqua-500 bg-clip-text text-2xl text-transparent md:text-3xl">
              {s.slogan}
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-lg muted">
            تدريب تفاعلي على مهارات الرياضيات التي تقيسها دراسة TIMSS 2027 للصف الثامن، بتغذية راجعة فورية وتحديات تتدرج مع مستواكِ.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/student/login" className="btn-star">دخول الطالبة</Link>
            <Link href="/teacher/login" className="btn-ghost">دخول المعلمة</Link>
          </div>
        </div>
        <div className="card-3d tilt relative mx-auto w-full max-w-sm p-6 text-center">
          <Suha size={150} className="floaty mx-auto" />
          <p className="mt-2 text-lg font-bold">أنا سُها، رفيقتكِ في الرحلة</p>
          <p className="mt-1 text-sm muted">أرافقكِ بتلميح عند الحاجة، وأعرض الحل خطوة بخطوة إذا احتجتِ إليه.</p>
        </div>
      </section>

      {/* أسرة المنصة */}
      <section className="mt-12 grid gap-4 md:grid-cols-3">
        <div className="card-3d p-5"><p className="text-sm muted">مديرة المدرسة</p><p className="mt-1 text-xl font-bold">{s.principal_name ?? <Pending what="الاسم" />}</p></div>
        <div className="card-3d p-5 md:col-span-2">
          <p className="text-sm muted">المعلمتان المشرفتان على المنصة</p>
          <p className="mt-1 text-xl font-bold">{s.teacher_names.length ? s.teacher_names.join(' · ') : <Pending what="الأسماء" />}</p>
        </div>
      </section>

      {/* الرؤية والرسالة والأهداف */}
      <section className="mt-12 grid gap-4 md:grid-cols-3">
        <div className="card-3d p-6"><h2 className="text-xl font-extrabold text-star-600">الرؤية</h2><p className="mt-2 leading-8">{s.vision ?? <Pending what="الرؤية" />}</p></div>
        <div className="card-3d p-6"><h2 className="text-xl font-extrabold text-aqua-600">الرسالة</h2><p className="mt-2 leading-8">{s.mission ?? <Pending what="الرسالة" />}</p></div>
        <div className="card-3d p-6">
          <h2 className="text-xl font-extrabold text-rose-600">الأهداف</h2>
          {s.goals.length ? <ul className="mt-2 list-disc space-y-1 pr-5 leading-7">{s.goals.map((g) => <li key={g}>{g}</li>)}</ul> : <p className="mt-2"><Pending what="الأهداف" /></p>}
        </div>
      </section>

      {/* TIMSS */}
      <section className="mt-14">
        <h2 className="h-section">دراسة TIMSS 2027</h2>
        <p className="mt-3 max-w-3xl leading-8 muted">
          {s.timss_intro ??
            'دراسة دولية تشرف عليها الرابطة الدولية لتقييم التحصيل التربوي (IEA)، وتُجرى كل أربع سنوات منذ عام 1995 لقياس تحصيل طلاب الصفين الرابع والثامن في الرياضيات والعلوم. ويقابل الصف الثامن في المملكة الصف الثاني المتوسط، وهو الصف الذي تستهدفه هذه المنصة.'}
        </p>
        <h3 className="mt-6 text-lg font-bold">مجالات المحتوى للصف الثامن ونسبها المستهدفة</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {domains.map((d) => (
            <div key={d.id} className="card-3d tilt p-5">
              <div className="flex items-baseline justify-between"><p className="text-lg font-extrabold">{d.name_ar}</p><span className="text-2xl font-black text-star-600">{d.target_percent}%</span></div>
              <p className="text-xs text-ink/50">{d.name_en}</p>
              <ul className="mt-3 space-y-1 text-sm">
                {[...d.topic_areas].sort((a, b) => a.sort_order - b.sort_order).map((t) => (
                  <li key={t.id} className="flex justify-between gap-2"><span>{t.name_ar}</span><span className="text-ink/50">{t.target_percent}%</span></li>
                ))}
              </ul>
            </div>
          ))}
          {!domains.length && <p className="muted">تظهر المجالات بعد ربط قاعدة البيانات.</p>}
        </div>
        <h3 className="mt-8 text-lg font-bold">المجالات المعرفية</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {COGNITIVE.map((c) => (
            <div key={c.en} className="card-3d p-5">
              <div className="flex items-baseline justify-between"><p className="text-lg font-extrabold">{c.name}</p><span className="text-2xl font-black text-aqua-600">{c.pct}%</span></div>
              <p className="mt-2 text-sm muted">{c.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink/45">
          المصدر: TIMSS 2027 Assessment Frameworks — IEA / TIMSS &amp; PIRLS International Study Center،{' '}
          <a className="underline" href="https://timss2027.org/frameworks" target="_blank" rel="noreferrer">timss2027.org/frameworks</a>
        </p>
      </section>

      {/* رحلة التعلم */}
      <section className="mt-14">
        <h2 className="h-section">رحلة التعلم</h2>
        <p className="mt-2 muted">{s.program_weeks} أسبوعًا تبدأ بقياس قبلي وتنتهي بقياس بعدي، وبينهما تدريب ودروس مرئية وتحديات.</p>
        <div className="mt-6 grid gap-3 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-5">
          {[
            { t: 'القياس القبلي', d: 'الأسبوع 1', c: 'from-sky2-300 to-sky2-400' },
            { t: 'الأعداد', d: 'تدريب ودروس', c: 'from-star-300 to-star-500' },
            { t: 'الجبر', d: 'تدريب ودروس', c: 'from-rose-300 to-rose-500' },
            { t: 'الهندسة والقياس · البيانات والاحتمالات', d: 'تدريب ودروس', c: 'from-aqua-300 to-aqua-500' },
            { t: 'القياس البعدي', d: `الأسبوع ${s.program_weeks}`, c: 'from-sky2-300 to-sky2-400' },
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
        <p className="mt-2 muted">تعتمد الألعاب على بنك الأسئلة نفسه، وتتغير أسئلتها في كل مرة.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((g) => (
            <div key={g.key} className="card-3d p-4">
              <p className="text-3xl">{g.icon}</p>
              <p className="mt-2 font-extrabold">{g.name}</p>
              <p className="mt-1 text-sm muted">{g.desc}</p>
              <span className="chip mt-3 text-ink/60">{g.ready ? 'متاحة' : 'قيد البناء'}</span>
            </div>
          ))}
        </div>
      </section>

      {/* لوحة التميز والمؤشرات */}
      <section className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="card-3d p-6">
          <h2 className="text-xl font-extrabold">لوحة نجوم التميز</h2>
          <p className="text-xs muted">أسماء مستعارة فقط حفاظًا على الخصوصية</p>
          {board.length ? (
            <ol className="mt-4 space-y-2">
              {board.map((b, i) => (
                <li key={i} className="flex items-center justify-between rounded-xl bg-ink/5 px-4 py-2">
                  <span className="font-bold">{i + 1}. {b.nickname}</span><span className="text-star-600">★ {b.stars}</span>
                </li>
              ))}
            </ol>
          ) : <p className="mt-4 muted">تظهر النجوم بعد أولى جلسات التدريب.</p>}
        </div>
        <div className="card-3d p-6">
          <h2 className="text-xl font-extrabold">مؤشرات عامة</h2>
          {stats ? (
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {[
                ['طالبات شاركن', stats.participants], ['أسئلة أُجيب عنها', stats.answered_items],
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
