'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import {
  DEMO_VERIFICATION_CODE,
  findInstitutionalUser,
  maskEmail,
  type InstitutionalUser
} from '@/features/onboarding/mock-users';

type Screen = 'identity' | 'verification' | 'preview' | 'complete';

function Logo() {
  return (
    <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-sm">
      <Image src="/brand/logo.png" alt="Logo de la UTN" width={48} height={48} className="h-full w-full object-contain" priority />
    </div>
  );
}

function RegistrationProgress({ complete = false }: Readonly<{ complete?: boolean }>) {
  return (
    <div className="mt-7 flex items-start justify-center" aria-label={complete ? 'Registro completado' : 'Validación de identidad'}>
      <div className="flex w-28 flex-col items-center gap-1.5 text-center">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-[#20398b]">
          {complete ? <Check className="h-4 w-4" /> : '1'}
        </span>
        <span className="text-[11px] font-semibold text-white">Validar identidad</span>
      </div>
      <span className={`mt-3.5 h-0.5 w-10 ${complete ? 'bg-white' : 'bg-white/25'}`} />
      <div className="flex w-28 flex-col items-center gap-1.5 text-center">
        <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${complete ? 'bg-white text-[#20398b]' : 'bg-white/20 text-white/60'}`}>
          {complete ? <Check className="h-4 w-4" /> : '2'}
        </span>
        <span className={`text-[11px] ${complete ? 'font-semibold text-white' : 'text-white/55'}`}>Identidad vinculada</span>
      </div>
    </div>
  );
}

function ActivationHeader({ complete = false }: Readonly<{ complete?: boolean }>) {
  return (
    <header className="bg-[#20398b] px-6 pb-8 pt-6 text-center text-white">
      <div className="mx-auto mb-5 w-fit"><Logo /></div>
      <h1 className="text-2xl font-bold">Registro institucional</h1>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-white/80">
        Vincule su identificación para emitir su credencial digital
      </p>
      <RegistrationProgress complete={complete} />
    </header>
  );
}

export function ActivationFlow() {
  const [screen, setScreen] = useState<Screen>('identity');
  const [nationalId, setNationalId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [user, setUser] = useState<InstitutionalUser | null>(null);
  const [error, setError] = useState('');

  const formattedId = useMemo(() => nationalId.replace(/\D/g, '').slice(0, 9), [nationalId]);

  function validateIdentity() {
    const match = findInstitutionalUser(formattedId);
    if (!match) {
      setError('No encontramos esta cédula en el registro institucional.');
      return;
    }
    setUser(match);
    setError('');
    setScreen('verification');
  }

  function verifyCode() {
    if (verificationCode !== DEMO_VERIFICATION_CODE) {
      setError('El código no es correcto. Revíselo e intente nuevamente.');
      return;
    }
    setError('');
    setScreen('preview');
  }

  function completeRegistration() {
    if (!user) return;
    localStorage.setItem(
      'utn-institutional-identity',
      JSON.stringify({ nationalId: user.nationalId, institutionalId: user.studentId, registeredAt: new Date().toISOString() })
    );
    setScreen('complete');
  }

  function restart() {
    setScreen('identity');
    setNationalId('');
    setVerificationCode('');
    setUser(null);
    setError('');
  }

  if (screen === 'complete' && user) {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-md bg-[#f4f6fc] shadow-2xl">
        <ActivationHeader complete />
        <section className="flex min-h-[480px] flex-col items-center px-7 py-12 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[#dff5e9] text-[#008947]">
            <ShieldCheck className="h-10 w-10" />
          </span>
          <h2 className="mt-6 text-2xl font-bold text-[#102252]">Registro completado</h2>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
            La identidad institucional de {user.fullName} fue vinculada correctamente.
          </p>
          <div className="mt-7 w-full rounded-2xl border border-[#c8d2e8] bg-white p-5 text-left">
            <p className="text-xs uppercase tracking-wider text-[#516aa7]">Identificación institucional</p>
            <p className="mt-1 font-mono font-bold text-[#20398b]">{user.studentId}</p>
            <p className="mt-4 text-xs text-slate-500">Continúe para configurar el PIN que protegerá su credencial en este dispositivo.</p>
          </div>
          <button type="button" onClick={() => window.location.assign('/')} className="mt-auto flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#20398b] font-bold text-white">
            Continuar · Crear PIN <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={restart} className="mt-3 flex h-12 w-full items-center justify-center rounded-2xl border border-[#20398b] font-semibold text-[#20398b]">
            Registrar otra identidad
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#f4f6fc] shadow-2xl">
      <ActivationHeader />
      <section className="flex min-h-[520px] flex-col px-6 py-8">
        {screen === 'identity' && (
          <>
            <label htmlFor="national-id" className="font-semibold text-[#102252]">Número de cédula</label>
            <div className="mt-2 flex items-center rounded-2xl border border-[#c8d2e8] px-4 focus-within:ring-2 focus-within:ring-[#20398b]">
              <span className="text-xl text-[#5b72ac]">#</span>
              <input
                id="national-id"
                inputMode="numeric"
                autoComplete="off"
                value={formattedId}
                onChange={(event) => {
                  setNationalId(event.target.value);
                  setError('');
                }}
                placeholder="123456789"
                className="h-14 w-full bg-transparent px-4 font-mono text-lg tracking-[0.18em] text-[#20398b] outline-none"
              />
            </div>
            <p className="mt-2 text-xs text-[#516aa7]">Sin guiones ni espacios · 9 dígitos</p>
            <div className="mt-7 flex gap-3 rounded-2xl border border-[#c8d2e8] bg-[#e8edf7] p-4 text-sm leading-5 text-[#516aa7]">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#20398b]" />
              <p>
                Sus datos ya están registrados en el sistema UTN. Ingrese su cédula para vincular su identidad.
                <br />
                <span className="font-mono text-xs text-[#20398b]">Demo: 123456789 / 987654321 / 456789123</span>
              </p>
            </div>
            {error && <p role="alert" className="mt-4 text-sm font-medium text-red-600">{error}</p>}
            <button type="button" disabled={formattedId.length !== 9} onClick={validateIdentity} className="mt-auto flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#20398b] font-bold text-white disabled:bg-[#d7e1ef] disabled:text-[#6377a8]">
              Validar identidad <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}

        {screen === 'verification' && user && (
          <>
            <div className="rounded-2xl border border-[#b8d8c8] bg-[#e8f6ee] p-4 text-sm text-[#08783f]">
              <div className="flex items-center gap-2 font-bold"><ShieldCheck className="h-5 w-5" /> Verifique su correo institucional</div>
              <p className="mt-1 pl-7">Enviamos un código temporal a {maskEmail(user.email)}.</p>
            </div>
            <label htmlFor="verification-code" className="mt-8 font-semibold text-[#102252]">Código de verificación</label>
            <input
              id="verification-code"
              inputMode="numeric"
              maxLength={6}
              value={verificationCode}
              onChange={(event) => {
                setVerificationCode(event.target.value.replace(/\D/g, ''));
                setError('');
              }}
              placeholder="000000"
              className="mt-2 h-16 rounded-2xl border border-[#c8d2e8] bg-white text-center font-mono text-2xl tracking-[0.5em] text-[#20398b] outline-none focus:ring-2 focus:ring-[#20398b]"
            />
            <p className="mt-3 text-center text-xs text-slate-500">Código demo: <strong>123456</strong></p>
            {error && <p role="alert" className="mt-4 text-center text-sm font-medium text-red-600">{error}</p>}
            <button type="button" disabled={verificationCode.length !== 6} onClick={verifyCode} className="mt-auto flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#20398b] font-bold text-white disabled:bg-[#d7e1ef] disabled:text-[#6377a8]">
              Comprobar código <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setScreen('identity')} className="mt-4 flex items-center justify-center gap-2 text-sm text-[#516aa7]">
              <ArrowLeft className="h-4 w-4" /> Cambiar número de cédula
            </button>
          </>
        )}

        {screen === 'preview' && user && (
          <>
            <div className="rounded-2xl border border-[#a9dbc1] bg-[#e5f5ed] p-4 text-[#008947]">
              <p className="flex items-center gap-2 font-bold"><span className="grid h-5 w-5 place-items-center rounded-full border-2 border-current"><Check className="h-3 w-3" /></span> Identidad verificada</p>
              <p className="mt-1 pl-7 text-xs">Sus datos han sido encontrados en el sistema</p>
            </div>
            <article className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <h2 className="bg-[#20398b] px-5 py-4 text-xs font-semibold uppercase tracking-widest text-white">Datos institucionales</h2>
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-[#b9c7df] bg-[#e5ecf6] text-lg font-bold text-[#20398b]">{user.initials}</span>
                  <div><h3 className="font-bold leading-5 text-[#102252]">{user.fullName}</h3><p className="mt-1 font-mono text-xs text-[#516aa7]">ID {user.studentId}</p></div>
                </div>
                {[['Rol', user.role], ['Carrera / área', user.program], ['Sede', user.campus], ['Correo', user.email]].map(([label, value]) => (
                  <div key={label} className="mt-4 border-t border-slate-200 pt-3"><p className="text-[11px] uppercase tracking-wider text-[#516aa7]">{label}</p><p className="mt-1 text-sm font-medium text-[#102252]">{value}</p></div>
                ))}
              </div>
            </article>
            <p className="mt-5 text-center text-sm text-[#516aa7]">Confirme que estos datos corresponden a su identidad.</p>
            <button type="button" onClick={completeRegistration} className="mt-5 flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#20398b] font-bold text-white">
              Vincular identidad <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={restart} className="mt-4 text-sm font-medium text-[#516aa7]">No soy yo · Reintentar</button>
          </>
        )}
      </section>
    </main>
  );
}
