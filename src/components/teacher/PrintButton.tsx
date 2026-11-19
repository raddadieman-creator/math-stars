'use client';
export function PrintButton({ label = 'طباعة / حفظ PDF' }: { label?: string }) {
  return <button onClick={() => window.print()} className="btn-ghost no-print">{label}</button>;
}
