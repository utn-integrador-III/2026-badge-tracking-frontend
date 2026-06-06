import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaRegister } from '@/components/pwa/pwa-register';
import { AppShell } from '@/components/layout/app-shell';

export const metadata: Metadata = {
  title: 'Digital Badge',
  description: 'Credencial digital institucional con QR, verificación offline y PWA.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Digital Badge',
    statusBarStyle: 'default'
  }
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <PwaRegister />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
