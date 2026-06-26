import { Users, ShieldCheck, Upload } from 'lucide-react';

const actions = [
  { title: 'Emitir badge', description: 'Crear credencial y asociarla a usuario institucional.', icon: ShieldCheck },
  { title: 'Importar usuarios', description: 'Carga CSV/LDAP para onboarding masivo.', icon: Upload },
  { title: 'Administrar usuarios', description: 'Buscar, suspender y revisar estado de credenciales.', icon: Users }
];

export default function AdminPage() {
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
    </main>
  );
}
