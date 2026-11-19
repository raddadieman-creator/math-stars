import { describe, expect, it } from 'vitest';
import { isCorrect, classifyError, normalizeNumber } from '../src/lib/grading';
import { decideFeedback } from '../src/lib/feedback';
import { updateMastery, INITIAL_MASTERY, DEFAULT_RULES } from '../src/lib/adaptive';
import { starsForOutcome, rewardsForMasteryChange, DEFAULT_REWARDS, isPersonalImprovement, hasPersistence } from '../src/lib/rewards';
import { studentIndicators, programWeek, prePostSummary, classIndicators, hardestSkills, weeklySeries, type OutcomeRow } from '../src/lib/metrics';
import { hashLoginCode, generateLoginCode, isValidCodeFormat } from '../src/lib/codes';
import type { Outcome } from '../src/lib/types';

describe('التصحيح', () => {
  it('يقبل الأرقام العربية والسالبة', () => {
    expect(normalizeNumber('−٣')).toBe(-3);
    expect(normalizeNumber('٢٫٥')).toBe(2.5);
    expect(normalizeNumber('abc')).toBeNull();
    expect(isCorrect({ qtype: 'numeric', correct_answer: { value: -3 } }, '-٣')).toBe(true);
  });
  it('يصحح الاختيار والصواب والخطأ والترتيب والمطابقة', () => {
    expect(isCorrect({ qtype: 'mcq', correct_answer: { value: 'b' } }, 'b')).toBe(true);
    expect(isCorrect({ qtype: 'true_false', correct_answer: { value: true } }, 'true')).toBe(true);
    expect(isCorrect({ qtype: 'ordering', correct_answer: { value: [1, 2, 3] } }, ['1', '2', '3'])).toBe(true);
    expect(isCorrect({ qtype: 'matching', correct_answer: { value: { a: 1, b: 2 } } }, { b: 2, a: 1 })).toBe(true);
    expect(isCorrect({ qtype: 'matching', correct_answer: { value: { a: 1, b: 2 } } }, { a: 2, b: 1 })).toBe(false);
  });
  it('يصنف الخطأ الشائع', () => {
    const q = { qtype: 'numeric' as const, common_errors: [{ answer: 11, error_type: 'خطأ في الإشارة' }] };
    expect(classifyError(q, '11')).toBe('خطأ في الإشارة');
    expect(classifyError(q, '7')).toBe('غير مصنف');
  });
});

describe('التغذية الراجعة', () => {
  const base = { maxTriesBeforeReveal: 2, solutionRevealed: false };
  it('صحيحة أولى = مستقلة', () => expect(decideFeedback({ ...base, correct: true, tryNo: 1 })).toEqual({ kind: 'correct', outcome: 'independent' }));
  it('خطأ أول = تلميح', () => expect(decideFeedback({ ...base, correct: false, tryNo: 1 }).kind).toBe('hint'));
  it('صحيحة بعد التلميح = بمساعدة', () => expect(decideFeedback({ ...base, correct: true, tryNo: 2 })).toEqual({ kind: 'correct', outcome: 'with_hint' }));
  it('استمرار الخطأ = كشف الحل', () => expect(decideFeedback({ ...base, correct: false, tryNo: 2 })).toEqual({ kind: 'reveal', outcome: 'after_reveal' }));
  it('الصحيحة بعد كشف الحل لا تُحسب إتقانًا', () =>
    expect(decideFeedback({ ...base, solutionRevealed: true, correct: true, tryNo: 3 })).toEqual({ kind: 'reveal', outcome: 'after_reveal' }));
});

describe('محرك التكيف', () => {
  const run = (outs: Outcome[]) => outs.reduce((s, o) => updateMastery(s, o, DEFAULT_RULES), INITIAL_MASTERY);
  it('يرفع المستوى بعد 3 إجابات مستقلة متتالية', () => expect(run(['independent', 'independent', 'independent']).level).toBe(2));
  it('يخفض المستوى بعد خطأين متتاليين', () => {
    const s = run(['independent', 'independent', 'independent', 'after_reveal', 'after_reveal']);
    expect(s.level).toBe(1);
  });
  it('لا يمنح الإتقان قبل الحد الأدنى من الأسئلة', () => expect(run(['independent', 'independent', 'independent', 'independent']).status).toBe('developing'));
  it('يمنح الإتقان عند تحقق المعيار', () => expect(run(Array(6).fill('independent')).status).toBe('mastered'));
  it('التكرار دون استقلال لا يصنع إتقانًا', () => expect(run(Array(12).fill('with_hint')).status).not.toBe('mastered'));
  it('يحدد الحاجة إلى دعم', () => expect(run(Array(5).fill('after_reveal')).status).toBe('needs_support'));
});

