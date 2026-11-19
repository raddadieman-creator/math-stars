import Link from 'next/link';
import { StarField } from './StarField';
import { PrefsToggles } from './Prefs';

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-extrabold">
      <svg width={small ? 30 : 38} height={small ? 30 : 38} viewBox="0 0 40 40" aria-hidden>
        <defs><linearGradient id="lg" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#ffe08a" /><stop offset="1" stopColor="#f6b81a" /></linearGradient></defs>
        <path fill="url(#lg)" d="M20 2l5 11 12 1.5-9 8 2.6 12L20 28.6 9.4 34.5 12 22.5l-9-8L15 13z" />
        <text x="20" y="23" textAnchor="middle" fontSize="10" fontWeight="900" fill="#141244">∑</text>
      </svg>
      <span className={small ? 'text-lg' : 'text-xl'}>معًا نحو القمة</span>
      <span className="hidden text-sm font-bold text-star-600 sm:inline" dir="ltr">TIMSS</span>
    </Link>
  );
}

export function Footer({ school }: { school?: string | null }) {
  return (
    <footer className="mt-16 border-t border-ink/10 py-8 text-center text-sm text-ink/60">
      {school && <p className="mb-1">{school}</p>}
      <p>تصميم: Research by Eman</p>
    </footer>
  );
}

export function Shell({ children, right, school }: { children: React.ReactNode; right?: React.ReactNode; school?: string | null }) {
  return (
    <>
      <StarField />
      <header className="no-print sticky top-0 z-30 border-b border-ink/10 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Logo />
          <div className="flex flex-wrap items-center gap-3">{right}<PrefsToggles /></div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <Footer school={school} />
    </>
  );
}
