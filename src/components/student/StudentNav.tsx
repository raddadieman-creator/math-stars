'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS: [string, string][] = [['/student', 'صفحتي'], ['/student/challenges', 'التحديات'], ['/student/library', 'المكتبة'], ['/student/honor', 'لوحة التميز'], ['/student/badges', 'أوسمتي']];

/** تبويبات الطالب الثابتة أعلى الصفحات */
export function StudentNav() {
  const p = usePathname();
  return (
    <nav className="mb-6 flex flex-wrap gap-2" aria-label="أقسام الطالب">
      {TABS.map(([href, label]) => {
        const on = href === '/student' ? p === href : p.startsWith(href);
        return <Link key={href} href={href} className={`rounded-xl px-4 py-2 text-sm font-bold ${on ? 'bg-ink text-white' : 'border border-ink/15 bg-white hover:bg-ink/5'}`}>{label}</Link>;
      })}
    </nav>
  );
}