describe('المكافآت', () => {
  it('نجوم المحاولة الأولى أعلى وكشف الحل صفر', () => {
    expect(starsForOutcome('independent', DEFAULT_REWARDS)?.amount).toBe(3);
    expect(starsForOutcome('with_hint', DEFAULT_REWARDS)?.amount).toBe(2);
    expect(starsForOutcome('after_reveal', DEFAULT_REWARDS)).toBeNull();
  });
  it('وسام الإتقان عند التحول فقط', () => {
    expect(rewardsForMasteryChange('developing', 'mastered', DEFAULT_REWARDS).badges).toEqual([{ code: 'skill_master' }]);
    expect(rewardsForMasteryChange('mastered', 'mastered', DEFAULT_REWARDS).badges).toEqual([]);
  });
  it('التحسن الشخصي والمواظبة', () => {
    expect(isPersonalImprovement(['independent', 'independent', 'with_hint'], ['with_hint', 'with_hint', 'independent'])).toBe(true);
    const now = new Date('2026-11-19T10:00:00Z');
    expect(hasPersistence([new Date('2026-11-14'), new Date('2026-11-16'), new Date('2026-11-18')], now)).toBe(true);
    expect(hasPersistence([new Date('2026-11-18'), new Date('2026-11-18')], now)).toBe(false);
  });
});

describe('المؤشرات', () => {
  const row = (o: Outcome, s = 'st1', sess = 's1', skill = 'k1', at = '2026-11-20T08:00:00Z'): OutcomeRow =>
    ({ student_id: s, skill_id: skill, session_id: sess, tries: o === 'independent' ? 1 : 2, outcome: o, total_time_ms: 60000, created_at: at });
  it('مؤشرات الطالبة', () => {
    const ind = studentIndicators([row('independent'), row('with_hint'), row('after_reveal', 'st1', 's2'), row('independent', 'st1', 's2')]);
    expect(ind.sessions).toBe(2);
    expect(ind.firstTryPct).toBe(50);
    expect(ind.withHelpPct).toBe(25);
    expect(ind.retrainCount).toBe(1);
    expect(ind.totalMinutes).toBe(4);
  });
  it('أسبوع البرنامج من 20 أسبوعًا', () => {
    const start = new Date('2026-11-15');
    expect(programWeek(new Date('2026-11-15'), start, 20)).toBe(1);
    expect(programWeek(new Date('2026-11-23'), start, 20)).toBe(2);
    expect(programWeek(new Date('2027-12-01'), start, 20)).toBe(20);
    expect(programWeek(new Date('2026-11-01'), start, 20)).toBeNull();
    const ws = weeklySeries([row('independent'), row('with_hint')], start, 20);
    expect(ws).toHaveLength(20);
    expect(ws[0]).toEqual({ week: 1, items: 2, firstTryPct: 50 });
  });
  it('مؤشرات الصف والمهارات الأصعب', () => {
    const c = classIndicators(['st1', 'st2', 'st3', 'st4'], [row('independent'), row('after_reveal', 'st2')],
      [{ student_id: 'st2', skill_id: 'k1', status: 'needs_support' }]);
    expect(c.participationPct).toBe(50);
    expect(c.avgFirstTryPct).toBe(50);
    expect(c.needsSupportStudents).toBe(1);
    expect(hardestSkills([row('independent'), row('after_reveal')], 2)[0].firstTryPct).toBe(50);
  });
  it('القبلي والبعدي', () => {
    const s = prePostSummary([
      { student_id: 'a', pre: 40, post: 60, practiceItems: 50 },
      { student_id: 'b', pre: 50, post: 55, practiceItems: 20 },
      { student_id: 'c', pre: 70, post: 65, practiceItems: 5 },
      { student_id: 'd', pre: 30, post: null, practiceItems: 0 },
    ]);
    expect(s.pairedStudents).toBe(3);
    expect(s.missingPost).toBe(1);
    expect(s.meanGainPoints).toBe(6.7);
    expect(s.improvedPct).toBe(66.7);
    expect(s.practiceGainCorrelation).toBeGreaterThan(0.9);
  });
});

describe('رموز الدخول', () => {
  it('ستة أرقام وبصمة ثابتة', () => {
    const c = generateLoginCode();
    expect(isValidCodeFormat(c)).toBe(true);
    const p = 'x'.repeat(32);
    expect(hashLoginCode('123456', p)).toBe(hashLoginCode('123456', p));
    expect(hashLoginCode('123456', p)).not.toBe(hashLoginCode('123457', p));
  });
});

