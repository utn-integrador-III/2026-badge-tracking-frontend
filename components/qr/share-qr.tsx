'use client';

import { useCallback, useEffect, useState } from 'react';
import { Clock3, LoaderCircle, QrCode, RefreshCw, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { identityApi } from '@/lib/api/identity';
import type { BadgeVerificationQrResponse, DisclosableAttribute } from '@/lib/api/types';

type ShareQrProps = Readonly<{
  disclosedAttributes: DisclosableAttribute[];
  includedFields?: string[];
  institutionalId: string;
  pin: string;
  ttlSeconds: number;
}>;

function remainingSeconds(expiresAt: string) {
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

export function ShareQr({ disclosedAttributes, includedFields, institutionalId, pin, ttlSeconds }: ShareQrProps) {
  const [token, setToken] = useState<BadgeVerificationQrResponse | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateToken = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const nextToken = await identityApi.generateVerificationQr(institutionalId, {
        pin,
        disclose: disclosedAttributes,
        expiresInSeconds: ttlSeconds
      });
      setToken(nextToken);
      setRemaining(nextToken.remainingSeconds);
    } catch (caught) {
      setToken(null);
      setRemaining(0);
      setError(caught instanceof Error ? caught.message : 'No fue posible generar el código QR.');
    } finally {
      setLoading(false);
    }
  }, [disclosedAttributes, institutionalId, pin, ttlSeconds]);

  useEffect(() => {
    if (!token) return;

    const updateCountdown = () => setRemaining(remainingSeconds(token.expiresAt));
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 250);
    return () => window.clearInterval(timer);
  }, [token]);

  if (!token) {
    return (
      <div className="w-full">
        <button
          type="button"
          disabled={loading}
          onClick={() => void generateToken()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#20398b] px-5 py-4 font-semibold text-white shadow-lg transition hover:bg-[#172e78] disabled:opacity-60"
        >
          {loading ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <QrCode className="h-5 w-5" aria-hidden />}
          {loading ? 'Generando QR…' : 'Generar QR temporal'}
        </button>
        {error ? <p className="mt-3 text-center text-sm font-medium text-red-700" role="alert">{error}</p> : null}
      </div>
    );
  }

  const expired = remaining === 0;

  return (
    <section className="flex w-full flex-col items-center gap-5" aria-label="Codigo QR temporal">
      <div className="relative rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
        <QRCodeSVG value={token.token} size={232} level="M" includeMargin aria-label="QR de verificacion" />
        {expired ? (
          <div className="absolute inset-0 grid place-items-center rounded-3xl bg-white/95 p-6">
            <div className="text-center">
              <Clock3 className="mx-auto h-10 w-10 text-amber-600" aria-hidden />
              <p className="mt-3 font-bold text-slate-900">Este QR expiro</p>
              <p className="mt-1 text-sm text-slate-600">Genera uno nuevo para compartir tu credencial.</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2 rounded-full bg-[#e8edf7] px-4 py-2 text-sm font-semibold text-[#20398b]" role="timer" aria-live="polite">
        <Clock3 className="h-4 w-4" aria-hidden />
        Expira en {remaining} s
      </div>

      <div className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left text-sm text-emerald-900">
        <p className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="h-4 w-4" aria-hidden /> Informacion incluida
        </p>
        <p className="mt-2">{includedFields?.join(', ') ?? 'Nombre, rol, numero de identificacion, institucion, estado y vigencia.'}</p>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={() => void generateToken()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#20398b] bg-white px-5 py-3 font-semibold text-[#20398b] transition hover:bg-[#eef2ff] disabled:opacity-60"
      >
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
        {loading ? 'Generando QR…' : expired ? 'Generar nuevo QR' : 'Renovar QR'}
      </button>
    </section>
  );
}
