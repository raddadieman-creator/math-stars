import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { requireStaff } from '@/lib/data';
import { signOut } from './actions';

export const dynamic = 'force-dynamic';

const NAV = [
  ['/teacher', 'لوحة المتابعة'], ['/teacher/students', 'الطلاب والفصول'], ['/teacher/questions', 'بنك الأسئلة'], ['/teacher/library', 'مكتبة النماذج'],
  ['/teacher/lessons', 'الدروس المرئية'], ['/teacher/settings', 'الإعدادات والقواعد'],
] as const;

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { staff } = await requireStaff();
  return (
    <Shell right={
      <form action={signOut} className="flex items-center gap-2">
        <span className="text-sm muted">{staff.full_name} · {staff.role === 'admin' ? 'الإدارة' : 'معلم'}</span>
        <button className="chip hover:bg-ink/5">خروج</button>
      </form>
    }>
      <nav className="no-print mb-6 flex flex-wrap gap-2">
        {NAV.map(([href, label]) => <Link key={href} href={href} className="chip px-4 py-2 text-sm hover:bg-ink/5">{label}</Link>)}
      </nav>
      {children}
    </Shell>
  );
}
