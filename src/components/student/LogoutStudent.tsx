'use client';
import { useRouter } from 'next/navigation';
export function LogoutStudent() {
  const router = useRouter();
  return (
    <button className="chip hover:bg-ink/5" onClick={async () => { await fetch('/api/student/logout', { method: 'POST' }); router.push('/'); }}>
      تسجيل الخروج
    </button>
  );
}
