'use client';

import Image from 'next/image';
import { Bell, LoaderCircle, LogOut, RefreshCw, SmartphoneNfc } from 'lucide-react';
import { BadgeCard } from '@/components/badge/badge-card';
import { InstitutionBrandingPreview } from '@/components/branding/institution-branding-preview';
import { LanguageSelector } from '@/components/i18n/language-selector';
import { ExpiryNotificationCard } from '@/components/notifications/expiry-notification-card';
import { FirstRunTutorial } from '@/components/onboarding/first-run-tutorial';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useBadgeProfile } from '@/features/badges/use-badge-profile';

const statusLabels = {
  active: 'Credencial activa y verificada',
  suspended: 'Credencial suspendida',
  revoked: 'Credencial revocada',
  expired: 'Credencial vencida'
} as const;

export default function HomePage() {
  const logout = useAuthStore((state) => state.logout);
  const { badge, loading, error, reload } = useBadgeProfile();

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
        {loading ? (
          <div className="grid min-h-72 place-items-center rounded-3xl bg-white shadow-sm">
            <LoaderCircle className="h-8 w-8 animate-spin text-[#20398b]" aria-label="Cargando credencial" />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            <p className="font-bold">No fue posible cargar la credencial</p>
            <p className="mt-1">{error}</p>
            <button type="button" onClick={() => void reload()} className="mt-4 flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 font-semibold text-white">
              <RefreshCw className="h-4 w-4" /> Reintentar
            </button>
          </div>
        ) : badge ? (
          <>
            <BadgeCard badge={badge} />
            <div className="mt-5">
              <ExpiryNotificationCard badge={badge} />
            </div>
            <div className="mt-5">
              <InstitutionBrandingPreview badge={badge} />
            </div>
            <div className={`mt-5 rounded-2xl border p-4 text-center text-sm font-medium ${badge.status === 'active' ? 'border-[#c8d2e8] bg-[#e8edf7] text-[#20398b]' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
              {statusLabels[badge.status]} · Vigencia {badge.validUntil.slice(0, 4)}
            </div>
          </>
        ) : null}

        <div className="mt-5">
          <LanguageSelector />
        </div>

      </section>
    </main>
  );
}
