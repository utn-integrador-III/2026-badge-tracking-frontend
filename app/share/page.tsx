import { TimedQrCode } from '@/components/qr/timed-qr-code';

const QR_VISIBILITY_SECONDS = 60;

export default function SharePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center gap-6 p-4 pb-24 text-center">
      <section className="space-y-2 pt-4">
        <h1 className="text-2xl font-bold">Compartir verificación de edad</h1>
        <p className="text-slate-600">QR de un solo uso con expiración temporal.</p>
      </section>
      <TimedQrCode fields={['ageProof']} visibilitySeconds={QR_VISIBILITY_SECONDS} />
    </main>
  );
}
