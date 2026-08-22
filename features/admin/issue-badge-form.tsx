'use client';

import { useState } from 'react';
import { BadgeCheck, LoaderCircle, Send } from 'lucide-react';
import { identityApi } from '@/lib/api/identity';
import type { ApiBadge, ApiRole } from '@/lib/api/types';
import { useStoredInstitutionalIdentity } from '@/lib/session/institutional-identity';
import { useAuthStore } from '@/features/auth/store/auth-store';

const roles: Array<{ label: string; value: ApiRole }> = [
  { label: 'Estudiante', value: 'student' },
  { label: 'Profesor', value: 'professor' },
  { label: 'Personal', value: 'staff' },
  { label: 'Administrador', value: 'admin' }
];

export function IssueBadgeForm() {
  const [issuedBadge, setIssuedBadge] = useState<ApiBadge | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const pin = useAuthStore((state) => state.pin);
  const admin = useStoredInstitutionalIdentity();

  async function submit(formData: FormData) {
    if (!admin || !pin) {
      setError('La sesión administrativa no contiene identidad y PIN.');
      return;
    }

    setSubmitting(true);
    setError('');
    setIssuedBadge(null);
    try {
      const response = await identityApi.issueBadge({
        adminInstitutionalId: admin.institutionalId,
        adminPin: pin,
        institutionalId: String(formData.get('institutionalId') ?? '').replace(/\D/g, ''),
        roleType: String(formData.get('roleType') ?? 'student') as ApiRole,
        validForDays: Number(formData.get('validForDays') ?? 365)
      });
      setIssuedBadge(response.badge);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No fue posible emitir la credencial.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-[#20398b]"><BadgeCheck className="h-5 w-5" /></span>
        <div><h2 className="text-lg font-bold text-slate-950">Emitir nuevo badge</h2><p className="text-sm text-slate-600">La operación se ejecuta como {admin?.fullName ?? 'administrador'}.</p></div>
      </div>
      <form className="mt-5 grid gap-3" onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }}>
        <label className="grid gap-1 text-sm font-medium text-slate-700">ID institucional del titular<input required name="institutionalId" inputMode="numeric" pattern="[0-9]{9}" maxLength={9} className="rounded-xl border border-slate-200 px-3 py-2" placeholder="9 dígitos" /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700">Tipo de badge<select name="roleType" className="rounded-xl border border-slate-200 px-3 py-2" defaultValue="student">{roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}</select></label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">Vigencia en días<input required name="validForDays" type="number" min={1} max={1825} defaultValue={365} className="rounded-xl border border-slate-200 px-3 py-2" /></label>
        </div>
        {error ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
        <button type="submit" disabled={submitting} className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#20398b] px-4 py-3 font-semibold text-white disabled:opacity-60">
          {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {submitting ? 'Emitiendo…' : 'Emitir badge'}
        </button>
      </form>
      {issuedBadge ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><p className="font-bold">Badge emitido correctamente</p><p>{issuedBadge.badgeCode} · {issuedBadge.roleType} · {issuedBadge.status}</p></div> : null}
    </section>
  );
}
