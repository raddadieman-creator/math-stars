import type { MasteryStatus, Outcome, RewardRules } from './types';

export const DEFAULT_REWARDS: RewardRules = {
  stars_first_try: 3,
  stars_after_hint: 2,
  stars_after_reveal: 0,
  stars_session_complete: 2,
  stars_skill_mastered: 10,
  stars_personal_improvement: 5,
};

export interface StarGrant { amount: number; reason: string }
export interface BadgeGrant { code: string }

/** نجوم السؤال الواحد: المحاولة الأولى أعلى، والمحاولة بعد التلميح تُكافأ على المثابرة */
export function starsForOutcome(outcome: Outcome, r: RewardRules): StarGrant | null {
  const amount =
    outcome === 'independent' ? r.stars_first_try : outcome === 'with_hint' ? r.stars_after_hint : r.stars_after_reveal;
  if (amount <= 0) return null;
  return { amount, reason: outcome === 'independent' ? 'إجابة صحيحة من المحاولة الأولى' : 'مثابرة حتى الحل' };
}

export function rewardsForMasteryChange(before: MasteryStatus, after: MasteryStatus, r: RewardRules) {
  const stars: StarGrant[] = [];
  const badges: BadgeGrant[] = [];
  if (before !== 'mastered' && after === 'mastered') {
    stars.push({ amount: r.stars_skill_mastered, reason: 'إتقان مهارة' });
    badges.push({ code: 'skill_master' });
  }
  return { stars, badges };
}

/** التحسن الشخصي: نسبة الإجابة المستقلة في الجلسة أعلى من الجلسة السابقة في المهارة نفسها (3 أسئلة على الأقل) */
export function isPersonalImprovement(current: Outcome[], previous: Outcome[] | null): boolean {
  if (!previous || current.length < 3 || previous.length < 3) return false;
  const rate = (xs: Outcome[]) => xs.filter((o) => o === 'independent').length / xs.length;
  return rate(current) > rate(previous);
}

/** المواظبة: التدرب في 3 أيام مختلفة خلال آخر 7 أيام */
export function hasPersistence(sessionDates: Date[], now: Date): boolean {
  const weekAgo = now.getTime() - 7 * 24 * 3600 * 1000;
  const days = new Set(
    sessionDates.filter((d) => d.getTime() >= weekAgo).map((d) => d.toISOString().slice(0, 10)),
  );
  return days.size >= 3;
}
