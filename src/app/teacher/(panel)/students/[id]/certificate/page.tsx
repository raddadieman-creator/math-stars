import { notFound } from 'next/navigation';
import { requireStaff, getSettings } from '@/lib/data';
import { studentAchievements } from '@/lib/report-data';
import { Certificate, shareText } from '@/components/Certificate';
import { DocActions } from '@/components/teacher/DocActions';

export const dynamic = 'force-dynamic';

export default async function TeacherCertificate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb } = await requireStaff();
  const [a, s] = await Promise.all([studentAchievements(sb, id), getSettings()]);
  if (!a) notFound();
  return (
    <div className="space-y-4">
      <div className="no-print flex justify-end"><DocActions targetId="certificate" filename={`شهادة ${a.name}`} title={`شهادة ${a.name}`} whatsapp={shareText(a, s.platform_name)} /></div>
      <Certificate a={a} platform={s.platform_name} school={s.school_name} principal={s.principal_name} />
    </div>
  );
}
