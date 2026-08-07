'use client';

import { RotateCcw, ShieldCheck, Upload, Users } from 'lucide-react';
import { BadgeRevocation } from '@/features/admin/badge-revocation';
import { IssueBadgeForm } from '@/features/admin/issue-badge-form';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { AuditHistoryPanel } from '@/features/audit/audit-history-panel';

export default function AdminPage() {
  const { resetAuth } = useAuthStore();

  const handleReset = () => {
    resetAuth();
    localStorage.removeItem('utn-institutional-identity');
    window.location.assign('/activate');
  };

  const actions = [
    { title: 'Emitir badge', description: 'Crear credencial y asociarla a usuario institucional.', icon: ShieldCheck },
    { title: 'Importar usuarios', description: 'Carga CSV/LDAP para onboarding masivo.', icon: Upload },
    { title: 'Administrar usuarios', description: 'Buscar, suspender y revisar estado de credenciales.', icon: Users }
  ];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 pb-24">
      <h1 className="text-2xl font-bold">Portal administrativo</h1>

      <div className="grid gap-3 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <article key={action.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <Icon className="mb-3 h-6 w-6 text-brand-700" aria-hidden />
              <h2 className="font-semibold">{action.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{action.description}</p>
            </article>
          );
        })}
      </div>

      <div className="space-y-8">
        <IssueBadgeForm />
        <BadgeRevocation />
        <AuditHistoryPanel />

        <section className="border-t border-slate-200 pt-6">
          <h2 className="mb-2 text-lg font-bold text-slate-900">Herramientas de Desarrollo (Dev Tools)</h2>
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-semibold text-slate-900">Restablecer flujo de activacion</h3>
              <p className="mt-1 text-sm text-slate-600">Limpia la identidad vinculada, el PIN y la sesion para probar nuevamente US-01, US-02 y US-03.</p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="flex cursor-pointer items-center justify-center gap-2 self-start rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-100 hover:text-red-700 sm:self-auto"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              <span>Reiniciar flujo</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
