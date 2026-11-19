import Link from 'next/link';
import { requireStaff, getSettings } from '@/lib/data';
import { classData, skillNames } from '@/lib/teacher-data';
import { classIndicators, hardestSkills, studentIndicators, weeklySeries } from '@/lib/metrics';
import { STATUS_AR } from '@/lib/types';
import { WeeklyChart, SimpleBars } from '@/components/teacher/Charts';

export const dynamic = 'force-dynamic';

function Kpi({ label, value, hint }: { label: string; value: string | number | null; hint?: string }) {
  return (
    <div className="panel"><p className="text-xs muted">{label}</p><p className="mt-1 text-3xl font-black">{value ?? '—'}</p>{hint && <p className="text-xs text-ink/45">{hint}</p>}</div>
  );
}

export default async function Overview({ searchParams }: { searchParams: Promise<{ class?: string }> }) {
  const { sb } = await requireStaff();
  const sp = await searchParams;
  const settings = await getSettings();
  const { data: classes } = await sb.from('classes').select('id, name').order('name');
  if (!classes?.length) {
    return <div className="panel"><h1 className="text-2xl font-black">لوحة المتابعة</h1><p className="mt-2 muted">لا توجد فصول مرتبطة بالحساب بعد. تنشئ الإدارة الفصول وتربطها بالمعلمين من صفحة «الطلاب والفصول».</p></div>;
  }
  const classId = sp.class && classes.some((c) => c.id === sp.class) ? sp.class : classes[0].id;
  const [{ students, outcomes, mastery }, names] = await Promise.all([classData(sb, classId), skillNames(sb)]);
  const ci = classIndicators(students.filter((s) => s.is_active).map((s) => s.id), outcomes, mastery);
  const start = settings.program_start_date ? new Date(settings.program_start_date) : null;
  const weekly = weeklySeries(outcomes, start, settings.program_weeks);
  const hard = hardestSkills(outcomes, 5).slice(0, 6);
  const supportSet = new Set(mastery.filter((m) => m.status === 'needs_support').map((m) => m.student_id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">لوحة المتابعة</h1>
        <div className="flex flex-wrap gap-2">
          {classes.map((c) => <Link key={c.id} href={`/teacher?class=${c.id}`} className={`chip px-4 py-2 ${c.id === classId ? 'bg-star-400 text-night-950' : ''}`}>{c.name}</Link>)}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="الطلاب المشاركون" value={`${ci.participants} من ${ci.enrolled}`} hint={ci.participationPct !== null ? `نسبة المشاركة ${ci.participationPct}%` : undefined} />
        <Kpi label="متوسط الصحيحة من المحاولة الأولى" value={ci.avgFirstTryPct !== null ? `${ci.avgFirstTryPct}%` : null} hint="متوسط نسب الطلاب" />
        <Kpi label="طلاب يحتاجون إلى دعم" value={ci.needsSupportStudents} hint="في مهارة واحدة على الأقل" />
        <Kpi label="طلاب متقدمون" value={ci.advancedStudents} hint="أتقنوا مهارتين فأكثر دون حاجة إلى دعم" />
      </div>

      <div className="panel">
        <h2 className="text-lg font-extrabold">التطور عبر أسابيع البرنامج</h2>
        {start ? <WeeklyChart data={weekly} /> : <p className="mt-2 muted">يظهر التطور الأسبوعي بعد تحديد تاريخ بداية البرنامج في الإعدادات.</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <h2 className="text-lg font-extrabold">توزيع مستويات الإتقان (طالب × مهارة)</h2>
          <SimpleBars color="#6aa8ff" data={(Object.keys(ci.masteryDistribution) as (keyof typeof STATUS_AR)[]).filter((k) => k !== 'not_started').map((k) => ({ name: STATUS_AR[k], value: ci.masteryDistribution[k] }))} />
        </div>
        <div className="panel">
          <h2 className="text-lg font-extrabold">المهارات الأكثر صعوبة</h2>
          <p className="text-xs muted">الأدنى في نسبة الإجابة من المحاولة الأولى (5 أسئلة فأكثر)</p>
          {hard.length ? <SimpleBars unit="%" max={100} data={hard.map((h) => ({ name: names.get(h.skill_id) ?? '—', value: h.firstTryPct }))} /> : <p className="mt-3 muted">لا توجد بيانات كافية بعد.</p>}
        </div>
      </div>

      <div className="panel overflow-x-auto">
        <h2 className="mb-3 text-lg font-extrabold">الطلاب</h2>
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-ink/60"><tr className="border-b border-ink/10 text-start">
            <th className="py-2 text-start">الطالب</th><th>الجلسات</th><th>الأسئلة</th><th>من المحاولة الأولى</th><th>بعد مساعدة</th><th>إعادة التدريب</th><th>الحالة</th>
          </tr></thead>
          <tbody>
            {students.map((s) => {
              const ind = studentIndicators(outcomes.filter((o) => o.student_id === s.id));
              return (
                <tr key={s.id} className="border-b border-ink/5 text-center">
                  <td className="py-2 text-start"><Link className="font-bold underline-offset-4 hover:underline" href={`/teacher/students/${s.id}`}>{s.full_name}</Link>{s.is_demo && <span className="chip mr-2 text-[10px]">تجريبية</span>}</td>
                  <td>{ind.sessions}</td><td>{ind.itemsAnswered}</td>
                  <td>{ind.firstTryPct ?? '—'}{ind.firstTryPct !== null && '%'}</td>
                  <td>{ind.withHelpPct ?? '—'}{ind.withHelpPct !== null && '%'}</td>
                  <td>{ind.retrainCount}</td>
                  <td>{supportSet.has(s.id) ? <span className="chip bg-rose-500/20 text-rose-600">تحتاج إلى دعم</span> : ind.itemsAnswered ? <span className="chip">متابعة</span> : <span className="chip text-ink/50">لم تبدأ</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-ink/45">المؤشرات وصفية مبنية على البيانات المحفوظة فعليًا. عدد مرات التدريب لا يدخل في حساب الإتقان.</p>
    </div>
  );
}
