import Link from 'next/link';
import { requireStaff, getSettings } from '@/lib/data';
import { skillNames } from '@/lib/teacher-data';
import { studentIndicators, weeklySeries, type OutcomeRow } from '@/lib/metrics';
import { STATUS_AR, type MasteryStatus } from '@/lib/types';
import { WeeklyChart, SimpleBars } from '@/components/teacher/Charts';
import { PrintButton } from '@/components/teacher/PrintButton';

export const dynamic = 'force-dynamic';

export default async function StudentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb } = await requireStaff();
  const settings = await getSettings();
  const { data: st } = await sb.from('students').select('id, full_name, nickname, classes(name)').eq('id', id).single();
  if (!st) return <p className="panel">لا تملكين صلاحية عرض هذه الطالبة أو أنها غير موجودة.</p>;
  const [{ data: outs }, { data: mastery }, { data: errs }, { data: stars }, names] = await Promise.all([
    sb.from('item_outcomes').select('student_id, skill_id, session_id, tries, outcome, total_time_ms, created_at').eq('student_id', id).order('created_at'),
    sb.from('skill_mastery').select('skill_id, status, level, items_seen, recent_outcomes').eq('student_id', id),
    sb.from('attempts').select('error_type').eq('student_id', id).eq('is_correct', false),
    sb.from('star_ledger').select('amount').eq('student_id', id),
    skillNames(sb),
  ]);
  const rows = (outs ?? []) as OutcomeRow[];
  const ind = studentIndicators(rows);
  const start = settings.program_start_date ? new Date(settings.program_start_date) : null;
  const errCounts = new Map<string, number>();
  (errs ?? []).forEach((e) => errCounts.set(e.error_type ?? 'غير مصنف', (errCounts.get(e.error_type ?? 'غير مصنف') ?? 0) + 1));
  const cls = st.classes as unknown as { name: string } | null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><Link href="/teacher" className="text-sm muted">← لوحة المتابعة</Link><h1 className="text-3xl font-black">{st.full_name}</h1><p className="muted">{cls?.name} · الاسم المستعار: {st.nickname} · ★ {(stars ?? []).reduce((a, s) => a + s.amount, 0)}</p></div>
        <PrintButton label="طباعة تقرير الطالبة" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['التدريبات المنجزة', ind.sessions], ['إجمالي المحاولات', ind.totalTries], ['الأسئلة المجاب عنها', ind.itemsAnswered],
          ['الصحيحة من المحاولة الأولى', ind.firstTryPct !== null ? `${ind.firstTryPct}%` : '—'],
          ['الصحيحة بعد مساعدة', ind.withHelpPct !== null ? `${ind.withHelpPct}%` : '—'], ['بعد كشف الحل', ind.afterRevealPct !== null ? `${ind.afterRevealPct}%` : '—'],
          ['الزمن (دقيقة)', ind.totalMinutes], ['مرات إعادة التدريب', ind.retrainCount],
        ].map(([k, v]) => <div key={String(k)} className="panel"><p className="text-xs muted">{k}</p><p className="mt-1 text-2xl font-black">{v}</p></div>)}
      </div>
      <div className="panel"><h2 className="text-lg font-extrabold">التطور الأسبوعي</h2>{start ? <WeeklyChart data={weeklySeries(rows, start, settings.program_weeks)} /> : <p className="muted">حددي تاريخ بداية البرنامج من الإعدادات.</p>}</div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel overflow-x-auto">
          <h2 className="mb-3 text-lg font-extrabold">الإتقان في كل مهارة</h2>
          <table className="w-full text-sm"><thead className="text-ink/60"><tr><th className="text-start">المهارة</th><th>المستوى</th><th>الأسئلة</th><th>الحالة</th></tr></thead>
            <tbody>{(mastery ?? []).map((m) => (
              <tr key={m.skill_id} className="border-t border-ink/5 text-center"><td className="py-2 text-start">{names.get(m.skill_id)}</td><td>{m.level}</td><td>{m.items_seen}</td><td>{STATUS_AR[m.status as MasteryStatus]}</td></tr>
            ))}</tbody></table>
          {!mastery?.length && <p className="muted">لم تبدأ التدريب بعد.</p>}
        </div>
        <div className="panel">
          <h2 className="text-lg font-extrabold">أنواع الأخطاء المتكررة</h2>
          {errCounts.size ? <SimpleBars color="#f0569a" data={[...errCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name, value }))} /> : <p className="mt-2 muted">لا توجد أخطاء مسجلة.</p>}
        </div>
      </div>
    </div>
  );
}
