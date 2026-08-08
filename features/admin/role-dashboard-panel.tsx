'use client';

import { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { type AdminRole, getDashboardActionsForRole } from './role-dashboard';

const roles: AdminRole[] = ['Registrar', 'Security', 'Viewer'];

export function RoleDashboardPanel() {
  const [role, setRole] = useState<AdminRole>('Registrar');
  const actions = getDashboardActionsForRole(role);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-[#20398b]">
          <LayoutDashboard className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-950">Dashboard por rol</h2>
          <p className="text-sm text-slate-600">Muestra acciones segun el perfil administrativo.</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {roles.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setRole(option)}
            className={`rounded-xl border px-2 py-2 text-xs font-bold ${role === option ? 'border-[#20398b] bg-[#20398b] text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        {actions.map((action) => (
          <article key={action.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <h3 className="font-bold text-slate-950">{action.title}</h3>
            <p className="text-sm text-slate-600">{action.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
