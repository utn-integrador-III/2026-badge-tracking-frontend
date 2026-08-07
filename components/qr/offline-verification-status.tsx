import { WifiOff } from 'lucide-react';
import { isOfflineBundleFresh, type OfflineVerificationBundle } from '@/features/verification/offline-verification';

const demoBundle: OfflineVerificationBundle = {
  generatedAt: new Date().toISOString(),
  trustedBadgeIds: ['badge_demo_001']
};

export function OfflineVerificationStatus() {
  const fresh = isOfflineBundleFresh(demoBundle, 24);

  return (
    <section className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
      <div className="flex items-center gap-2 font-bold">
        <WifiOff className="h-4 w-4" aria-hidden />
        Verificacion offline
      </div>
      <p className="mt-2">
        {fresh
          ? 'Paquete offline disponible para validar credenciales aun sin conexion.'
          : 'El paquete offline debe actualizarse antes de validar credenciales.'}
      </p>
    </section>
  );
}
