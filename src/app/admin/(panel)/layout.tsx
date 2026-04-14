import { requireAdmin } from '@/lib/auth-server';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminNav email={session.email} />
      <main className="max-w-5xl mx-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}
