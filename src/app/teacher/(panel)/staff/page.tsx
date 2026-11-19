import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/data';
import { StaffManager } from '@/components/teacher/StaffManager';

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
  const { sb, staff } = await requireStaff();
  if (staff.role !== 'admin') redirect('/teacher');
  const [{ data: people }, { data: classes }, { data: links }] = await Promise.all([
    sb.from('staff').select('id, full_name, role').order('full_name'),
    sb.from('classes').select('id, name').order('name'),
    sb.from('class_teachers').select('class_id, teacher_id'),
  ]);
  const rows = (people ?? []).map((p) => ({ ...p, role: p.role as 'teacher' | 'admin', classIds: (links ?? []).filter((l) => l.teacher_id === p.id).map((l) => l.class_id) }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">حسابات المعلمين</h1>
        <p className="mt-1 muted">إضافة المعلمين وحذفهم، وتحديد فصول كل معلم، وإعادة تعيين رمز الدخول. يرى كل معلم فصوله فقط، وترى الإدارة جميع الفصول.</p>
      </div>
      <StaffManager me={staff.id} people={rows} classes={classes ?? []} />
    </div>
  );
}
