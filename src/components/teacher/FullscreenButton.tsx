'use client';
export function FullscreenButton({ targetId }: { targetId: string }) {
  return (
    <button type="button" className="chip px-4 py-2 font-bold" onClick={() => { const el = document.getElementById(targetId); if (!el) return; if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen?.(); }}>
      عرض على الشاشة
    </button>
  );
}
