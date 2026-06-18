'use client';

import { Users, ShieldCheck, Upload, RotateCcw } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth-store';

export default function AdminPage() {
  const { resetAuth } = useAuthStore();

  const handleReset = () => {
    resetAuth();
    alert('PIN y sesión restablecidos. Serás redirigido al flujo de creación de PIN.');
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

      <section className="mt-6 border-t border-slate-200 pt-6">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Herramientas de Desarrollo (Dev Tools)</h2>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-900">Restablecer PIN de Acceso</h3>
            <p className="text-sm text-slate-600 mt-1">Limpia el PIN guardado en LocalStorage y desautentica la sesión para probar la pantalla de registro/creación.</p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-semibold rounded-xl border border-red-200 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restablecer PIN</span>
          </button>
        </div>
      </section>
    </main>
  );
}

