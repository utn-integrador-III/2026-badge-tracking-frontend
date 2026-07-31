'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, FlaskConical, RotateCcw, ScanLine } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { VerificationResult } from '@/components/qr/verification-result';
import { verifyQrToken, type QrVerificationResult } from '@/features/verification/verify-qr-token';

function createDemoToken() {
  return JSON.stringify({
    type: 'digital-badge-share-token',
    version: 1,
    nonce: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    proof: {
      badgeId: 'badge_demo_001',
      fullName: 'Juan Carlos Rodríguez Vargas',
      institutionalId: '2024-0001',
      institutionName: 'Universidad Técnica Nacional',
      role: 'Student',
      status: 'active',
      validUntil: '2026-12-31'
    }
  });
}

export function QrScanner() {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [manualToken, setManualToken] = useState('');
  const [result, setResult] = useState<QrVerificationResult | null>(null);

  const verify = useCallback((decodedText: string) => {
    setResult(verifyQrToken(decodedText));
  }, []);

  useEffect(() => {
    if (result) return;

    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 240, height: 240 } }, false);
    scannerRef.current = scanner;
    scanner.render(verify, () => undefined);

    return () => {
      scanner.clear().catch(() => undefined);
      scannerRef.current = null;
    };
  }, [result, verify]);

  const reset = () => {
    setResult(null);
    setManualToken('');
  };

  if (result) {
    return (
      <div className="space-y-4">
        <VerificationResult result={result} />
        <button type="button" onClick={reset} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#20398b] px-5 py-3 font-semibold text-white">
          <RotateCcw className="h-4 w-4" aria-hidden /> Escanear otro código
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="mb-3 flex items-center gap-2 px-2 text-sm font-semibold text-slate-700"><Camera className="h-4 w-4" aria-hidden /> Cámara o imagen</p>
        <div id="qr-reader" className="overflow-hidden rounded-2xl" />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="qr-token" className="text-sm font-semibold text-slate-800">Código leído manualmente</label>
        <textarea
          id="qr-token"
          value={manualToken}
          onChange={(event) => setManualToken(event.target.value)}
          rows={3}
          placeholder="Pegue aquí el contenido del QR"
          className="mt-2 w-full resize-none rounded-xl border border-slate-300 p-3 text-xs text-slate-700"
        />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setManualToken(createDemoToken())} className="flex items-center justify-center gap-2 rounded-xl border border-[#20398b] px-3 py-2 text-sm font-semibold text-[#20398b]">
            <FlaskConical className="h-4 w-4" aria-hidden /> Cargar demo
          </button>
          <button type="button" disabled={!manualToken.trim()} onClick={() => verify(manualToken)} className="flex items-center justify-center gap-2 rounded-xl bg-[#20398b] px-3 py-2 text-sm font-semibold text-white disabled:opacity-40">
            <ScanLine className="h-4 w-4" aria-hidden /> Verificar código
          </button>
        </div>
      </div>
    </section>
  );
}
