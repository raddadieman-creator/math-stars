import Link from 'next/link';
import { requireStaff, getSettings } from '@/lib/data';
import { classReport } from '@/lib/report-data';
import { STATUS_AR } from '@/lib/types';
import { DocActions } from '@/components/teacher/DocActions';
import { Donut, HBars, KpiTiles, PALETTE } from '@/components/teacher/ReportVisuals';

export const dynamic = 'force-dynamic';

/** تقرير الفصل القابل للطباعة والتحميل بصيغة Word */
export default async function ClassReportPage({ searchParams }: { searchParams: Promise<{ class?: string }> }) {
  const { sb, staff } = await requireStaff();
  const sp = await searchParams;
  const [{ data: classes }, s] = await Promise.all([sb.from('classes').select('id, name').order('name'), getSettings()]);
  if (!classes?.length) return <p className="panel">لا توجد فصول مرتبطة بالحساب.</p>;
  const cls = classes.find((c) => c.id === sp.class) ?? classes[0];
  const r = await classReport(sb, cls.id);
  const today = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const dist = r.ci.masteryDistribution;
  const statusColors = { mastered: '#22c55e', developing: '#0284c7', needs_support: '#e8466c' } as const;

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">{classes.map((c) => <Link key={c.id} href={`/teacher/report?class=${c.id}`} className={`chip px-4 py-2 ${c.id === cls.id ? 'bg-star-400' : ''}`}>{c.name}</Link>)}</div>
        <DocActions targetId="report" filename={`تقرير ${cls.name}`} title={`تقرير ${cls.name}`} />
      </div>

      <article id="report" className="doc-sheet panel space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-3 border-b-4 border-sky-500 pb-4">
          <div>
            <h1 className="text-2xl font-black text-sky-700">تقرير متابعة الفصل: {cls.name}</h1>
            <p className="font-bold">{s.platform_name}</p>
            <p className="text-sm muted">{s.school_name ?? ''}</p>
          </div>
          <div className="text-sm">
            <p>تاريخ التقرير: {today}</p>
            <p>أعدّه: {staff.full_name}</p>
          </div>
        </header>

        <KpiTiles items={[
          { label: 'المشاركة', value: `${r.ci.participants} من ${r.ci.enrolled}`, hint: r.ci.participationPct !== null ? `${r.ci.participationPct}%` : undefined, color: '#0284c7' },
          { label: 'الصحيحة من المحاولة الأولى', value: r.ci.avgFirstTryPct !== null ? `${r.ci.avgFirstTryPct}%` : null, hint: 'متوسط نسب الطالبات', color: '#14b8a6' },
          { label: 'النجوم', value: r.totals.stars, hint: `${r.totals.badges} شارة`, color: '#f59e0b' },
          { label: 'تحتاج إلى دعم', value: r.ci.needsSupportStudents, hint: 'في مهارة واحدة على الأقل', color: '#e8466c' },
        ]} />

        <section className="grid gap-6 md:grid-cols-2">
          <div className="doc-break">
            <h2 className="mb-2 text-lg font-extrabold">مستويات الإتقان (طالبة × مهارة)</h2>
            <Donut data={(['mastered', 'developing', 'needs_support'] as const).map((k) => ({ name: STATUS_AR[k], value: dist[k], color: statusColors[k] }))} />
          </div>
          <div className="doc-break">
            <h2 className="mb-2 text-lg font-extrabold">الإتقان حسب المجال</h2>
            <HBars unit="%" max={100} data={r.domains.map((d, i) => ({ name: d.name, value: d.pct, color: PALETTE[i] }))} />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="doc-break">
            <h2 className="mb-2 text-lg font-extrabold">القياس القبلي والبعدي (متوسط الفصل)</h2>
            <HBars unit="%" max={100} data={[
              { name: `القبلي (${r.prePost.preN} طالبة)`, value: r.prePost.pre, color: '#94a3b8' },
              { name: `البعدي (${r.prePost.postN} طالبة)`, value: r.prePost.post, color: '#22c55e' },
            ]} />
            <p className="mt-1 text-xs muted">مقارنة وصفية، ولا تُعد دليلًا على أن التدريب سبب الفرق.</p>
          </div>
          <div className="doc-break">
            <h2 className="mb-2 text-lg font-extrabold">المهارات الأكثر صعوبة</h2>
            {r.hard.length ? <HBars unit="%" max={100} data={r.hard.map((h) => ({ name: h.name, value: h.pct, color: '#e8466c' }))} /> : <p className="muted">لا توجد بيانات كافية بعد.</p>}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-extrabold">بيانات الطالبات</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead><tr className="bg-sky-50 text-sky-900">
                {['#', 'الطالبة', 'الجلسات', 'الأسئلة', 'من المحاولة الأولى', 'مهارات متقنة', 'القبلي', 'البعدي', 'النجوم', 'الشارات', 'الحالة'].map((h) => <th key={h} className="border border-ink/10 px-2 py-2">{h}</th>)}
              </tr></thead>
              <tbody>
                {r.rows.map((x, i) => (
                  <tr key={x.id} className="text-center even:bg-ink/[.03]">
                    <td className="border border-ink/10 px-2 py-1.5">{i + 1}</td>
                    <td className="border border-ink/10 px-2 py-1.5 text-start font-bold">{x.name}</td>
                    <td className="border border-ink/10">{x.sessions}</td><td className="border border-ink/10">{x.items}</td>
                    <td className="border border-ink/10">{x.firstTry !== null ? `${x.firstTry}%` : '—'}</td>
                    <td className="border border-ink/10">{x.mastered}</td>
                    <td className="border border-ink/10">{x.pre !== null ? `${x.pre}%` : '—'}</td>
                    <td className="border border-ink/10">{x.post !== null ? `${x.post}%` : '—'}</td>
                    <td className="border border-ink/10">{x.stars}</td><td className="border border-ink/10">{x.badges}</td>
                    <td className="border border-ink/10" style={{ color: x.status === 'تحتاج إلى دعم' ? '#e8466c' : undefined }}>{x.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="grid grid-cols-2 gap-6 border-t border-ink/10 pt-6 text-sm">
          <p>المعلمة: ........................................</p>
          <p>مديرة المدرسة: {s.principal_name ?? '........................................'}</p>
          <p className="col-span-2 text-xs muted">المؤشرات وصفية مبنية على البيانات المحفوظة في المنصة حتى تاريخ التقرير.</p>
        </footer>
      </article>
    </div>
  );
}