import { buildQuestionPayload, toFormInput } from '../src/lib/question-form';
import { isCorrect as grade } from '../src/lib/grading';
describe('نموذج السؤال', () => {
  it('اختيار من متعدد ذهابًا وإيابًا', () => {
    const p = buildQuestionPayload({ qtype: 'mcq', optionsText: '-11\n-3\n3\n11', correct: 'ب', stepsText: 'خطوة 1\nخطوة 2', errorsText: '11 | خطأ في الإشارة' });
    expect(p.correct_answer.value).toBe('b');
    expect(p.common_errors[0].error_type).toBe('خطأ في الإشارة');
    const back = toFormInput({ qtype: 'mcq', ...p } as never);
    expect(back.correct).toBe('ب');
  });
  it('الترتيب والمطابقة صالحة للتصحيح', () => {
    const o = buildQuestionPayload({ qtype: 'ordering', optionsText: '-5\n-1\n2', correct: '', stepsText: '', errorsText: '' });
    expect(grade({ qtype: 'ordering', correct_answer: o.correct_answer }, ['o1', 'o2', 'o3'])).toBe(true);
    const m = buildQuestionPayload({ qtype: 'matching', optionsText: 'ربع = 25%\nنصف = 50%', correct: '', stepsText: '', errorsText: '' });
    expect(grade({ qtype: 'matching', correct_answer: m.correct_answer }, { l1: 'r:1', l2: 'r:2' })).toBe(true);
  });
  it('يرفض المدخلات الناقصة', () => {
    expect(() => buildQuestionPayload({ qtype: 'mcq', optionsText: 'أ', correct: 'أ', stepsText: '', errorsText: '' })).toThrow();
    expect(() => buildQuestionPayload({ qtype: 'numeric', optionsText: '', correct: 'abc', stepsText: '', errorsText: '' })).toThrow();
  });
});

import { sanitizeScenario, newScene, ScenarioSchema, TEMPLATES } from '../src/lib/scenario';
describe('سيناريو الدرس', () => {
  it('كل قالب ينتج مشهدًا صالحًا', () => {
    const scenes = TEMPLATES.filter((t) => t.key !== 'question').map((t) => newScene(t.key));
    expect(ScenarioSchema.safeParse({ scenes }).success).toBe(true);
  });
  it('يُسقط مشاهد الذكاء الاصطناعي غير الصالحة ويزيل أي صوت', () => {
    const { scenario, dropped } = sanitizeScenario({ scenes: [
      { template: 'number_line', title: 'جمع', caption: '', duration: 8, data: { start: -2, moves: [5] }, audio_path: 'x' },
      { template: 'video_ai', title: 'x' },
      { template: 'cycle', title: 'دورة', data: { stages: ['واحدة'] } },
    ] });
    expect(scenario.scenes).toHaveLength(1);
    expect(scenario.scenes[0].audio_path).toBeNull();
    expect(dropped).toBe(2);
  });
  it('مدخلات غير متوقعة لا تكسر شيئًا', () => {
    expect(sanitizeScenario('نص').scenario.scenes).toEqual([]);
  });
});

import { parseCSV, rowsToQuestions, IMPORT_COLUMNS, IMPORT_EXAMPLE } from '../src/lib/import-rows';
import models from '../src/lib/library-models.json';
describe('استيراد الأسئلة', () => {
  it('يحلل CSV بالاقتباس والفواصل', () => {
    const rows = parseCSV('أ,"ب، ج","د ""هـ"""\n\n1,2,3\r\n');
    expect(rows).toEqual([['أ', 'ب، ج', 'د "هـ"'], ['1', '2', '3']]);
  });
  it('يقبل المثال ويتجاوز صف العناوين', () => {
    const { ok, errors } = rowsToQuestions([[...IMPORT_COLUMNS], ...IMPORT_EXAMPLE]);
    expect(errors).toEqual([]);
    expect(ok).toHaveLength(3);
    expect(ok[0].payload.correct_answer.value).toBe('b');
    expect(ok[1].payload.correct_answer.value).toBe(7);
    expect(ok[2].payload.correct_answer.value).toBe(false);
    expect(ok[0].cognitive).toBe('knowing');
    expect(ok[0].standard_no).toBe(2);
    expect(ok[0].cognitive_skill).toBe('الحساب');
  });
  it('يقبل نص الخيار إجابةً ويرفض الأسطر الناقصة', () => {
    const { ok, errors } = rowsToQuestions([
      ['س؟', 'اختيار من متعدد', '1|2|3', '3', 'تطبيق'],
      ['', 'عددي', '', '4'],
      ['س؟', 'غريب', '', '4'],
      ['س؟', 'عددي', '', '4', '', '', '', '', '', '25'],
    ]);
    expect(ok[0].payload.correct_answer.value).toBe('c');
    expect(errors.map((e) => e.line)).toEqual([2, 3, 4]);
  });
});
describe('محتوى المكتبة', () => {
  it('كل إجابة صحيحة موجودة ضمن خياراتها وكل سؤال له خطوات حل', () => {
    for (const m of models as { items: { t: string; o?: string[]; a: unknown; steps: string[] }[] }[]) {
      for (const it of m.items) {
        if (it.t === 'mcq') expect((it.a as number) < it.o!.length).toBe(true);
        expect(it.steps.length).toBeGreaterThan(0);
      }
    }
  });
});

