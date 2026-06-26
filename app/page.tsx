import Link from 'next/link';
import { BadgeCard } from '@/components/badge/badge-card';
import { mockBadge } from '@/features/badges/mock-data';

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 p-4 pb-24">
      <section className="space-y-2 pt-4">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-700">Credencial institucional</p>
        <h1 className="text-3xl font-bold text-slate-950">Digital Badge PWA</h1>
        <p className="text-slate-600">Plantilla mobile-first para visualizar, compartir y verificar credenciales.</p>
      </section>

      <BadgeCard badge={mockBadge} />

      <nav className="grid gap-3">
        <Link className="rounded-xl bg-brand-500 px-4 py-3 text-center font-semibold text-white" href="/share">
          Compartir por QR
        </Link>
        <Link className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center font-semibold" href="/verify">
          Verificar credencial
        </Link>
        <Link className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center font-semibold" href="/admin">
          Portal admin
        </Link>
      </nav>
    </main>
  );
}
