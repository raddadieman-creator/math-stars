/** «مِحوَر» — الشخصية المرشدة: مكعب ثلاثي الأبعاد أوجهه مجالات المحتوى الأربعة في إطار TIMSS للصف الثامن.
 *  idle: يدور بين المجالات · correct: قلبة احتفال · hint: ميلان متسائل · reveal: إيماءة الشرح */
function mihwarHTML(size: number, mood: string, named?: boolean): string {
  const tri = '<svg viewBox="0 0 40 40"><path d="M20 5 L36 34 H4 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><path d="M20 34 V22" stroke="currentColor" stroke-width="2.5" stroke-dasharray="3 3"/></svg>';
  const bars = '<svg viewBox="0 0 40 40"><rect x="5" y="22" width="7" height="13" rx="2" fill="currentColor"/><rect x="16.5" y="12" width="7" height="23" rx="2" fill="currentColor"/><rect x="28" y="5" width="7" height="30" rx="2" fill="currentColor"/></svg>';
  const front = mood === 'correct' ? '<b>✓</b>' : mood === 'hint' ? '<b>؟</b>' : mood === 'reveal'
    ? '<svg viewBox="0 0 40 40"><path d="M20 5a11 11 0 0 0-6 20v4h12v-4a11 11 0 0 0-6-20z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><path d="M15 34h10" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>'
    : '<b dir="ltr">123</b><i>الأعداد</i>';
  const frontCls = mood === 'correct' ? 'mh-ba' : mood === 'hint' ? 'mh-le' : mood === 'reveal' ? 'mh-ri' : 'mh-fr';
  const star = '<svg viewBox="0 0 40 40" style="width:38%;height:38%"><path d="M20 4 l4 11.5 l12 .5 l-9.5 7.5 l3.5 11.5 l-10 -7 l-10 7 l3.5 -11.5 l-9.5 -7.5 l12 -.5 z" fill="#f6b81a"/></svg>';
  return `<span class="mh mh-${mood}" style="--s:${size}px" role="img" aria-label="مِحوَر">
    <span class="mh-scene"><span class="mh-cube">
      <span class="mh-f ${frontCls}" style="transform:translateZ(calc(var(--s) / 2))">${front}</span>
      <span class="mh-f mh-ri"><b>س²</b><i>الجبر</i></span>
      <span class="mh-f mh-ba">${tri}<i>الهندسة والقياس</i></span>
      <span class="mh-f mh-le">${bars}<i>البيانات</i></span>
      <span class="mh-f mh-to">${star}</span><span class="mh-f mh-bo"></span>
    </span></span><span class="mh-shadow"></span>${named ? '<span class="mh-name">مِحوَر</span>' : ''}</span>`;
}


type Mood = 'idle' | 'correct' | 'hint' | 'reveal' | 'happy' | 'cheer' | 'think';
const MAP: Record<string, string> = { happy: 'idle', cheer: 'correct', think: 'hint' };

export function Suha({ size = 120, mood = 'idle', named = false, className = '' }: { size?: number; mood?: Mood; named?: boolean; className?: string }) {
  return <span className={`inline-block ${className}`} dangerouslySetInnerHTML={{ __html: mihwarHTML(size, MAP[mood] ?? mood, named) }} />;
}
export const Mihwar = Suha;