import practice from '../src/lib/practice-items.json';
describe('تغطية المعايير', () => {
  it('كل سؤال مرتبط بمعيار من 1 إلى 19 وإجابته ضمن خياراته، ولكل معيار 5 أسئلة على الأقل', () => {
    const all = [...(models as { items: { std?: number; o?: string[]; a: unknown; t: string }[] }[]).flatMap((m) => m.items), ...(practice as { std: number; o: string[]; a: number; t: string }[])];
    const count: Record<number, number> = {};
    for (const it of all) {
      expect(it.std).toBeGreaterThanOrEqual(1);
      expect(it.std).toBeLessThanOrEqual(19);
      if (it.t === 'mcq') expect((it.a as number) < it.o!.length).toBe(true);
      count[it.std!] = (count[it.std!] ?? 0) + 1;
    }
    for (let n = 1; n <= 19; n++) expect(count[n] ?? 0).toBeGreaterThanOrEqual(5);
    expect(all.length).toBe(115);
  });
});

import { evaluateBadges, badgeProgress, monthlyProgress, hijriMonth, BADGES, type StudentStats } from '../src/lib/badges';
describe('الأوسمة', () => {
  const base: StudentStats = { sessions: 0, masteredStandards: [], modelsCompleted: 0, bestModelPct: 0, officialModelsDone: 0, officialModelsTotal: 6, practiceDaysLast7: 0, solvedAfterHint: 0, improvements: 0, month: { sessions: 0, models: 0, independent: 0 } };
  it('لا أوسمة في البداية', () => expect(evaluateBadges(base, new Set(), '1448-05')).toEqual([]));
  it('أوسمة المهام والإتقان والمجال', () => {
    const s = { ...base, sessions: 6, masteredStandards: [13, 14, 15], modelsCompleted: 1, bestModelPct: 85 };
    const codes = evaluateBadges(s, new Set(), '1448-05').map((b) => b.code);
    expect(codes).toEqual(expect.arrayContaining(['first_session', 'sessions_5', 'std_1', 'dom_geometry', 'model_1', 'model_80']));
    expect(codes).not.toContain('sessions_20');
    expect(codes).not.toContain('std_5');
  });
  it('لا يُمنح الوسام مرتين، ووسام الشهر مرة لكل شهر', () => {
    const s = { ...base, sessions: 10, month: { sessions: 8, models: 2, independent: 30 } };
    const first = evaluateBadges(s, new Set(), '1448-05');
    expect(first.find((b) => b.code === 'monthly_excellence')?.period).toBe('1448-05');
    const owned = new Set([...first.filter((b) => !b.period).map((b) => b.code), 'monthly_excellence:1448-05']);
    expect(evaluateBadges(s, owned, '1448-05')).toEqual([]);
    expect(evaluateBadges(s, owned, '1448-06').map((b) => b.code)).toEqual(['monthly_excellence']);
  });
  it('التقدم نحو الأوسمة والتحدي الشهري', () => {
    const p = badgeProgress({ ...base, sessions: 3 }).find((x) => x.code === 'sessions_5')!;
    expect(p).toEqual({ code: 'sessions_5', value: 3, target: 5, done: false });
    expect(monthlyProgress({ ...base, month: { sessions: 8, models: 1, independent: 40 } }).done).toBe(false);
    expect(BADGES.length).toBe(21);
  });
  it('الشهر الهجري', () => {
    const m = hijriMonth(new Date('2026-11-19T10:00:00Z'));
    expect(m.key).toMatch(/^14\d\d-\d\d$/);
    expect(m.name.length).toBeGreaterThan(3);
  });
});
