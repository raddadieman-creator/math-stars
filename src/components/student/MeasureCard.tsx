import Link from 'next/link';

type M = { open: boolean; count: number; done: { score: number; max: number; at: string } | null } | null;
const pct = (d: { score: number; max: number }) => Math.round((d.score / Math.max(1, d.max)) * 100);

/** بطاقتا القياس القبلي والبعدي في صفحة الطالب */
export function MeasureCard({ pre, post }: { pre: M; post: M }) {
  if (!pre && !post) return null;
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <div className={`card-3d p-6 ${pre && !pre.done ? 'border-2 border-star-400' : ''}`}>
        <p className="text-sm muted">الخطوة الأولى</p><h2 className="text-xl font-extrabold">القياس القبلي</h2>
        {pre?.done ? <p className="mt-2">النتيجة <b>{pre.done.score} من {pre.done.max}</b> ({pct(pre.done)}٪).</p>
          : pre?.open ? <><p className="mt-2 muted">{pre.count} سؤالًا تغطي المعايير كلها، لتحديد المستوى قبل التدريب. تظهر النتيجة بعد التسليم.</p><Link href="/student/measure/pre" className="btn-star mt-4">بدء القياس القبلي</Link></>
          : <p className="mt-2 muted">غير متاح الآن.</p>}
      </div>
      <div className={`card-3d p-6 ${post?.open && !post.done ? 'border-2 border-star-400' : ''}`}>
        <p className="text-sm muted">الخطوة الأخيرة</p><h2 className="text-xl font-extrabold">القياس البعدي</h2>
        {post?.done ? <p className="mt-2">النتيجة <b>{post.done.score} من {post.done.max}</b> ({pct(post.done)}٪){pre?.done ? `، والفرق عن القبلي ${pct(post.done) - pct(pre.done)} نقطة مئوية` : ''}.</p>
          : post?.open ? <><p className="mt-2 muted">نموذج مكافئ للقياس القبلي.</p><Link href="/student/measure/post" className="btn-star mt-4">بدء القياس البعدي</Link></>
          : <p className="mt-2 muted">يُفتح في نهاية البرنامج عندما يفتحه المعلم.</p>}
      </div>
    </div>
  );
}
