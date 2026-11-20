import { Shell } from '@/components/Shell';
import { StudentNav } from '@/components/student/StudentNav';
import { requireStudent } from '@/lib/student-data';
import { getSettings } from '@/lib/data';
import { studentAchievements } from '@/lib/report-data';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Certificate, shareText } from '@/components/Certificate';
import { DocActions } from '@/components/teacher/DocActions';

export const dynamic = 'force-dynamic';

export default async function StudentCertificate() {
  const me = await requireStudent();
  const [a, s] = await Promise.all([studentAchievements(supabaseAdmin(), me.student.id), getSettings()]);
  return (
    <Shell>
      <div className="no-print"><StudentNav /></div>
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">شهادة منجزاتي</h1>
        {a && <DocActions targetId="certificate" filename="شهادة منجزاتي" title="شهادة منجزاتي" whatsapp={shareText(a, s.platform_name)} />}
      </div>
      {a && <Certificate a={a} platform={s.platform_name} school={s.school_name} principal={s.principal_name} />}
    </Shell>
  );
}
