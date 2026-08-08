'use client';

import { useState } from 'react';
import { BadgeCheck, Send } from 'lucide-react';
import type { BadgeRole, DigitalBadge } from '@/types/badge';
import { issueBadgeToUser } from './badge-issuance';

const roles: Array<{ label: string; value: BadgeRole }> = [
  { label: 'Estudiante', value: 'Student' },
  { label: 'Profesor', value: 'Professor' },
  { label: 'Staff', value: 'Staff' }
];

export function IssueBadgeForm() {
  const [issuedBadge, setIssuedBadge] = useState<DigitalBadge | null>(null);
  const [error, setError] = useState('');

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-[#20398b]">
          <BadgeCheck className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-950">Emitir nuevo badge</h2>
          <p className="text-sm text-slate-600">Asocie un usuario institucional y genere una credencial activa.</p>
        </div>
      </div>

      <form
        className="mt-5 grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          setError('');

          const formData = new FormData(event.currentTarget);
          try {
            const badge = issueBadgeToUser({
              department: String(formData.get('department') ?? ''),
              email: String(formData.get('email') ?? ''),
              fullName: String(formData.get('fullName') ?? ''),
              institutionalId: String(formData.get('institutionalId') ?? ''),
              role: String(formData.get('role') ?? 'Student') as BadgeRole,
              validUntil: String(formData.get('validUntil') ?? '')
            });
            setIssuedBadge(badge);
          } catch (issueError) {
            setError(issueError instanceof Error ? issueError.message : 'Unable to issue the badge.');
          }
        }}
      >
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Nombre completo
          <input name="fullName" className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Nombre del usuario" defaultValue="Laura Méndez Castro" />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            ID institucional
            <input name="institutionalId" className="rounded-xl border border-slate-200 px-3 py-2" placeholder="2026-0100" defaultValue="2026-0100" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Rol
            <select name="role" className="rounded-xl border border-slate-200 px-3 py-2" defaultValue="Student">
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Correo institucional
          <input name="email" className="rounded-xl border border-slate-200 px-3 py-2" placeholder="usuario@utn.ac.cr" defaultValue="lmendez@utn.ac.cr" />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Departamento
            <input name="department" className="rounded-xl border border-slate-200 px-3 py-2" defaultValue="Vida Estudiantil" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Válido hasta
            <input name="validUntil" type="date" className="rounded-xl border border-slate-200 px-3 py-2" defaultValue="2026-12-31" />
          </label>
        </div>

        {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p> : null}

        <button type="submit" className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#20398b] px-4 py-3 font-semibold text-white">
          <Send className="h-4 w-4" aria-hidden />
          Emitir badge
        </button>
      </form>

      {issuedBadge ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-bold">Badge emitido correctamente</p>
          <p>
            {issuedBadge.holder.fullName} · {issuedBadge.holder.institutionalId} · {issuedBadge.role}
          </p>
        </div>
      ) : null}
    </section>
  );
}
