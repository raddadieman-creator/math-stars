import type { Outcome } from './types';

/**
 * آلة حالات التغذية الراجعة لسؤال واحد.
 *  - صحيحة من المحاولة الأولى دون تلميح  => independent
 *  - صحيحة بعد تلميح (قبل كشف الحل)      => with_hint
 *  - استمرار الخطأ حتى الحد الأقصى       => يُكشف الحل، والنتيجة after_reveal
 * الإجابة الصحيحة بعد كشف الحل لا تُحسب إتقانًا مستقلًا.
 */
export type FeedbackAction =
  | { kind: 'correct'; outcome: Outcome }
  | { kind: 'hint'; triesLeft: number }
  | { kind: 'reveal'; outcome: Outcome };

export function decideFeedback(params: {
  correct: boolean;
  tryNo: number; // رقم المحاولة الحالية (يبدأ من 1)
  maxTriesBeforeReveal: number;
  solutionRevealed: boolean;
}): FeedbackAction {
  const { correct, tryNo, maxTriesBeforeReveal, solutionRevealed } = params;
  if (solutionRevealed) return { kind: 'reveal', outcome: 'after_reveal' };
  if (correct) return { kind: 'correct', outcome: tryNo === 1 ? 'independent' : 'with_hint' };
  if (tryNo >= maxTriesBeforeReveal) return { kind: 'reveal', outcome: 'after_reveal' };
  return { kind: 'hint', triesLeft: maxTriesBeforeReveal - tryNo };
}

const PRAISE = [
  'إجابة دقيقة، أحسنت.',
  'تفكير سليم، استمري.',
  'رائع، وصلت إلى الحل الصحيح.',
  'ممتاز، هذه خطوة متقنة.',
  'أداء واثق، واصلي التقدم.',
  'صحيح، طريقتك في الحل واضحة.',
];
const RETRY = [
  'إجابة غير دقيقة، والتلميح يوضح الخطوة التالية.',
  'محاولة جيدة، والمحاولة الثانية متاحة.',
  'الخطوة الأولى تحتاج إلى مراجعة، والمحاولة الثانية متاحة.',
];

export function pick(list: string[], seed: number): string {
  return list[Math.abs(Math.floor(seed)) % list.length];
}
export const praiseMessage = (seed: number) => pick(PRAISE, seed);
export const retryMessage = (seed: number) => pick(RETRY, seed);
