import { requireStaff } from '@/lib/data';
import { qCount } from '@/lib/types';
import standards from '@/lib/standards.json';
import { addLibraryLink, createModel, uploadLibraryFile } from './actions';
import { ImportQuestions } from '@/components/teacher/ImportQuestions';
import { FileRowActions, ModelToggle } from '@/components/teacher/LibraryActions';

export const dynamic = 'force-dynamic';

export default async function TeacherLibrary() {
  const { sb } = await requireStaff();
  const [{ data: models }, { data: files }, { data: skills }] = await Promise.all([
    sb.from('assessments').select('id, title, form_label, is_open, source_label, assessment_items(count)').eq('kind', 'model').order('sort_order'),
    sb.from('library_files').select('id, title, publisher, language, is_official, is_visible, external_url, storage_path').order('is_official', { ascending: false }).order('sort_order'),
    sb.from('skills').select('id, code, name_ar, description, standard_no, questions(count)').order('code'),
  ]);
  const std = (skills ?? []).filter((k) => k.standard_no).sort((a, b) => (a.standard_no as number) - (b.standard_no as number));
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">مكتبة النماذج</h1>

      <section className="panel">
        <h2 className="text-lg font-extrabold">النماذج</h2>
        <div className="mt-3 divide-y divide-ink/5">
          {(models ?? []).map((m) => (
            <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div><b>{m.title}</b><p className="text-xs muted">{m.form_label === 'mix' ? 'ثمانية أسئلة عشوائية من بنك المكتبة' : qCount((m.assessment_items as unknown as { count: number }[])[0]?.count ?? 0)}{m.source_label ? ` · ${m.source_label}` : ''}</p></div>
              <ModelToggle id={m.id} open={m.is_open} />
            </div>
          ))}
        </div>
        <form action={createModel} className="mt-4 grid gap-3 border-t border-ink/10 pt-4 md:grid-cols-4">
          <div className="md:col-span-2"><label className="label">عنوان نموذج جديد</label><input name="title" required className="field" /></div>
          <div><label className="label">المجال</label><select name="domain" className="field"><option value="">متعدد المجالات</option><option value="number">الأعداد</option><option value="algebra">الجبر</option><option value="geometry_measurement">الهندسة والقياس</option><option value="data_probability">البيانات والاحتمالات</option></select></div>
          <div className="flex items-end"><button className="btn-aqua w-full">إنشاء</button></div>
          <div className="md:col-span-4"><label className="label">المصدر (اختياري)</label><input name="source" className="field" placeholder="مثل: أسئلة TIMSS 2011 المنشورة — IEA" /></div>
        </form>
      </section>

      <section className="panel">
        <h2 className="text-lg font-extrabold">تغطية المعايير الفرعية للصف الثامن</h2>
        <p className="text-xs muted">المصدر: {standards.source}</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {std.map((k) => {
            const n = (k.questions as unknown as { count: number }[])[0]?.count ?? 0;
            return (
              <details key={k.id} className="rounded-xl border border-ink/10 p-3">
                <summary className="flex cursor-pointer items-center justify-between gap-2 text-sm"><span><b>{k.standard_no}.</b> {k.name_ar}</span><span className={`chip ${n ? 'bg-aqua-300/40' : 'bg-rose-300/30'}`}>{n} سؤال</span></summary>
                <p className="mt-2 text-xs leading-6 muted">{k.description}</p>
              </details>
            );
          })}
        </div>
      </section>

      <ImportQuestions skills={skills ?? []} models={(models ?? []).filter((m) => m.form_label !== 'mix').map((m) => ({ id: m.id, title: m.title }))} />

      <section className="panel">
        <h2 className="text-lg font-extrabold">ملفات الاختبارات</h2>
        <div className="mt-3 divide-y divide-ink/5">
          {(files ?? []).map((f) => (
            <div key={f.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div><b>{f.title}</b><p className="text-xs muted">{f.publisher ?? '—'}{f.language === 'en' ? ' · بالإنجليزية' : ''}{f.is_official ? ' · رسمي' : ''}{f.is_visible ? '' : ' · مخفي'}</p></div>
              <FileRowActions id={f.id} visible={f.is_visible} />
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 border-t border-ink/10 pt-4 lg:grid-cols-2">
          <form action={uploadLibraryFile} className="space-y-3">
            <p className="font-bold">رفع ملف (PDF أو صورة)</p>
            <input name="file" type="file" accept="application/pdf,image/*" required className="field" />
            <input name="title" className="field" placeholder="عنوان الملف" />
            <div className="grid grid-cols-2 gap-3"><input name="publisher" className="field" placeholder="الجهة المصدرة" /><select name="language" className="field"><option value="ar">عربي</option><option value="en">إنجليزي</option></select></div>
            <button className="btn-ghost">رفع</button>
          </form>
          <form action={addLibraryLink} className="space-y-3">
            <p className="font-bold">إضافة رابط</p>
            <input name="url" type="url" dir="ltr" required className="field" placeholder="https://" />
            <input name="title" className="field" placeholder="عنوان الرابط" />
            <div className="grid grid-cols-2 gap-3"><input name="publisher" className="field" placeholder="الجهة المصدرة" /><select name="language" className="field"><option value="ar">عربي</option><option value="en">إنجليزي</option></select></div>
            <button className="btn-ghost">إضافة</button>
          </form>
        </div>
        <p className="mt-4 text-xs muted">الأسئلة المنشورة من دورات TIMSS حتى 2011 متاحة للاستخدام التعليمي غير التجاري مع ذكر المصدر، أما أسئلة الدورات منذ 2015 فتتطلب إذنًا من IEA.</p>
      </section>
    </div>
  );
}
