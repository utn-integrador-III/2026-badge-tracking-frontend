'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check, LoaderCircle, ShieldCheck } from 'lucide-react';
import { identityApi } from '@/lib/api/identity';
import { ApiError } from '@/lib/api/http-client';
import type { ApiRole, BadgeProfileResponse } from '@/lib/api/types';
import { storeInstitutionalIdentity } from '@/lib/session/institutional-identity';
import { useAuthStore } from '@/features/auth/store/auth-store';

type Screen = 'identity' | 'preview' | 'complete';

type ActivationUser = {
  institutionalId: string;
  fullName: string;
  email: string;
  role: ApiRole;
  badgeStatus: string;
  validUntil: string;
  pinConfigured: boolean;
};

const roleLabels: Record<ApiRole, string> = {
  student: 'Estudiante',
  professor: 'Profesor',
  staff: 'Personal',
  admin: 'Administrador'
};

function profileToActivationUser(profile: BadgeProfileResponse, email: string): ActivationUser {
  return {
    institutionalId: profile.institutionalId,
    fullName: profile.fullName,
    email,
    role: profile.role,
    badgeStatus: profile.status,
    validUntil: profile.validUntil.slice(0, 10),
    pinConfigured: true
  };
}

function Logo() {
  return (
    <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-sm">
      <Image src="/brand/logo.png" alt="Logo de la UTN" width={48} height={48} className="h-full w-full object-contain" priority />
    </div>
  );
}

function ActivationHeader({ complete = false }: Readonly<{ complete?: boolean }>) {
  return (
    <header className="bg-[#20398b] px-6 pb-7 pt-6 text-center text-white">
      <div className="mx-auto mb-4 w-fit"><Logo /></div>
      <h1 className="text-2xl font-bold">Registro institucional</h1>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-white/80">
        Vincule su identidad con el servicio institucional de credenciales
      </p>
      <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-white/85">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#20398b]">{complete ? <Check className="h-4 w-4" /> : '1'}</span>
        <span className="h-0.5 w-12 bg-white/50" />
        <span className={`grid h-7 w-7 place-items-center rounded-full ${complete ? 'bg-white text-[#20398b]' : 'bg-white/20'}`}>{complete ? <Check className="h-4 w-4" /> : '2'}</span>
      </div>
    </header>
  );
}

