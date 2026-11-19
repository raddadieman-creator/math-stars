/** «سُها» — روبوت مرافق بشاشة وجه مضيئة وهوائي ينتهي بنجمة (SVG داخلي ثابت) */
function suhaSVG(size: number, mood: string): string {
  const id = 's' + size + mood;
  const eyes = mood === 'think'
    ? `<circle cx="48" cy="54" r="4.2" fill="#5ef0dc"/><circle cx="72" cy="54" r="4.2" fill="#5ef0dc"/><path d="M48 46.5 l6 -2" stroke="#5ef0dc" stroke-width="2.4" stroke-linecap="round"/>`
    : mood === 'cheer'
    ? `<path d="M43 57 l5 -6 l5 6" fill="none" stroke="#5ef0dc" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M67 57 l5 -6 l5 6" fill="none" stroke="#5ef0dc" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M43 57 q5 -7 10 0" fill="none" stroke="#5ef0dc" stroke-width="4" stroke-linecap="round"/><path d="M67 57 q5 -7 10 0" fill="none" stroke="#5ef0dc" stroke-width="4" stroke-linecap="round"/>`;
  const mouth = mood === 'think'
    ? `<path d="M55 67 h10" stroke="#5ef0dc" stroke-width="2.6" stroke-linecap="round"/>`
    : `<path d="M53 65 q7 ${mood === 'cheer' ? 7 : 5} 14 0" fill="none" stroke="#5ef0dc" stroke-width="2.6" stroke-linecap="round"/>`;
  const sparkles = mood === 'cheer'
    ? `<path d="M104 30 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" fill="#ffd04d"/><path d="M14 40 l1.4 3.6 l3.6 1.4 l-3.6 1.4 l-1.4 3.6 l-1.4 -3.6 l-3.6 -1.4 l3.6 -1.4 z" fill="#ff86b5"/>`
    : mood === 'think' ? `<circle cx="100" cy="24" r="2.6" fill="#b8a9ff"/><circle cx="107" cy="16" r="3.4" fill="#b8a9ff"/>` : '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 120 120" role="img" aria-label="سُها">
  <defs>
    <linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3dbff"/></linearGradient>
    <linearGradient id="${id}v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2e2672"/><stop offset="1" stop-color="#17123f"/></linearGradient>
    <radialGradient id="${id}g" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#3fdcc8" stop-opacity=".35"/><stop offset="1" stop-color="#3fdcc8" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse cx="60" cy="113" rx="20" ry="3.5" fill="#2b2457" opacity=".12"/>
  <circle cx="60" cy="56" r="44" fill="url(#${id}g)"/>
  <path d="M60 26 V15" stroke="#b8a9ff" stroke-width="3" stroke-linecap="round"/>
  <path d="M60 3 l2.6 6.4 l6.4 2.6 l-6.4 2.6 l-2.6 6.4 l-2.6 -6.4 l-6.4 -2.6 l6.4 -2.6 z" fill="#f6b81a"/>
  <rect x="44" y="84" width="32" height="20" rx="10" fill="url(#${id}h)" stroke="#d6ccff"/>
  <circle cx="60" cy="94" r="3.4" fill="#f6b81a"/>
  <rect x="19" y="47" width="9" height="18" rx="4.5" fill="#c9bcff"/><rect x="92" y="47" width="9" height="18" rx="4.5" fill="#c9bcff"/>
  <rect x="24" y="24" width="72" height="62" rx="27" fill="url(#${id}h)" stroke="#d6ccff" stroke-width="1.5"/>
  <rect x="32" y="36" width="56" height="40" rx="18" fill="url(#${id}v)"/>
  <path d="M38 44 q8 -6 22 -6" stroke="#ffffff" stroke-opacity=".25" stroke-width="3" fill="none" stroke-linecap="round"/>
  ${eyes}${mouth}
  <ellipse cx="40" cy="65" rx="3.6" ry="2.2" fill="#ff86b5" opacity=".75"/><ellipse cx="80" cy="65" rx="3.6" ry="2.2" fill="#ff86b5" opacity=".75"/>
  ${sparkles}</svg>`;
}


export function Suha({ size = 120, mood = 'happy', className = '' }: { size?: number; mood?: 'happy' | 'think' | 'cheer'; className?: string }) {
  return <span className={`inline-block ${className}`} dangerouslySetInnerHTML={{ __html: suhaSVG(size, mood) }} />;
}
