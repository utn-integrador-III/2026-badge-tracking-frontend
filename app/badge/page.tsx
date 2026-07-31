import { BadgeDetails } from '@/components/badge/badge-details';
import { BadgeCard } from '@/components/badge/badge-card';
import { mockBadge, mockBadgeTypes } from '@/features/badges/mock-data';

export default function BadgePage() {
  return (
    <main className="mx-auto w-full max-w-md space-y-5 p-4 pb-24">
      <BadgeDetails badge={mockBadge} />
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Tipos de badge soportados</h2>
        <p className="mt-1 text-sm text-slate-600">Vista previa para estudiante, profesor y personal administrativo.</p>
        <div className="mt-4 space-y-4">
          {mockBadgeTypes.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </section>
    </main>
  );
}
