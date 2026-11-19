export type QType = 'mcq' | 'true_false' | 'numeric' | 'ordering' | 'matching' | 'drag_drop' | 'image_mcq';
export type Outcome = 'independent' | 'with_hint' | 'after_reveal' | 'not_solved';
export type MasteryStatus = 'not_started' | 'developing' | 'needs_support' | 'mastered';
export type Cognitive = 'knowing' | 'applying' | 'reasoning';

export interface QuestionOption { id: string; text: string; image?: string }
export interface CommonError { answer: unknown; error_type: string; note?: string }

export interface Question {
  id: string;
  skill_id: string;
  cognitive: Cognitive;
  difficulty: 1 | 2 | 3;
  qtype: QType;
  prompt: string;
  media_url?: string | null;
  options: QuestionOption[];
  correct_answer: { value: unknown };
  explanation?: string | null;
  hint?: string | null;
  solution_steps: string[];
  common_errors: CommonError[];
  remedial_activity?: string | null;
}

/** ما يصل إلى متصفح الطالبة: دون الإجابة أو الحل */
export type PublicQuestion = Pick<Question, 'id' | 'qtype' | 'prompt' | 'media_url' | 'options' | 'difficulty'>;

export interface AdaptiveRules {
  promote_after_independent_correct: number;
  demote_after_errors: number;
  mastery_min_items: number;
  mastery_threshold: number;
  support_threshold: number;
  max_tries_before_reveal: number;
}

export interface RewardRules {
  stars_first_try: number;
  stars_after_hint: number;
  stars_after_reveal: number;
  stars_session_complete: number;
  stars_skill_mastered: number;
  stars_personal_improvement: number;
}

export interface MasteryState {
  level: 1 | 2 | 3;
  independent_streak: number;
  error_streak: number;
  items_seen: number;
  independent_correct: number;
  recent_outcomes: Outcome[];
  status: MasteryStatus;
}

export const OUTCOME_AR: Record<Outcome, string> = {
  independent: 'صحيحة من المحاولة الأولى',
  with_hint: 'صحيحة بعد تلميح',
  after_reveal: 'بعد كشف الحل',
  not_solved: 'لم تُحل',
};

export const STATUS_AR: Record<MasteryStatus, string> = {
  not_started: 'لم تبدأ',
  developing: 'قيد التطور',
  needs_support: 'تحتاج إلى دعم',
  mastered: 'متقنة',
};

export const COGNITIVE_AR: Record<Cognitive, string> = {
  knowing: 'المعرفة',
  applying: 'التطبيق',
  reasoning: 'الاستدلال',
};

export const QTYPE_AR: Record<QType, string> = {
  mcq: 'اختيار من متعدد',
  true_false: 'صواب وخطأ',
  numeric: 'إجابة عددية',
  ordering: 'ترتيب',
  matching: 'مطابقة',
  drag_drop: 'سحب وإفلات',
  image_mcq: 'سؤال مصور',
};