export function ActivationFlow() {
  const { markPinConfigured, resetAuth } = useAuthStore();
  const [screen, setScreen] = useState<Screen>('identity');
  const [user, setUser] = useState<ActivationUser | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submitIdentity(formData: FormData) {
    const institutionalId = String(formData.get('institutionalId') ?? '').replace(/\D/g, '');
    const fullName = String(formData.get('fullName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const role = String(formData.get('role') ?? 'student') as ApiRole;

    setSubmitting(true);
    setError('');
    try {
      const registered = await identityApi.registerIdentity({
        institutionalId,
        fullName,
        email,
        role
      });
      setUser({
        institutionalId: registered.user.institutionalId,
        fullName: registered.user.fullName,
        email: registered.user.email,
        role: registered.user.role,
        badgeStatus: registered.badge.status,
        validUntil: registered.badge.validUntil.slice(0, 10),
        pinConfigured: false
      });
      setScreen('preview');
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 409) {
        try {
          const existingProfile = await identityApi.getBadgeProfile(institutionalId);
          setUser(profileToActivationUser(existingProfile, email));
          setScreen('preview');
          return;
        } catch (profileError) {
          if (profileError instanceof ApiError && profileError.status === 404) {
            setError(caught.message);
          } else {
            setError(profileError instanceof Error ? profileError.message : 'No fue posible consultar la identidad existente.');
          }
          return;
        }
      }
      setError(caught instanceof Error ? caught.message : 'No fue posible registrar la identidad.');
    } finally {
      setSubmitting(false);
    }
  }

  function completeRegistration() {
    if (!user) return;
    storeInstitutionalIdentity({
      institutionalId: user.institutionalId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      registeredAt: new Date().toISOString()
    });
    if (user.pinConfigured) markPinConfigured();
    else resetAuth();
    setScreen('complete');
  }

  if (screen === 'complete' && user) {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-md bg-[#f4f6fc] shadow-2xl">
        <ActivationHeader complete />
        <section className="flex min-h-[480px] flex-col items-center px-7 py-12 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[#dff5e9] text-[#008947]"><ShieldCheck className="h-10 w-10" /></span>
          <h2 className="mt-6 text-2xl font-bold text-[#102252]">Identidad vinculada</h2>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
            El servicio institucional confirmó la credencial de {user.fullName}. El siguiente paso {user.pinConfigured ? 'validará' : 'configurará'} el PIN institucional.
          </p>
          <button type="button" onClick={() => window.location.assign('/')} className="mt-auto flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#20398b] font-bold text-white">
            {user.pinConfigured ? 'Continuar · Validar PIN' : 'Continuar · Crear PIN'} <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#f4f6fc] shadow-2xl">
      <ActivationHeader />
      <section className="px-6 py-7">
        {screen === 'identity' ? (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void submitIdentity(new FormData(event.currentTarget));
            }}
          >
            <label className="grid gap-1 text-sm font-semibold text-[#102252]">
              Identificación institucional
              <input required name="institutionalId" inputMode="numeric" pattern="[0-9]{9}" maxLength={9} className="h-12 rounded-xl border border-[#c8d2e8] bg-white px-4 font-mono" placeholder="9 dígitos" />
            </label>
            <label className="grid gap-1 text-sm font-semibold text-[#102252]">
              Nombre completo
              <input required name="fullName" minLength={2} className="h-12 rounded-xl border border-[#c8d2e8] bg-white px-4" placeholder="Nombre según registro institucional" />
            </label>
            <label className="grid gap-1 text-sm font-semibold text-[#102252]">
              Correo institucional
              <input required name="email" type="email" className="h-12 rounded-xl border border-[#c8d2e8] bg-white px-4" placeholder="usuario@utn.ac.cr" />
            </label>
            <label className="grid gap-1 text-sm font-semibold text-[#102252]">
              Rol
              <select name="role" className="h-12 rounded-xl border border-[#c8d2e8] bg-white px-4" defaultValue="student">
                <option value="student">Estudiante</option>
                <option value="professor">Profesor</option>
                <option value="staff">Personal</option>
                <option value="admin">Administrador</option>
              </select>
            </label>
            <div className="flex gap-3 rounded-2xl border border-[#c8d2e8] bg-[#e8edf7] p-4 text-sm leading-5 text-[#516aa7]">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#20398b]" />
              <p>Los datos se validan con el servicio institucional de credenciales. Si la identificación ya existe, se recuperará su credencial actual.</p>
            </div>
            {error ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p> : null}
            <button type="submit" disabled={submitting} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#20398b] font-bold text-white disabled:opacity-60">
              {submitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
              {submitting ? 'Consultando…' : 'Vincular identidad'}
            </button>
          </form>
        ) : user ? (
          <div>
            <div className="rounded-2xl border border-[#a9dbc1] bg-[#e5f5ed] p-4 text-[#008947]">
              <p className="flex items-center gap-2 font-bold"><Check className="h-5 w-5" /> Identidad confirmada por la API</p>
            </div>
            <article className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <h2 className="bg-[#20398b] px-5 py-4 text-xs font-semibold uppercase tracking-widest text-white">Datos institucionales</h2>
              <dl className="divide-y divide-slate-100 p-5 text-sm">
                {[
                  ['Nombre', user.fullName],
                  ['Identificación', user.institutionalId],
                  ['Correo', user.email],
                  ['Rol', roleLabels[user.role]],
                  ['Estado del badge', user.badgeStatus],
                  ['Válido hasta', user.validUntil]
                ].map(([label, value]) => <div key={label} className="py-3"><dt className="text-xs uppercase text-slate-500">{label}</dt><dd className="mt-1 font-semibold text-[#102252]">{value}</dd></div>)}
              </dl>
            </article>
            <button type="button" onClick={completeRegistration} className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#20398b] font-bold text-white">
              {user.pinConfigured ? 'Confirmar y validar PIN' : 'Confirmar y configurar PIN'} <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setScreen('identity')} className="mt-3 h-12 w-full text-sm font-semibold text-[#516aa7]">Corregir datos</button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
