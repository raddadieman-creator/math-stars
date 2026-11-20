import Link from 'next/link';
import { requireStaff, getSettings } from '@/lib/data';
import { classData, skillNames } from '@/lib/teacher-data';
import { classIndicators, hardestSkills, studentIndicators, weeklySeries } from '@/lib/metrics';
import { STATUS_AR } from '@/lib/types';
import { WeeklyChart, SimpleBars } from '@/components/teacher/Charts';
import { MeasurePanel } from '@/components/teacher/MeasurePanel';
import { classReport } from '@/lib/report-data';
import { Donut, HBars, KpiTiles, PALETTE } from '@/components/teacher/ReportVisuals';

export const dynamic = 'force-dynamic';

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
  const { data: mAs } = await sb.from('assessments').select('id, kind, is_open').in('kind', ['pre', 'post']);
  const ids = students.map((st) => st.id);
  const { data: mAtt } = ids.length && mAs?.length ? await sb.from('assessment_attempts').select('assessment_id, student_id, score, max_score').in('student_id', ids).in('assessment_id', mAs.map((x) => x.id)).not('submitted_at', 'is', null) : { data: [] as { assessment_id: string; student_id: string; score: number; max_score: number }[] };
  const pctOf = (sid: string, kind: string) => { const a = mAs?.find((x) => x.kind === kind); const t = (mAtt ?? []).find((x) => x.student_id === sid && x.assessment_id === a?.id); return t ? Math.round((t.score / Math.max(1, t.max_score)) * 100) : null; };
  const postA = mAs?.find((x) => x.kind === 'post');
  const measureRows = students.filter((st) => st.is_active).map((st) => ({ id: st.id, name: st.full_name, pre: pctOf(st.id, 'pre'), post: pctOf(st.id, 'post') }));
  const ci = classIndicators(students.filter((s) => s.is_active).map((s) => s.id), outcomes, mastery);
  const start = settings.program_start_date ? new Date(settings.program_start_date) : null;
  const weekly = weeklySeries(outcomes, start, settings.program_weeks);
  const hard = hardestSkills(outcomes, 5).slice(0, 6);
  const supportSet = new Set(mastery.filter((m) => m.status === 'needs_support').map((m) => m.student_id));
  const rep = await classReport(sb, classId);
  const topStars = [...rep.rows].sort((a, b) => b.stars - a.stars).filter((x) => x.stars > 0).slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">لوحة المتابعة</h1>
        <div className="flex flex-wrap gap-2">
          {classes.map((c) => <Link key={c.id} href={`/teacher?class=${c.id}`} className={`chip px-4 py-2 ${c.id === classId ? 'bg-star-400 text-night-950' : ''}`}>{c.name}</Link>)}
        </div>
      </div>

      <MeasurePanel rows={measureRows} postOpen={!!postA?.is_open} postId={postA?.id ?? null} />

      <div className="flex flex-wrap gap-2">
        <Link href={`/teacher/report?class=${classId}`} className="btn-star">تقرير الفصل (PDF / Word)</Link>
        <Link href={`/teacher/students/list/${classId}`} className="chip px-4 py-2 font-bold">قائمة الأسماء (PDF / Word)</Link>
        <Link href={`/teacher/awards?class=${classId}`} className="chip px-4 py-2 font-bold">المنجزات والشهادات</Link>
      </div>

      <KpiTiles items={[
        { label: 'الطالبات المشاركات', value: `${ci.participants} من ${ci.enrolled}`, hint: ci.participationPct !== null ? `نسبة المشاركة ${ci.participationPct}%` : undefined, color: '#0284c7' },
        { label: 'الصحيحة من المحاولة الأولى', value: ci.avgFirstTryPct !== null ? `${ci.avgFirstTryPct}%` : null, hint: 'متوسط نسب الطالبات', color: '#14b8a6' },
        { label: 'النجوم والشارات', value: `★ ${rep.totals.stars}`, hint: `${rep.totals.badges} شارة في الفصل`, color: '#f59e0b' },
        { label: 'تحتاج إلى دعم', value: ci.needsSupportStudents, hint: `متقدمات: ${ci.advancedStudents}`, color: '#e8466c' },
      ]} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="panel">
          <h2 className="mb-3 text-lg font-extrabold">مستويات الإتقان</h2>
          <Donut data={[
            { name: 'متقنة', value: ci.masteryDistribution.mastered, color: '#22c55e' },
            { name: 'قيد التطور', value: ci.masteryDistribution.developing, color: '#0284c7' },
            { name: 'تحتاج إلى دعم', value: ci.masteryDistribution.needs_support, color: '#e8466c' },
          ]} />
        </div>
        <div className="panel">
          <h2 className="mb-3 text-lg font-extrabold">الإتقان حسب المجال</h2>
          <HBars unit="%" max={100} data={rep.domains.map((d, i) => ({ name: d.name, value: d.pct, color: PALETTE[i] }))} />
        </div>
        <div className="panel">
          <h2 className="mb-3 text-lg font-extrabold">القياس القبلي والبعدي</h2>
          <HBars unit="%" max={100} data={[{ name: `القبلي (${rep.prePost.preN})`, value: rep.prePost.pre, color: '#94a3b8' }, { name: `البعدي (${rep.prePost.postN})`, value: rep.prePost.post, color: '#22c55e' }]} />
          <p className="mt-2 text-xs muted">متوسط الفصل، ومقارنة وصفية فقط.</p>
        </div>
      </div>

      <div className="panel">
        <h2 className="mb-3 text-lg font-extrabold">الأكثر جمعًا للنجوم</h2>
        {topStars.length ? <HBars data={topStars.map((x, i) => ({ name: x.name, value: x.stars, color: ['#f59e0b', '#94a3b8', '#f97316'][i] ?? '#0284c7' }))} /> : <p className="muted">لا توجد نجوم بعد.</p>}
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
