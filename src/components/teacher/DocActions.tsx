'use client';

/** أزرار التصدير: طباعة/حفظ PDF، وتحميل ملف Word من محتوى العنصر نفسه، ومشاركة نص عبر واتساب */
export function DocActions({ targetId, filename, title, whatsapp }: { targetId: string; filename: string; title: string; whatsapp?: string }) {
  const toWord = () => {
    const el = document.getElementById(targetId); if (!el) return;
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.no-print, button, svg').forEach((n) => n.remove());
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40" dir="rtl" lang="ar">
<head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:'Sakkal Majalla','Traditional Arabic',Tahoma,Arial,sans-serif;direction:rtl;font-size:13pt}
table{border-collapse:collapse;width:100%;margin:6pt 0}td,th{border:1px solid #9aa5b8;padding:4pt 6pt;text-align:right;vertical-align:middle}
th{background:#e0f2fe}h1{font-size:20pt;color:#0369a1}h2{font-size:15pt;color:#0f172a;margin-top:14pt}.bar{height:10pt}</style></head>
<body>${clone.innerHTML}</body></html>`;
    const blob = new Blob(['﻿', html], { type: 'application/msword' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${filename}.doc`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  return (
    <div className="no-print flex flex-wrap gap-2">
      <button type="button" onClick={() => window.print()} className="btn-star">طباعة / حفظ PDF</button>
      <button type="button" onClick={toWord} className="chip px-4 py-2 font-bold">تحميل Word</button>
      {whatsapp && <a href={`https://wa.me/?text=${encodeURIComponent(whatsapp)}`} target="_blank" rel="noopener noreferrer" className="chip px-4 py-2 font-bold text-emerald-700">مشاركة واتساب</a>}
    </div>
  );
}
