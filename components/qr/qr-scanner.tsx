'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, LoaderCircle, RotateCcw, ScanLine } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { VerificationResult } from '@/components/qr/verification-result';
import { apiVerificationToResult } from '@/features/verification/api-mapper';
import type { QrVerificationResult } from '@/features/verification/verify-qr-token';
import { verificationApi } from '@/lib/api/verification';

export function QrScanner() {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [manualToken, setManualToken] = useState('');
  const [result, setResult] = useState<QrVerificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const verify = useCallback(async (decodedText: string) => {
    if (!decodedText.trim()) return;
    setLoading(true);
    try {
      const response = await verificationApi.verifyBadge(decodedText.trim());
      setResult(apiVerificationToResult(response));
    } catch (caught) {
      setResult({
        outcome: 'denied',
        message: caught instanceof Error ? caught.message : 'No fue posible verificar el código.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (result || loading) return;
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 240, height: 240 } }, false);
    scannerRef.current = scanner;
    scanner.render((decodedText) => void verify(decodedText), () => undefined);
    return () => {
      scanner.clear().catch(() => undefined);
      scannerRef.current = null;
    };
  }, [loading, result, verify]);

  const reset = () => {
    setResult(null);
    setManualToken('');
  };

  if (result) {
    return (
      <div className="space-y-4">
        <VerificationResult result={result} />
        <button type="button" onClick={reset} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#20398b] px-5 py-3 font-semibold text-white">
          <RotateCcw className="h-4 w-4" /> Escanear otro código
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="mb-3 flex items-center gap-2 px-2 text-sm font-semibold text-slate-700"><Camera className="h-4 w-4" /> Cámara o imagen</p>
        <div id="qr-reader" className="overflow-hidden rounded-2xl" />
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="qr-token" className="text-sm font-semibold text-slate-800">Código leído manualmente</label>
        <textarea id="qr-token" value={manualToken} onChange={(event) => setManualToken(event.target.value)} rows={3} placeholder="Pegue aquí la URL o el token del QR" className="mt-2 w-full resize-none rounded-xl border border-slate-300 p-3 text-xs text-slate-700" />
        <button type="button" disabled={!manualToken.trim() || loading} onClick={() => void verify(manualToken)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#20398b] px-3 py-2 text-sm font-semibold text-white disabled:opacity-40">
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />} {loading ? 'Verificando…' : 'Verificar código'}
        </button>
      </div>
    </section>
  );
}
