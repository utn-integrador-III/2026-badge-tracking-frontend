import { CheckCircle2, ShieldX } from 'lucide-react';
import type { QrVerificationResult } from '@/features/verification/verify-qr-token';

export function VerificationResult({ result }: Readonly<{ result: QrVerificationResult }>) {
  const granted = result.outcome === 'granted';
  const Icon = granted ? CheckCircle2 : ShieldX;

  return (
    <section aria-live="polite" className={`rounded-3xl border p-5 shadow-sm ${granted ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
      <div className={`flex items-center gap-3 ${granted ? 'text-emerald-800' : 'text-red-800'}`}>
        <Icon className="h-9 w-9 shrink-0" aria-hidden />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">{granted ? 'Acceso permitido' : 'Acceso denegado'}</p>
          <p className="mt-1 font-semibold">{result.message}</p>
        </div>
      </div>

      {result.profile ? (
        <dl className="mt-5 space-y-3 border-t border-slate-900/10 pt-4 text-sm text-slate-800">
          <div><dt className="text-xs uppercase tracking-wider text-slate-500">Nombre completo</dt><dd className="mt-1 font-bold">{result.profile.fullName}</dd></div>
          <div className="grid grid-cols-2 gap-3">
            <div><dt className="text-xs uppercase tracking-wider text-slate-500">Rol</dt><dd className="mt-1 font-semibold">{result.profile.role}</dd></div>
            <div><dt className="text-xs uppercase tracking-wider text-slate-500">Identificación</dt><dd className="mt-1 font-semibold">{result.profile.institutionalId}</dd></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><dt className="text-xs uppercase tracking-wider text-slate-500">Institución</dt><dd className="mt-1 font-semibold">{result.profile.institutionName}</dd></div>
            {result.profile.validUntil ? <div><dt className="text-xs uppercase tracking-wider text-slate-500">Vigente hasta</dt><dd className="mt-1 font-semibold">{result.profile.validUntil}</dd></div> : null}
          </div>
        </dl>
      ) : null}
      {typeof result.signatureValid === 'boolean' ? (
        <p className="mt-4 border-t border-slate-900/10 pt-3 text-xs font-semibold uppercase tracking-wider">
          Firma criptográfica: {result.signatureValid ? 'válida' : 'inválida'}
        </p>
      ) : null}
    </section>
  );
}
