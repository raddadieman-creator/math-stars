import Link from 'next/link';
import { requireStaff } from '@/lib/data';
import { createLesson } from './actions';

export const dynamic = 'force-dynamic';
const ST: Record<string, string> = { draft: 'مسودة', review: 'بحاجة إلى اعتماد', published: 'منشور', archived: 'مؤرشف' };

export default async function Lessons() {
  const { sb } = await requireStaff();
  const { data } = await sb.from('lessons').select('id, title, status, scenario_source, updated_at, is_demo').order('updated_at', { ascending: false });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">الدروس المرئية</h1>
      <div className="panel leading-8">
        <p>ارفعي صورة صفحة من الكتاب أو ملف PDF، وراجعي النص المستخرج، ثم ابني مشاهد الدرس من القوالب وسجّلي التعليق بصوتك، واعتمدي الدرس قبل نشره.</p>
        <p className="text-sm muted">المشاهد رسوم متحركة برمجية تُعرض داخل المنصة، وليست فيديو مولدًا بالذكاء الاصطناعي.</p>
      </div>
      <form action={createLesson} className="panel flex flex-wrap items-end gap-3">
        <div className="flex-1"><label className="label">عنوان الدرس</label><input name="title" required className="field" /></div>
        <button className="btn-star">إنشاء درس</button>
      </form>
      <div className="grid gap-3 md:grid-cols-2">
        {(data ?? []).map((l) => (
          <Link key={l.id} href={`/teacher/lessons/${l.id}`} className="panel hover:bg-ink/5">
            <p className="text-lg font-extrabold">{l.title}</p>
            <div className="mt-2 flex gap-2 text-xs"><span className="chip">{ST[l.status]}</span>{l.scenario_source === 'ai_draft' && <span className="chip">مسودة مقترحة آليًا</span>}{l.is_demo && <span className="chip">تجريبي</span>}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
