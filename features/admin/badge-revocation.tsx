'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Search, ShieldAlert, UserRoundCheck, UserRoundX } from 'lucide-react';
import { initialBadgeHolders, revokeBadgeHolder, searchBadgeHolders } from '@/features/admin/badge-management';
import { identityApi } from '@/lib/api/identity';
import { API_BASE_URL } from '@/lib/api/http-client';

const roleLabels = { Student: 'Estudiante', Professor: 'Profesor', Staff: 'Personal' } as const;

export function BadgeRevocation() {
  const [holders, setHolders] = useState(initialBadgeHolders);
  const [query, setQuery] = useState('');
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const results = useMemo(() => searchBadgeHolders(holders, query), [holders, query]);
  const selected = holders.find((holder) => holder.badgeId === selectedBadgeId);

  const selectHolder = (badgeId: string) => {
    setSelectedBadgeId(badgeId);
    setReason('');
    setNotice('');
    setError('');
  };

  const handleRevoke = async () => {
    if (!selected || !reason.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      if (API_BASE_URL) {
        await identityApi.revokeBadge(selected.badgeId, { reason: reason.trim() });
      }
      setHolders((current) => revokeBadgeHolder(current, selected.badgeId, reason));
      setNotice(`La credencial de ${selected.fullName} fue revocada y su perfil quedó inactivo.`);
      setReason('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No fue posible revocar la credencial.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <label htmlFor="holder-search" className="text-sm font-bold text-slate-900">Buscar titular</label>
        <p className="mt-1 text-sm text-slate-500">Use el nombre, correo o identificación institucional.</p>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" aria-hidden />
          <input
            id="holder-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej. 2024-0001"
            className="w-full rounded-2xl border border-slate-300 py-3 pl-10 pr-4 text-sm"
          />
        </div>

        <div className="mt-4 space-y-3" aria-live="polite">
          {results.map((holder) => {
            const inactive = holder.accountStatus === 'inactive';
            return (
              <article key={holder.userId} className={`rounded-2xl border p-4 ${selectedBadgeId === holder.badgeId ? 'border-[#20398b] bg-[#f4f6fc]' : 'border-slate-200'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">{holder.fullName}</p>
                    <p className="mt-1 text-sm text-slate-600">{holder.institutionalId} · {roleLabels[holder.role]}</p>
                    <p className="truncate text-xs text-slate-500">{holder.email}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${inactive ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {inactive ? 'Inactivo' : holder.badgeStatus === 'suspended' ? 'Suspendido' : 'Activo'}
                  </span>
                </div>
                <button type="button" onClick={() => selectHolder(holder.badgeId)} className="mt-3 w-full rounded-xl border border-[#20398b] px-3 py-2 text-sm font-semibold text-[#20398b]">
                  Seleccionar
                </button>
              </article>
            );
          })}
          {results.length === 0 ? <p className="rounded-2xl bg-slate-100 p-4 text-center text-sm text-slate-600">No se encontraron titulares.</p> : null}
        </div>
      </section>

      {selected ? (
        <section className="rounded-3xl border border-red-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-red-700">
            <ShieldAlert className="h-7 w-7" aria-hidden />
            <div><h2 className="font-bold">Revocar credencial</h2><p className="text-sm">Esta acción invalida el badge inmediatamente.</p></div>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
            <p className="font-bold text-slate-900">{selected.fullName}</p>
            <p className="mt-1 text-slate-600">Badge: {selected.badgeId}</p>
            <p className="text-slate-600">Estado de cuenta: {selected.accountStatus === 'active' ? 'Activo' : 'Inactivo'}</p>
          </div>

          {selected.badgeStatus !== 'revoked' ? (
            <>
              <label htmlFor="revocation-reason" className="mt-4 block text-sm font-bold text-slate-900">Motivo de revocación</label>
              <textarea id="revocation-reason" value={reason} onChange={(event) => setReason(event.target.value)} rows={3} placeholder="Ej. Graduación o terminación laboral" className="mt-2 w-full resize-none rounded-xl border border-slate-300 p-3 text-sm" />
              <button type="button" disabled={!reason.trim() || submitting} onClick={handleRevoke} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white disabled:opacity-40">
                <UserRoundX className="h-5 w-5" aria-hidden /> {submitting ? 'Procesando…' : 'Revocar y marcar inactivo'}
              </button>
            </>
          ) : (
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-red-50 p-4 font-semibold text-red-700"><UserRoundX className="h-5 w-5" aria-hidden /> Credencial revocada · Perfil inactivo</div>
          )}

          {notice ? <p role="status" className="mt-4 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden /> {notice}</p> : null}
          {error ? <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p> : null}
        </section>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-[#c8d2e8] bg-[#e8edf7] p-4 text-sm text-[#20398b]"><UserRoundCheck className="h-5 w-5" aria-hidden /> Seleccione un titular para administrar su credencial.</div>
      )}
    </div>
  );
}
