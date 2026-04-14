'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'لوحة التحكم' },
  { href: '/admin/categories', label: 'التصنيفات' },
  { href: '/admin/menu', label: 'المنيو' },
  { href: '/admin/branches', label: 'الفروع' },
  { href: '/admin/settings', label: 'الإعدادات' },
  { href: '/admin/orders', label: 'الطلبات' },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                pathname === l.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground truncate max-w-[180px]" dir="ltr">
            {email}
          </span>
          <Button type="button" variant="outline" size="sm" onClick={() => void logout()}>
            خروج
          </Button>
        </div>
      </div>
    </header>
  );
}
