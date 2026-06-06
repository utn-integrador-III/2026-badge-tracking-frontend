'use client';

import dynamic from 'next/dynamic';

const QrScanner = dynamic(() => import('@/components/qr/qr-scanner').then((mod) => mod.QrScanner), { ssr: false });

export default function VerifyPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-4 pb-24">
      <h1 className="text-2xl font-bold">Verificar credencial</h1>
      <p className="text-slate-600">Escanea el QR y valida la firma con llaves públicas cacheadas.</p>
      <QrScanner />
    </main>
  );
}
