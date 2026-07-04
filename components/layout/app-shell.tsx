'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, QrCode, ScanLine, UserCog } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/share', label: 'QR', icon: QrCode },
  { href: '/verify', label: 'Verificar', icon: ScanLine },
  { href: '/admin', label: 'Admin', icon: UserCog }
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const immersive = pathname === '/activate';

  return (
    <div className="min-h-dvh">
      {children}
      {!immersive && <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium text-slate-700">
                <Icon className="h-5 w-5" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>}
    </div>
  );
}
