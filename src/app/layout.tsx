import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Prefs } from '@/components/Prefs';
import { AppShellPWA } from '@/components/AppShellPWA';

export const metadata: Metadata = {
  title: 'نجوم الرياضيات | Math Stars',
  description: 'منصة تدريب تفاعلية في الرياضيات لطلاب الصف الثاني المتوسط',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'نجوم الرياضيات', statusBarStyle: 'default' },
  icons: { icon: [{ url: '/icons/icon-32.png', sizes: '32x32' }, { url: '/icons/icon-192.png', sizes: '192x192' }], apple: '/icons/icon-180.png' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0284c7' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">
        <Prefs>{children}</Prefs>
        <AppShellPWA />
      </body>
    </html>
  );
}
