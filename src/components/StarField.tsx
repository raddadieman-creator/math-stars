// نجوم ثابتة المواقع (حتمية) لتفادي اختلاف العرض بين الخادم والمتصفح
const STARS = Array.from({ length: 48 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 9301 + n * 49297) + 1) / 2);
  const q = (v: number) => Math.round(v * 100) / 100;
  return { top: q(r(1) * 100), left: q(r(2) * 100), size: q(1 + r(3) * 2.5), delay: q(r(4) * 3.5) };
});
export function StarField() {
  return (
    <div aria-hidden className="starfield pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {STARS.map((s, i) => (
        <span key={i} style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
      ))}
    </div>
  );
}
