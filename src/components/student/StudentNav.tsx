'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS: [string, string, string][] = [
  ['/student', 'صفحتي', 'M4 11l8-7 8 7v9H4z'],
  ['/student/challenges', 'التحديات', 'M7 4h10v4a5 5 0 01-10 0zM12 13v4M8 20h8M7 6H4a3 3 0 003 4M17 6h3a3 3 0 01-3 4'],
  ['/student/library', 'المكتبة', 'M5 4h5v16H5zM14 4l5 1-3 15-5-1z'],
  ['/student/honor', 'لوحة التميز', 'M4 20h16M6 20V11h4v9M10 20V7h4v13M14 20v-6h4v6'],
  ['/student/badges', 'أوسمتي', 'M12 3l8 4.5v9L12 21l-8-4.5v-9z'],
];

/** تبويبات الطالب: صف أعلى الصفحة على الشاشات الكبيرة، وشريط سفلي ثابت على الجوال */
export function StudentNav() {
  const p = usePathname();
  const on = (href: string) => (href === '/student' ? p === href : p.startsWith(href));
  return (
    <>
      <nav className="mb-6 hidden flex-wrap gap-2 md:flex" aria-label="أقسام الطالب">
        {TABS.map(([href, label]) => <Link key={href} href={href} className={`rounded-xl px-4 py-2 text-sm font-bold ${on(href) ? 'bg-ink text-white' : 'border border-ink/15 bg-white hover:bg-ink/5'}`}>{label}</Link>)}
      </nav>
      <nav className="student-tabbar fixed inset-x-0 bottom-0 z-50 flex border-t border-ink/10 bg-white px-1.5 pb-[calc(.35rem+env(safe-area-inset-bottom))] pt-1.5 md:hidden" aria-label="أقسام الطالب">
        {TABS.map(([href, label, d]) => (
          <Link key={href} href={href} className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-extrabold ${on(href) ? 'bg-star-300/40 text-ink' : 'text-ink/55'}`}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>{label}
          </Link>
        ))}
      </nav>
    </>
  );
}
