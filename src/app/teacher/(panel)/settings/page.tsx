import { ChangePassword } from '@/components/teacher/ImportStudents';
import { requireStaff, getSettings } from '@/lib/data';
import { saveRules, saveSettings, uploadBranding } from '../actions';

export const dynamic = 'force-dynamic';

export default async function Settings() {
  const { sb } = await requireStaff();
  const s = await getSettings();
  const [{ data: a }, { data: r }] = await Promise.all([
    sb.from('adaptive_rules').select('*').eq('id', 1).single(),
    sb.from('reward_rules').select('*').eq('id', 1).single(),
  ]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">الإعدادات والقواعد</h1>
      <ChangePassword />

      <form action={saveSettings} className="panel grid gap-4 md:grid-cols-2">
        <h2 className="text-lg font-extrabold md:col-span-2">بيانات المدرسة والمنصة</h2>
        <div><label className="label">اسم المدرسة</label><input name="school_name" defaultValue={s.school_name ?? ''} className="field" /></div>
        <div><label className="label">اسم المديرة</label><input name="principal_name" defaultValue={s.principal_name ?? ''} className="field" /></div>
        <div><label className="label">أسماء المعلمين (اسم في كل سطر)</label><textarea name="teacher_names" rows={2} defaultValue={s.teacher_names.join('\n')} className="field" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">مدة البرنامج (أسابيع)</label><input name="program_weeks" type="number" min={1} max={52} defaultValue={s.program_weeks} className="field" /></div>
          <div><label className="label">تاريخ البداية</label><input name="program_start_date" type="date" defaultValue={s.program_start_date ?? ''} className="field" /></div>
        </div>
        <div><label className="label">الرؤية</label><textarea name="vision" rows={3} defaultValue={s.vision ?? ''} className="field" /></div>
        <div><label className="label">الرسالة</label><textarea name="mission" rows={3} defaultValue={s.mission ?? ''} className="field" /></div>
        <div><label className="label">الأهداف (هدف في كل سطر)</label><textarea name="goals" rows={4} defaultValue={s.goals.join('\n')} className="field" /></div>
        <div><label className="label">تعريف TIMSS (يترك فارغًا لاستخدام النص الافتراضي)</label><textarea name="timss_intro" rows={4} defaultValue={s.timss_intro ?? ''} className="field" /></div>
        <div className="md:col-span-2"><button className="btn-star">حفظ البيانات</button></div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {([['school_logo_url', 'شعار المدرسة'], ['timss_logo_url', 'شعار TIMSS']] as const).map(([field, label]) => (
          <form key={field} action={uploadBranding} className="panel space-y-3">
            <h2 className="text-lg font-extrabold">{label}</h2>
            {s[field] && <img src={s[field]!} alt={label} className="h-20 rounded-xl bg-white object-contain p-2" />}
            <input type="hidden" name="field" value={field} />
            <input type="file" name="file" accept="image/*" required className="field" />
            <button className="btn-ghost">رفع</button>
          </form>
        ))}
      </div>

      <form action={saveRules} className="panel grid gap-4 md:grid-cols-3">
        <h2 className="text-lg font-extrabold md:col-span-3">قواعد التدريب التكيفي</h2>
        <p className="text-sm muted md:col-span-3">محرك قائم على قواعد محددة وشفافة، وليس اختبارًا تكيفيًا قائمًا على نظرية الاستجابة للمفردة (IRT).</p>
        <div><label className="label">رفع المستوى بعد (إجابات مستقلة متتالية)</label><input name="promote" type="number" min={1} max={10} defaultValue={a?.promote_after_independent_correct} className="field" /></div>
        <div><label className="label">خفض المستوى بعد (أسئلة متتالية كُشف حلها)</label><input name="demote" type="number" min={1} max={10} defaultValue={a?.demote_after_errors} className="field" /></div>
        <div><label className="label">عدد المحاولات قبل كشف الحل</label><input name="max_tries" type="number" min={1} max={4} defaultValue={a?.max_tries_before_reveal} className="field" /></div>
        <div><label className="label">نافذة الحكم على الإتقان (آخر ن أسئلة)</label><input name="min_items" type="number" min={3} max={30} defaultValue={a?.mastery_min_items} className="field" /></div>
        <div><label className="label">معيار الإتقان (% مستقلة)</label><input name="threshold" type="number" min={50} max={100} defaultValue={Math.round((a?.mastery_threshold ?? 0.8) * 100)} className="field" /></div>
        <div><label className="label">حد الحاجة إلى الدعم (% مستقلة أقل من)</label><input name="support" type="number" min={0} max={80} defaultValue={Math.round((a?.support_threshold ?? 0.4) * 100)} className="field" /></div>

        <h2 className="mt-4 text-lg font-extrabold md:col-span-3">قواعد المكافآت (نجوم)</h2>
        {([['s_first', 'إجابة من المحاولة الأولى', r?.stars_first_try], ['s_hint', 'إجابة بعد تلميح (مثابرة)', r?.stars_after_hint], ['s_reveal', 'بعد كشف الحل', r?.stars_after_reveal],
          ['s_session', 'إكمال جلسة (3 أسئلة فأكثر)', r?.stars_session_complete], ['s_mastered', 'إتقان مهارة', r?.stars_skill_mastered], ['s_improve', 'تحسن شخصي', r?.stars_personal_improvement]] as const).map(([n, l, v]) => (
          <div key={n}><label className="label">{l}</label><input name={n} type="number" min={0} max={50} defaultValue={v ?? 0} className="field" /></div>
        ))}
        <h2 className="mt-4 text-lg font-extrabold md:col-span-3">مهام وسام تميّز الشهر</h2>
        <div><label className="label">جلسات تدريب في الشهر</label><input name="m_sessions" type="number" min={1} max={60} defaultValue={r?.monthly_sessions ?? 8} className="field" /></div>
        <div><label className="label">نماذج اختبار في الشهر</label><input name="m_models" type="number" min={0} max={20} defaultValue={r?.monthly_models ?? 2} className="field" /></div>
        <div><label className="label">إجابات صحيحة من المحاولة الأولى</label><input name="m_independent" type="number" min={1} max={300} defaultValue={r?.monthly_independent ?? 30} className="field" /></div>
        <div className="md:col-span-3"><button className="btn-star">حفظ القواعد</button></div>
      </form>
    </div>
  );
}
