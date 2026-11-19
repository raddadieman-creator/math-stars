'use client';
import { useEffect } from 'react';

/** يسجّل عامل الخدمة لتعمل المنصة كتطبيق عند إضافتها إلى الشاشة الرئيسية في الجوال والآيباد */
export function AppShellPWA() {
  useEffect(() => {
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);
  return null;
}
