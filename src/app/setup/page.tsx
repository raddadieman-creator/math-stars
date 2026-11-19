import { Shell } from '@/components/Shell';
import { isConfigured } from '@/lib/env';

export default function Setup() {
  return (
    <Shell>
      <div className="panel mx-auto max-w-2xl space-y-3 leading-8">
        <h1 className="text-2xl font-black">إعداد المنصة</h1>
        {isConfigured() ? <p className="text-aqua-600">المنصة متصلة بقاعدة البيانات.</p> : (
          <>
            <p>المنصة تحتاج إلى ربطها بمشروع Supabase قبل الاستخدام:</p>
            <ol className="list-decimal space-y-1 pr-6">
              <li>أنشئي مشروعًا في Supabase وشغّلي ملفات <code>supabase/migrations</code> بالترتيب.</li>
              <li>أضيفي متغيرات البيئة الواردة في <code>.env.example</code> إلى Vercel.</li>
              <li>أنشئي حسابات المعلمتين والإدارة بالأمر <code>npm run create-staff</code>.</li>
            </ol>
            <p className="muted">التفاصيل في ملف README.</p>
          </>
        )}
      </div>
    </Shell>
  );
}
