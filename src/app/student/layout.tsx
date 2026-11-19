import { MadaAssistant } from '@/components/Suha';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (<>{children}<MadaAssistant /></>);
}
