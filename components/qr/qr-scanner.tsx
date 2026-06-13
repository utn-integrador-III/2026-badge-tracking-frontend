'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export function QrScanner() {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 240, height: 240 } }, false);
    scannerRef.current = scanner;
    scanner.render(
      (decodedText) => setResult(decodedText),
      () => undefined
    );

    return () => {
      scannerRef.current?.clear().catch(() => undefined);
    };
  }, []);

  return (
    <section className="space-y-4">
      <div id="qr-reader" className="overflow-hidden rounded-2xl border border-slate-200 bg-white" />
      {result ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          QR leído. Pendiente: enviar a módulo de validación criptográfica.
          <pre className="mt-2 overflow-auto text-xs">{result}</pre>
        </div>
      ) : null}
    </section>
  );
}
