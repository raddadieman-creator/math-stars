import { notFound } from 'next/navigation';
import { requireStaff, getSettings } from '@/lib/data';
import { DocActions } from '@/components/teacher/DocActions';

export const dynamic = 'force-dynamic';

/** قائمة أسماء طالبات الفصل للطباعة أو الحفظ PDF أو Word */
export default async function NamesList({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const { sb } = await requireStaff();
  const [{ data: cls }, { data: st }, s] = await Promise.all([
    sb.from('classes').select('id, name, academic_year').eq('id', classId).maybeSingle(),
    sb.from('students').select('id, full_name, is_active').eq('class_id', classId).order('full_name'),
    getSettings(),
  ]);
  if (!cls) notFound();
  return (
    <div className="space-y-4">
      <div className="no-print flex justify-end"><DocActions targetId="names" filename={`أسماء ${cls.name}`} title={`أسماء ${cls.name}`} /></div>
      <article id="names" className="doc-sheet panel">
        <h1 className="text-2xl font-black text-sky-700">أسماء طالبات {cls.name}</h1>
        <p className="text-sm">{s.school_name ?? ''} · {s.platform_name} · العام الدراسي {cls.academic_year ?? ''}</p>
        <table className="mt-4 w-full border-collapse text-sm">
          <thead><tr className="bg-sky-50"><th className="w-12 border border-ink/15 py-2">م</th><th className="border border-ink/15 py-2 text-start">اسم الطالبة</th><th className="w-28 border border-ink/15">الحالة</th></tr></thead>
          <tbody>
            {(st ?? []).map((x, i) => (
              <tr key={x.id} className="even:bg-ink/[.03]">
                <td className="border border-ink/15 py-1.5 text-center">{i + 1}</td>
                <td className="border border-ink/15 px-3 py-1.5">{x.full_name}</td>
                <td className="border border-ink/15 text-center">{x.is_active ? 'نشطة' : 'موقوفة'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm">العدد: {(st ?? []).length}</p>
      </article>
    </div>
  );
}
