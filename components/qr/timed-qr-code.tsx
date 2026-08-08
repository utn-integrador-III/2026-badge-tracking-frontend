'use client';

import { useCallback, useEffect, useState } from 'react';
import { QrCode, RefreshCw, TimerOff } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { createMockShareToken, type ShareToken } from '../../features/sharing/create-share-token';
import { Countdown } from './countdown';

type TimedQrCodeProps = Readonly<{
  fields: string[];
  visibilitySeconds: number;
}>;

export function TimedQrCode({ fields, visibilitySeconds }: TimedQrCodeProps) {
  const [token, setToken] = useState<ShareToken | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const generateToken = useCallback(() => {
    setToken(createMockShareToken({ fields, ttlSeconds: visibilitySeconds }));
    setIsExpired(false);
  }, [fields, visibilitySeconds]);
  const handleExpire = useCallback(() => setIsExpired(true), []);

  useEffect(() => {
    generateToken();
  }, [generateToken]);

  if (!token) {
    return (
      <div
        aria-busy="true"
        className="flex aspect-square w-full max-w-72 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500"
      >
        <QrCode className="h-10 w-10" aria-hidden />
        <span className="sr-only">Generando código QR</span>
      </div>
    );
  }

  if (isExpired) {
    return (
      <section className="flex w-full flex-col items-center gap-5" aria-live="polite">
        <div className="flex aspect-square w-full max-w-72 flex-col items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white p-6 text-slate-700">
          <TimerOff className="h-12 w-12" aria-hidden />
          <p className="text-lg font-semibold">Código QR expirado</p>
          <p className="text-sm text-slate-500">El código ya no está disponible para escanear.</p>
        </div>
        <button
          type="button"
          onClick={generateToken}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          <RefreshCw className="h-5 w-5" aria-hidden />
          Generar nuevo QR
        </button>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col items-center gap-5">
      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <QRCodeSVG
          value={token.payload}
          size={240}
          level="M"
          includeMargin
          title="Código QR temporal para compartir la verificación"
        />
      </div>
      <Countdown expiresAt={token.expiresAt} onExpire={handleExpire} />
    </section>
  );
}
