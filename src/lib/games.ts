// قائمة الألعاب المخطط لها؛ لا تظهر أي لعبة بزر دخول إلا بعد بنائها وربطها ببنك الأسئلة (ready: true)
export const GAMES = [
  { key: 'star_race', name: 'سباق النجوم', icon: '🏁', desc: 'تقدّم في المسار مع كل إجابة صحيحة.', ready: false },
  { key: 'space_numbers', name: 'رحلة الفضاء والأرقام', icon: '🚀', desc: 'محطات فضائية لكل مجال من مجالات المحتوى.', ready: false },
  { key: 'treasure', name: 'صندوق الكنز', icon: '🧰', desc: 'أقفال تُفتح بحل مسائل متدرجة.', ready: false },
  { key: 'maze', name: 'متاهة العمليات', icon: '🧭', desc: 'طريق صحيح واحد عند كل تفرع.', ready: false },
  { key: 'wheel', name: 'عجلة التحديات', icon: '🎡', desc: 'تحدد العجلة المجال والمستوى عشوائيًا.', ready: false },
  { key: 'tower', name: 'بناء برج الأعداد', icon: '🏗️', desc: 'كل إجابة مستقلة تضيف طابقًا.', ready: false },
  { key: 'patterns', name: 'مطابقة الأشكال والأنماط', icon: '🔷', desc: 'مطابقة التمثيلات المتكافئة.', ready: false },
  { key: 'timed', name: 'تحدي الوقت (اختياري)', icon: '⏱️', desc: 'للمتعة فقط؛ السرعة لا تدخل في حساب الإتقان.', ready: false },
] as const;
