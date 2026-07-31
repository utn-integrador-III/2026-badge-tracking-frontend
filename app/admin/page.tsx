'use client';

import Image from 'next/image';
import { RotateCcw } from 'lucide-react';
import { BadgeRevocation } from '@/features/admin/badge-revocation';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { IssueBadgeForm } from '@/features/admin/issue-badge-form';

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

      <IssueBadgeForm />

      <section className="mt-6 border-t border-slate-200 pt-6">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Herramientas de Desarrollo (Dev Tools)</h2>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-900">Restablecer flujo de activación</h3>
            <p className="text-sm text-slate-600 mt-1">Limpia la identidad vinculada, el PIN y la sesión para probar nuevamente US-01, US-02 y US-03.</p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-semibold rounded-xl border border-red-200 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reiniciar flujo</span>
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
