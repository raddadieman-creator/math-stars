import Link from 'next/link';
import { requireStaff } from '@/lib/data';
import { addSkill } from './actions';
import { COGNITIVE_AR, QTYPE_AR, type Cognitive, type QType } from '@/lib/types';
import { StatusButtons } from '@/components/teacher/StatusButtons';

export const dynamic = 'force-dynamic';
const STATUS: Record<string, string> = { draft: 'مسودة', review: 'قيد المراجعة', published: 'منشور', archived: 'مؤرشف' };

export default async function Questions({ searchParams }: { searchParams: Promise<{ skill?: string; status?: string }> }) {
  const { sb } = await requireStaff();
  const sp = await searchParams;
  const [{ data: skills }, { data: topics }] = await Promise.all([
    sb.from('skills').select('id, code, name_ar, topic_areas(name_ar)').order('code'),
    sb.from('topic_areas').select('id, name_ar, content_domains(name_ar)').order('sort_order'),
  ]);
  let q = sb.from('questions').select('id, prompt, qtype, cognitive, difficulty, status, is_demo, skill_id').order('created_at', { ascending: false }).limit(300);
  if (sp.skill) q = q.eq('skill_id', sp.skill);
  if (sp.status) q = q.eq('status', sp.status);
  const { data: questions } = await q;
  const skillName = new Map((skills ?? []).map((s) => [s.id, s.name_ar]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">بنك الأسئلة</h1>
        <Link href="/teacher/questions/new" className="btn-star">سؤال جديد</Link>
      </div>

      <form className="panel flex flex-wrap items-end gap-3">
        <div><label className="label">المهارة</label><select name="skill" defaultValue={sp.skill ?? ''} className="field"><option value="">الكل</option>{(skills ?? []).map((s) => <option key={s.id} value={s.id}>{s.code} — {s.name_ar}</option>)}</select></div>
        <div><label className="label">الحالة</label><select name="status" defaultValue={sp.status ?? ''} className="field"><option value="">الكل</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <button className="btn-ghost">تصفية</button>
      </form>

      <div className="space-y-3">
        {(questions ?? []).map((x) => (
          <div key={x.id} className="panel flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold" dir="auto">{x.prompt}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="chip">{skillName.get(x.skill_id)}</span><span className="chip">{COGNITIVE_AR[x.cognitive as Cognitive]}</span>
                <span className="chip">الصعوبة {x.difficulty}</span><span className="chip">{QTYPE_AR[x.qtype as QType]}</span>
                <span className={`chip ${x.status === 'published' ? 'bg-aqua-500/20 text-aqua-600' : ''}`}>{STATUS[x.status]}</span>
                {x.is_demo && <span className="chip bg-rose-500/20 text-rose-600">تجريبي</span>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2"><Link href={`/teacher/questions/${x.id}`} className="chip px-3 py-2">مراجعة وتعديل</Link><StatusButtons id={x.id} status={x.status} /></div>
          </div>
        ))}
        {!questions?.length && <p className="panel muted">لا توجد أسئلة مطابقة.</p>}
      </div>

      <form action={addSkill} className="panel grid gap-3 md:grid-cols-4">
        <h2 className="text-lg font-extrabold md:col-span-4">إضافة مهارة</h2>
        <div><label className="label">مجال الموضوع (TIMSS 2027)</label><select name="topic_id" required className="field">{(topics ?? []).map((t) => <option key={t.id} value={t.id}>{(t.content_domains as unknown as { name_ar: string }).name_ar} ← {t.name_ar}</option>)}</select></div>
        <div><label className="label">رمز المهارة</label><input name="code" required className="field" dir="ltr" placeholder="NUM-INT-01" /></div>
        <div><label className="label">اسم المهارة</label><input name="name_ar" required className="field" /></div>
        <div className="flex items-end"><button className="btn-aqua w-full">إضافة</button></div>
      </form>
      <p className="text-xs text-ink/45">الاستيراد الجماعي من Excel/CSV مع شاشة المراجعة مُدرج في المرحلة الثانية.</p>
    </div>
  );
}
