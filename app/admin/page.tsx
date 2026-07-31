'use client';

import Image from 'next/image';
import { RotateCcw } from 'lucide-react';
import { BadgeRevocation } from '@/features/admin/badge-revocation';
import { useAuthStore } from '@/features/auth/store/auth-store';

export default function AdminPage() {
  const resetAuth = useAuthStore((state) => state.resetAuth);

  const handleReset = () => {
    resetAuth();
    localStorage.removeItem('utn-institutional-identity');
    window.location.assign('/activate');
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#f4f6fc] pb-28 shadow-2xl">
      <header className="bg-[#20398b] px-5 pb-8 pt-5 text-center text-white">
        <Image src="/brand/logo.png" alt="Logo de la UTN" width={52} height={52} className="mx-auto rounded-xl bg-white p-1" priority />
        <h1 className="mt-4 text-2xl font-bold">Administrar credenciales</h1>
        <p className="mt-2 text-sm text-white/75">Busque un titular y revoque su badge institucional.</p>
      </header>

      <div className="space-y-8 p-5">
        <BadgeRevocation />

        <section className="border-t border-slate-200 pt-6">
          <h2 className="text-sm font-bold text-slate-900">Herramientas de desarrollo</h2>
          <button type="button" onClick={handleReset} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-semibold text-red-600">
            <RotateCcw className="h-4 w-4" aria-hidden /> Reiniciar flujo de activación
          </button>
        </section>
      </div>
    </main>
  );
}
