'use client';

import Image from 'next/image';
import { LoaderCircle, RefreshCw } from 'lucide-react';
import { SelectiveShareQr } from '@/components/qr/selective-share-qr';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useBadgeProfile } from '@/features/badges/use-badge-profile';

const QR_LIFETIME_SECONDS = 60;

export default function SharePage() {
  const pin = useAuthStore((state) => state.pin);
  const { badge, loading, error, reload } = useBadgeProfile();

  if (loading) {
    return <main className="grid min-h-[70dvh] place-items-center"><LoaderCircle className="h-9 w-9 animate-spin text-[#20398b]" /></main>;
  }

  if (error || !badge || !pin) {
    return (
      <main className="mx-auto w-full max-w-md p-5">
        <section className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-800">
          <h1 className="font-bold">No fue posible preparar el código QR</h1>
          <p className="mt-2 text-sm">{error || 'Debe autenticarse con el PIN para compartir la credencial.'}</p>
          <button type="button" onClick={() => void reload()} className="mt-4 flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 font-semibold text-white"><RefreshCw className="h-4 w-4" /> Reintentar</button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#f4f6fc] pb-28 shadow-2xl">
      <header className="bg-[#20398b] px-5 pb-8 pt-5 text-center text-white">
        <Image src="/brand/logo.png" alt="Logo de la UTN" width={52} height={52} className="mx-auto rounded-xl bg-white p-1" priority />
        <h1 className="mt-4 text-2xl font-bold">Compartir credencial</h1>
        <p className="mt-2 text-sm text-white/75">Genera una prueba temporal para una verificacion segura.</p>
      </header>

      <section className="flex flex-col items-center gap-6 p-5 text-center">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Titular</p>
          <p className="mt-1 font-bold text-slate-900">{badge.holder.fullName}</p>
          <p className="text-sm text-slate-600">{badge.holder.institutionalId} - {badge.role}</p>
        </div>
        <SelectiveShareQr institutionalId={badge.holder.institutionalId} pin={pin} ttlSeconds={QR_LIFETIME_SECONDS} />
        <p className="text-xs leading-5 text-slate-500">El codigo deja de ser valido automaticamente despues de {QR_LIFETIME_SECONDS} segundos.</p>
      </section>
    </main>
  );
}
