'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Countdown } from '@/components/qr/countdown';
import { createMockShareToken } from '@/features/sharing/create-share-token';

export default function SharePage() {
  const token = createMockShareToken({ fields: ['ageProof'], ttlSeconds: 60 });

  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center gap-6 p-4 pb-24 text-center">
      <section className="space-y-2 pt-4">
        <h1 className="text-2xl font-bold">Compartir verificación de edad</h1>
        <p className="text-slate-600">QR de un solo uso con expiración temporal.</p>
      </section>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <QRCodeSVG value={token.payload} size={240} level="M" includeMargin />
      </div>
      <Countdown seconds={token.ttlSeconds} />
    </main>
  );
}
