'use client';

import { useState } from 'react';
import { CheckCircle2, LoaderCircle, Search, ShieldAlert, UserRoundX } from 'lucide-react';
import { identityApi } from '@/lib/api/identity';
import type { AdminBadgeSearchResult, BadgeLifecycleStatus } from '@/lib/api/types';
import { useStoredInstitutionalIdentity } from '@/lib/session/institutional-identity';
import { useAuthStore } from '@/features/auth/store/auth-store';

const roleLabels = { student: 'Estudiante', professor: 'Profesor', staff: 'Personal', admin: 'Administrador' } as const;

export function BadgeRevocation() {
  const [query, setQuery] = useState('');
  const [holders, setHolders] = useState<AdminBadgeSearchResult[]>([]);
  const [selected, setSelected] = useState<AdminBadgeSearchResult | null>(null);
  const [nextStatus, setNextStatus] = useState<BadgeLifecycleStatus>('revoked');
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pin = useAuthStore((state) => state.pin);
  const admin = useStoredInstitutionalIdentity();

  async function search() {
    if (!admin || !pin) return setError('La sesión administrativa no contiene identidad y PIN.');
    if (query.trim().length < 2) return setError('Ingrese al menos dos caracteres para buscar.');
    setSearching(true); setError(''); setNotice(''); setSelected(null);
    try {
      const response = await identityApi.searchBadgeHolders({ adminInstitutionalId: admin.institutionalId, adminPin: pin, query: query.trim(), limit: 20 });
      setHolders(response.results);
      if (response.results.length === 0) setNotice('No se encontraron titulares.');
    } catch (caught) {
      setHolders([]);
      setError(caught instanceof Error ? caught.message : 'No fue posible buscar titulares.');
    } finally { setSearching(false); }
  }

  async function updateStatus() {
    if (!admin || !pin || !selected?.badge) return;
    if (reason.trim().length < 3) return setError('El motivo debe contener al menos tres caracteres.');
    setSubmitting(true); setError(''); setNotice('');
    try {
      const response = await identityApi.updateBadgeStatus(selected.badge.id, {
        adminInstitutionalId: admin.institutionalId,
        adminPin: pin,
        status: nextStatus,
        reason: reason.trim()
      });
      setHolders((current) => current.map((holder) => holder.badge?.id === response.badge.id ? { ...holder, isActive: false, badge: response.badge } : holder));
      setSelected((current) => current ? { ...current, isActive: false, badge: response.badge } : current);
      setNotice(`La credencial de ${selected.fullName} quedó ${nextStatus === 'revoked' ? 'revocada' : 'suspendida'}.`);
      setReason('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No fue posible actualizar la credencial.');
    } finally { setSubmitting(false); }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <label htmlFor="holder-search" className="text-sm font-bold text-slate-900">Buscar titular</label>
        <div className="mt-3 flex gap-2">
          <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" /><input id="holder-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void search(); }} placeholder="Nombre, correo o ID" className="w-full rounded-2xl border border-slate-300 py-3 pl-10 pr-4 text-sm" /></div>
          <button type="button" disabled={searching} onClick={() => void search()} className="rounded-2xl bg-[#20398b] px-4 font-semibold text-white">{searching ? <LoaderCircle className="h-5 w-5 animate-spin" /> : 'Buscar'}</button>
        </div>
        <div className="mt-4 space-y-3">
          {holders.map((holder) => <article key={holder.userId} className={`rounded-2xl border p-4 ${selected?.userId === holder.userId ? 'border-[#20398b] bg-[#f4f6fc]' : 'border-slate-200'}`}><div className="flex justify-between gap-3"><div><p className="font-bold">{holder.fullName}</p><p className="text-sm text-slate-600">{holder.institutionalId} · {roleLabels[holder.role]}</p><p className="text-xs text-slate-500">{holder.email}</p></div><span className="h-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold">{holder.badge?.status ?? 'Sin badge'}</span></div><button type="button" disabled={!holder.badge} onClick={() => { setSelected(holder); setError(''); setNotice(''); }} className="mt-3 w-full rounded-xl border border-[#20398b] px-3 py-2 text-sm font-semibold text-[#20398b] disabled:opacity-40">Seleccionar</button></article>)}
        </div>
      </section>

      {selected?.badge ? <section className="rounded-3xl border border-red-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3 text-red-700"><ShieldAlert className="h-7 w-7" /><div><h2 className="font-bold">Cambiar estado de credencial</h2><p className="text-sm">Badge {selected.badge.badgeCode}</p></div></div><label className="mt-4 grid gap-1 text-sm font-bold">Acción<select value={nextStatus} onChange={(event) => setNextStatus(event.target.value as BadgeLifecycleStatus)} className="rounded-xl border border-slate-300 p-3 font-normal"><option value="suspended">Suspender</option><option value="revoked">Revocar permanentemente</option></select></label><label className="mt-4 block text-sm font-bold">Motivo<textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-normal" placeholder="Motivo administrativo" /></label><button type="button" disabled={submitting || reason.trim().length < 3} onClick={() => void updateStatus()} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white disabled:opacity-40">{submitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <UserRoundX className="h-5 w-5" />} {submitting ? 'Actualizando…' : nextStatus === 'revoked' ? 'Revocar credencial' : 'Suspender credencial'}</button></section> : null}
      {notice ? <p role="status" className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"><CheckCircle2 className="h-5 w-5 shrink-0" />{notice}</p> : null}
      {error ? <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p> : null}
    </div>
  );
}
