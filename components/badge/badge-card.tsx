import Link from 'next/link';
import type { DigitalBadge } from '@/types/badge';

export function BadgeCard({ badge }: Readonly<{ badge: DigitalBadge }>) {
  return (
    <article className="rounded-badge bg-gradient-to-br from-brand-700 to-brand-950 p-5 text-white shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wider text-blue-100">{badge.institution.name}</p>
          <h2 className="mt-4 text-2xl font-bold">{badge.holder.fullName}</h2>
          <p className="text-blue-100">{badge.role}</p>
        </div>
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20 text-xl font-bold">{badge.holder.initials}</div>
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-blue-100">ID</dt>
          <dd className="font-semibold">{badge.holder.institutionalId}</dd>
        </div>
        <div>
          <dt className="text-blue-100">Vigencia</dt>
          <dd className="font-semibold">{badge.validUntil}</dd>
        </div>
      </dl>
      <Link className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-brand-700" href="/badge">
        Ver detalles
      </Link>
    </article>
  );
}
