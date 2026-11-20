'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

/** زرّا التنقل: رجوع إلى الصفحة السابقة، والعودة إلى الصفحة الرئيسية (لا يظهران في الرئيسية نفسها) */
export function NavButtons() {
  const p = usePathname(), router = useRouter();
  if (p === '/') return null;
  const back = () => { if (window.history.length > 1) router.back(); else router.push('/'); };
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={back} aria-label="رجوع إلى الصفحة السابقة" className="flex items-center gap-1 rounded-xl border border-ink/15 bg-white px-3 py-1.5 text-sm font-bold hover:bg-ink/5">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>رجوع
      </button>
      <Link href="/" aria-label="الصفحة الرئيسية" className="flex items-center gap-1 rounded-xl bg-sky-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-sky-700">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>الرئيسية
      </Link>
    </div>
  );
}
