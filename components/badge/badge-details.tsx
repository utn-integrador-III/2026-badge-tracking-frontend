import type { DigitalBadge } from '@/types/badge';
import { getExtendedIdentityInfo } from '@/features/badges/identity-info';

export function BadgeDetails({ badge }: Readonly<{ badge: DigitalBadge }>) {
  const extendedRows = getExtendedIdentityInfo(badge);
  const rows = [
    ['Nombre completo', badge.holder.fullName],
    ['Rol', badge.role],
    ['Departamento', badge.holder.department],
    ['ID institucional', badge.holder.institutionalId],
    ['Emisión', badge.issuedAt],
    ['Vigencia', badge.validUntil],
    ['Autoridad emisora', badge.issuer],
    ['Firma digital', badge.signaturePreview]
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-bold">Detalle de credencial</h1>
      <dl className="mt-5 divide-y divide-slate-100">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-3 gap-3 py-3 text-sm">
            <dt className="col-span-1 text-slate-500">{label}</dt>
            <dd className="col-span-2 font-medium text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>

      {extendedRows.length > 0 ? (
        <section className="mt-6 rounded-2xl bg-slate-50 p-4">
          <h2 className="font-bold text-slate-950">Información extendida de identidad</h2>
          <dl className="mt-3 divide-y divide-slate-200">
            {extendedRows.map((row) => (
              <div key={row.label} className="grid grid-cols-3 gap-3 py-2 text-sm">
                <dt className="col-span-1 text-slate-500">{row.label}</dt>
                <dd className="col-span-2 font-medium text-slate-900">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </section>
  );
}
