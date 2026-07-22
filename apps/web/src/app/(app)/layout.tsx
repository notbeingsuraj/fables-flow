import { AppShell } from '@/components/layout/app-shell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell user={{ name: 'Suraj Kumar', email: 'suraj@fablesflow.com' }}>{children}</AppShell>
  );
}
