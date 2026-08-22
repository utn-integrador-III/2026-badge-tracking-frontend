'use client';

import { LoaderCircle, RefreshCw } from 'lucide-react';
import { BadgeDetails } from '@/components/badge/badge-details';
import { BadgeCard } from '@/components/badge/badge-card';
import { useBadgeProfile } from '@/features/badges/use-badge-profile';

export default function BadgePage() {
  const { badge, loading, error, reload } = useBadgeProfile(true);

  if (loading) {
    return <main className="grid min-h-[70dvh] place-items-center"><LoaderCircle className="h-9 w-9 animate-spin text-[#20398b]" /></main>;
  }

  if (error || !badge) {
    return (
      <main className="mx-auto w-full max-w-md p-5">
        <section className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-800">
          <h1 className="font-bold">No fue posible cargar el detalle</h1><p className="mt-2 text-sm">{error}</p>
          <button type="button" onClick={() => void reload()} className="mt-4 flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 font-semibold text-white"><RefreshCw className="h-4 w-4" /> Reintentar</button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md space-y-5 p-4 pb-24">
      <BadgeCard badge={badge} />
      <BadgeDetails badge={badge} />
    </main>
  );
}
