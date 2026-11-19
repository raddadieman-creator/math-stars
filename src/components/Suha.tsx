/** «سُها» — الشخصية المرشدة: نجمة صغيرة (السُّها نجم خافت في الدب الأكبر كان يُختبر به حدة البصر) */
export function Suha({ size = 120, mood = 'happy', className = '' }: { size?: number; mood?: 'happy' | 'think' | 'cheer'; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} role="img" aria-label="سُها المرشدة">
      <defs>
        <radialGradient id="sg" cx="45%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff6c9" /><stop offset=".55" stopColor="#ffd04d" /><stop offset="1" stopColor="#f0a21a" />
        </radialGradient>
        <filter id="sglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path filter="url(#sglow)" fill="url(#sg)" stroke="#c97c00" strokeWidth="2" strokeLinejoin="round"
        d="M60 8 L74 40 L108 44 L82 66 L90 100 L60 83 L30 100 L38 66 L12 44 L46 40 Z" />
      {/* نظارة صغيرة توحي بالتفكير الرياضي */}
      <g fill="none" stroke="#3b2a00" strokeWidth="2.4">
        <circle cx="49" cy="56" r="8" /><circle cx="71" cy="56" r="8" /><path d="M57 56h6" />
      </g>
      <circle cx={mood === 'think' ? 51 : 49} cy={mood === 'think' ? 54 : 56} r="3" fill="#2a1d00" />
      <circle cx={mood === 'think' ? 73 : 71} cy={mood === 'think' ? 54 : 56} r="3" fill="#2a1d00" />
      {mood === 'think'
        ? <path d="M53 72 q7 -3 14 0" stroke="#2a1d00" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        : <path d="M51 69 q9 9 18 0" stroke="#2a1d00" strokeWidth="2.6" fill={mood === 'cheer' ? '#ff86b5' : 'none'} strokeLinecap="round" />}
      <circle cx="40" cy="68" r="4" fill="#ff86b5" opacity=".6" /><circle cx="80" cy="68" r="4" fill="#ff86b5" opacity=".6" />
    </svg>
  );
}
