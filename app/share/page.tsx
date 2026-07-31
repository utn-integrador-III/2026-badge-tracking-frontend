import { TimedQrCode } from '@/components/qr/timed-qr-code';

const QR_VISIBILITY_SECONDS = 60;

export default function SharePage() {
import Image from 'next/image';
import { ShareQr } from '@/components/qr/share-qr';
import { mockBadge } from '@/features/badges/mock-data';

const QR_LIFETIME_SECONDS = 60;

export default function SharePage() {
  const proof = {
    badgeId: mockBadge.id,
    fullName: mockBadge.holder.fullName,
    institutionalId: mockBadge.holder.institutionalId,
    institutionName: mockBadge.institution.name,
    role: mockBadge.role,
    status: mockBadge.status,
    validUntil: mockBadge.validUntil
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#f4f6fc] pb-28 shadow-2xl">
      <header className="bg-[#20398b] px-5 pb-8 pt-5 text-center text-white">
        <Image src="/brand/logo.png" alt="Logo de la UTN" width={52} height={52} className="mx-auto rounded-xl bg-white p-1" priority />
        <h1 className="mt-4 text-2xl font-bold">Compartir credencial</h1>
        <p className="mt-2 text-sm text-white/75">Genera una prueba temporal para una verificación segura.</p>
      </header>

      <section className="flex flex-col items-center gap-6 p-5 text-center">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Titular</p>
          <p className="mt-1 font-bold text-slate-900">{mockBadge.holder.fullName}</p>
          <p className="text-sm text-slate-600">{mockBadge.holder.institutionalId} · {mockBadge.role}</p>
        </div>
        <ShareQr proof={proof} ttlSeconds={QR_LIFETIME_SECONDS} />
        <p className="text-xs leading-5 text-slate-500">El código deja de ser válido automáticamente después de {QR_LIFETIME_SECONDS} segundos.</p>
      </section>
      <TimedQrCode fields={['ageProof']} visibilitySeconds={QR_VISIBILITY_SECONDS} />
    </main>
  );
}
