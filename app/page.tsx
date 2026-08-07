'use client';

import Image from 'next/image';
import { Bell, LogOut, SmartphoneNfc } from 'lucide-react';
import { BadgeCard } from '@/components/badge/badge-card';
import { FirstRunTutorial } from '@/components/onboarding/first-run-tutorial';
import { mockBadge } from '@/features/badges/mock-data';
import { useAuthStore } from '@/features/auth/store/auth-store';

export default function HomePage() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#f4f6fc] pb-28 shadow-2xl">
      <header className="flex items-center justify-between bg-[#20398b] px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-white p-1.5">
            <Image src="/brand/logo.png" alt="Logo de la UTN" width={42} height={42} className="h-full w-full object-contain" priority />
          </div>
          <div>
            <h1 className="font-bold">Carnet Digital</h1>
            <p className="text-xs text-white/70">Perfil institucional</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-white/75"><SmartphoneNfc className="h-4 w-4" /> NFC</span>
          <button type="button" className="rounded-xl bg-white/10 p-2.5" aria-label="Notificaciones"><Bell className="h-4 w-4" /></button>
          <button type="button" onClick={logout} className="rounded-xl bg-white/10 p-2.5" aria-label="Cerrar sesión"><LogOut className="h-4 w-4" /></button>
        </div>
      </header>

      <section className="p-5">
        <FirstRunTutorial />
        <p className="mb-3 text-sm font-medium text-slate-600">Mi credencial</p>
        <BadgeCard badge={mockBadge} />

        <div className="mt-5 rounded-2xl border border-[#c8d2e8] bg-[#e8edf7] p-4 text-center text-sm font-medium text-[#20398b]">
          Credencial activa y verificada · Vigencia 2026
        </div>
      </section>
    </main>
  );
}
