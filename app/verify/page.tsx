'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';

const QrScanner = dynamic(() => import('@/components/qr/qr-scanner').then((mod) => mod.QrScanner), { ssr: false });

export default function VerifyPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#f4f6fc] pb-28 shadow-2xl">
      <header className="bg-[#20398b] px-5 pb-8 pt-5 text-center text-white">
        <Image src="/brand/logo.png" alt="Logo de la UTN" width={52} height={52} className="mx-auto rounded-xl bg-white p-1" priority />
        <h1 className="mt-4 text-2xl font-bold">Verificar credencial</h1>
        <p className="mt-2 text-sm text-white/75">Escanea el QR para comprobar identidad, vigencia y acceso.</p>
      </header>
      <div className="p-5">
        <QrScanner />
      </div>
    </main>
  );
}
