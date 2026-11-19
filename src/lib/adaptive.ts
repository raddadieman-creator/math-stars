import type { AdaptiveRules, MasteryState, MasteryStatus, Outcome } from './types';

export const DEFAULT_RULES: AdaptiveRules = {
  promote_after_independent_correct: 3,
  demote_after_errors: 2,
  mastery_min_items: 5,
  mastery_threshold: 0.8,
  support_threshold: 0.4,
  max_tries_before_reveal: 2,
};

export const INITIAL_MASTERY: MasteryState = {
  level: 1,
  independent_streak: 0,
  error_streak: 0,
  items_seen: 0,
  independent_correct: 0,
  recent_outcomes: [],
  status: 'not_started',
};

const WINDOW_MAX = 20;

/**
 * قواعد التكيف (شفافة وقابلة للتعديل من المعلمة):
 * 1) الصعوبة تبدأ من المستوى 1.
 * 2) بعد (promote) إجابات مستقلة متتالية يرتفع المستوى درجة.
 * 3) بعد (demote) أسئلة متتالية كُشف حلها ينخفض المستوى درجة.
 * 4) الإتقان: آخر (min_items) أسئلة، نسبة المستقلة منها ≥ (threshold)، والمستوى الحالي ≥ 2.
 * 5) تحتاج إلى دعم: نسبة المستقلة في النافذة نفسها < (support_threshold).
 * عدد مرات التدريب وحده لا يرفع حالة الإتقان.
 */
export function updateMastery(prev: MasteryState, outcome: Outcome, rules: AdaptiveRules): MasteryState {
  const s: MasteryState = { ...prev, recent_outcomes: [...prev.recent_outcomes, outcome].slice(-WINDOW_MAX) };
  s.items_seen += 1;

  if (outcome === 'independent') {
    s.independent_correct += 1;
    s.independent_streak += 1;
    s.error_streak = 0;
    if (s.independent_streak >= rules.promote_after_independent_correct && s.level < 3) {
      s.level = (s.level + 1) as 1 | 2 | 3;
      s.independent_streak = 0;
    }
  } else if (outcome === 'with_hint') {
    s.independent_streak = 0;
    s.error_streak = 0;
  } else {
    s.independent_streak = 0;
    s.error_streak += 1;
    if (s.error_streak >= rules.demote_after_errors && s.level > 1) {
      s.level = (s.level - 1) as 1 | 2 | 3;
      s.error_streak = 0;
    }
  }
  s.status = masteryStatus(s, rules);
  return s;
}

export function independentShare(recent: Outcome[], window: number): number | null {
  const w = recent.slice(-window);
  if (w.length < window) return null;
  return w.filter((o) => o === 'independent').length / w.length;
}

export function masteryStatus(s: MasteryState, rules: AdaptiveRules): MasteryStatus {
  if (s.items_seen === 0) return 'not_started';
  const share = independentShare(s.recent_outcomes, rules.mastery_min_items);
  if (share === null) return 'developing';
  if (share >= rules.mastery_threshold && s.level >= 2) return 'mastered';
  if (share < rules.support_threshold) return 'needs_support';
  return 'developing';
}
