import { requireStaff } from '@/lib/data';
import { createClass } from '../actions';
import { AddStudentForm, StudentRowActions } from '@/components/teacher/StudentForms';
import { ImportStudents } from '@/components/teacher/ImportStudents';

export const dynamic = 'force-dynamic';

export default async function Students() {
  const { sb, staff } = await requireStaff();
  const [{ data: classes }, { data: students }, { data: teachers }] = await Promise.all([
    sb.from('classes').select('id, name, academic_year, class_teachers(teacher_id)').order('name'),
    sb.from('students').select('id, full_name, nickname, class_id, is_active, is_demo').order('full_name'),
    sb.from('staff').select('id, full_name, role'),
  ]);
  const tName = new Map((teachers ?? []).map((t) => [t.id, t.full_name]));
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">الطلاب والفصول</h1>
      {staff.role === 'admin' && (
        <form action={createClass} className="panel grid gap-3 md:grid-cols-4">
          <h2 className="text-lg font-extrabold md:col-span-4">إنشاء فصل (للإدارة)</h2>
          <div><label className="label">اسم الفصل</label><input name="name" required className="field" placeholder="ثاني متوسط / 1" /></div>
          <div><label className="label">العام الدراسي</label><input name="year" className="field" placeholder="1448هـ" /></div>
          <div><label className="label">المعلمون</label>
            <select name="teacher_ids" multiple className="field h-24">{(teachers ?? []).filter((t) => t.role === 'teacher').map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}</select></div>
          <div className="flex items-end"><button className="btn-star w-full">إنشاء</button></div>
        </form>
      )}
      {(classes ?? []).length > 0 && <ImportStudents classes={(classes ?? []).map((c) => ({ id: c.id, name: c.name }))} />}
      {(classes ?? []).length > 0 && <AddStudentForm classes={(classes ?? []).map((c) => ({ id: c.id, name: c.name }))} />}
      {(classes ?? []).map((c) => (
        <div key={c.id} className="panel overflow-x-auto">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-extrabold">{c.name}</h2>
            <p className="text-sm muted">المعلمون: {(c.class_teachers as { teacher_id: string }[]).map((t) => tName.get(t.teacher_id)).join('، ') || '—'}</p>
          </div>
          <table className="mt-3 w-full min-w-[560px] text-sm">
            <thead className="text-ink/60"><tr><th className="text-start">الاسم</th><th className="text-start">الاسم المستعار</th><th>الحالة</th><th>إجراءات</th></tr></thead>
            <tbody>
              {(students ?? []).filter((s) => s.class_id === c.id).map((s) => (
                <tr key={s.id} className="border-t border-ink/5">
                  <td className="py-2">{s.full_name}{s.is_demo && <span className="chip mr-2 text-[10px]">تجريبية</span>}</td>
                  <td>{s.nickname}</td>
                  <td className="text-center">{s.is_active ? 'نشطة' : 'موقوفة'}</td>
                  <td className="text-center"><StudentRowActions id={s.id} active={s.is_active} name={s.full_name} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {!classes?.length && <p className="panel muted">لا توجد فصول مرتبطة بحسابك.</p>}
      <p className="text-xs text-ink/45">تدخل الطالبة باسمها الثلاثي واختيار فصلها، فلا يلزم رمز دخول. الإيقاف يمنع الدخول مؤقتًا، والحذف يزيل الطالبة وسجلاتها نهائيًا.</p>
    </div>
  );
}
