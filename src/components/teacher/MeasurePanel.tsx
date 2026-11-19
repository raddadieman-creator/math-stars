import { prePostSummary } from '@/lib/metrics';
import { togglePost } from '@/app/teacher/(panel)/measure-actions';

type Row = { id: string; name: string; pre: number | null; post: number | null };

/** لوحة القياس القبلي والبعدي للفصل (وصفية، دون ادعاء سببية) */
export function MeasurePanel({ rows, postOpen, postId }: { rows: Row[]; postOpen: boolean; postId: string | null }) {
  const s = prePostSummary(rows.map((r) => ({ student_id: r.id, pre: r.pre, post: r.post, practiceItems: 0 })));
  const done = rows.filter((r) => r.pre !== null).length;
  return (
    <section className="panel mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold">القياس القبلي والبعدي</h2>
        {postId && <form action={togglePost}><input type="hidden" name="id" value={postId} /><input type="hidden" name="open" value={postOpen ? '0' : '1'} />
          <button className="btn-ghost">{postOpen ? 'إغلاق القياس البعدي' : 'فتح القياس البعدي للطلاب'}</button></form>}
      </div>
      <p className="mt-2 text-sm muted">أنجز القياس القبلي {done} من {rows.length}{s.pairedStudents ? ` · متوسط القبلي ${s.meanPre}٪ والبعدي ${s.meanPost}٪ لـ ${s.pairedStudents} طالبًا` : ''}.</p>
      <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[480px] text-sm">
        <thead className="text-ink/60"><tr><th className="py-2 text-start">الطالب</th><th>القبلي</th><th>البعدي</th><th>الفرق</th></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.id} className="border-t border-ink/5"><td className="py-2 font-bold">{r.name}</td>
            <td className="text-center">{r.pre === null ? 'لم يُنجز' : `${r.pre}٪`}</td>
            <td className="text-center">{r.post === null ? (postOpen ? 'لم يُنجز' : 'مغلق') : `${r.post}٪`}</td>
            <td className="text-center">{r.pre !== null && r.post !== null ? `${r.post - r.pre} نقطة` : '—'}</td></tr>))}</tbody>
      </table></div>
      <p className="mt-2 text-xs muted">الفرق وصفي، ولا يدل وحده على أن البرنامج هو سبب التغير.</p>
    </section>
  );
}
