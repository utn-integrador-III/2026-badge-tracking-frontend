import type { DigitalBadge } from '@/types/badge';

export function BadgeDetails({ badge }: Readonly<{ badge: DigitalBadge }>) {
  const rows = [
    ['Nombre completo', badge.holder.fullName],
    ['Rol', badge.role],
    ['Departamento', badge.holder.department],
    ['ID institucional', badge.holder.institutionalId],
    ['Emisión', badge.issuedAt],
    ['Vigencia', badge.validUntil],
    ['Autoridad emisora', badge.issuer],
    ['Firma digital', badge.signaturePreview],
    ['Protección criptográfica', 'ECDSA P-256 / SHA-256']
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
    </section>
  );
}
