import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Prefs } from '@/components/Prefs';

export const metadata: Metadata = {
  title: 'نجوم الرياضيات | Math Stars',
  description: 'منصة تدريب تفاعلية في الرياضيات لطالبات الصف الثاني المتوسط',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#fbf8ff' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <Prefs>{children}</Prefs>
      </body>
    </html>
  );
}
