import { notFound } from 'next/navigation';
import { requireStaff, getSettings } from '@/lib/data';
import { PrintButton } from '@/components/teacher/PrintButton';

export const dynamic = 'force-dynamic';

/** بطاقات رموز الدخول لفصل واحد، جاهزة للطباعة والقص */
export default async function CodesPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const { sb } = await requireStaff();
  const [{ data: cls }, { data: st }, s] = await Promise.all([
    sb.from('classes').select('id, name').eq('id', classId).maybeSingle(),
    sb.from('students').select('id, full_name, login_code').eq('class_id', classId).eq('is_active', true).order('full_name'),
    getSettings(),
  ]);
  if (!cls) notFound();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h1 className="text-2xl font-black">بطاقات رموز الدخول: {cls.name}</h1>
        <PrintButton />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 print:grid-cols-3">
        {(st ?? []).map((x) => (
          <div key={x.id} className="break-inside-avoid rounded-xl border-2 border-dashed border-ink/20 p-3 text-center">
            <p className="text-xs muted">{s.platform_name}</p>
            <p className="mt-1 font-extrabold leading-snug">{x.full_name}</p>
            <p className="text-xs muted">{cls.name}</p>
            <p dir="ltr" className="mt-2 font-mono text-3xl font-black tracking-[0.3em] text-sky-700">{x.login_code}</p>
            <p className="mt-1 text-[10px] muted">رمز شخصي لا يُشارك مع أحد</p>
          </div>
        ))}
      </div>
    </div>
  );
}
