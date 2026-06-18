import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import type { DigitalBadge } from '@/types/badge';

const roleLabels: Record<DigitalBadge['role'], string> = {
  Student: 'Estudiante',
  Professor: 'Profesor',
  Staff: 'Personal'
};

export function BadgeCard({ badge }: Readonly<{ badge: DigitalBadge }>) {
  return (
    <article className="rounded-3xl bg-gradient-to-br from-[#2949aa] to-[#142b75] p-5 text-white shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/65">República de Costa Rica</p>
          <p className="mt-1 font-bold">{badge.institution.name}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-xs font-black text-[#20398b]">UTN</div>
      </div>

      <div className="mt-7 flex items-center gap-3">
        <Image
          src={badge.holder.photoUrl}
          width={64}
          height={64}
          alt={`Foto de ${badge.holder.fullName}`}
          className="h-16 w-16 shrink-0 rounded-2xl border-2 border-white/50 object-cover"
          priority
        />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider text-white/60">{roleLabels[badge.role]}</p>
          <h2 className="font-bold leading-5">{badge.holder.fullName}</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-white/60">Carné</p>
          <p className="font-mono text-sm font-bold">{badge.holder.institutionalId}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-[#132968]/60 px-3 py-2 text-xs">
        <span className="truncate">{badge.holder.department}</span>
        <span className="flex shrink-0 items-center gap-1 text-white/75">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Verificado
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-xs">
        <div>
          <dt className="uppercase tracking-wider text-white/55">Emisión</dt>
          <dd className="mt-1 font-semibold">{badge.issuedAt}</dd>
        </div>
        <div className="text-right">
          <dt className="uppercase tracking-wider text-white/55">Válido hasta</dt>
          <dd className="mt-1 font-semibold">{badge.validUntil}</dd>
        </div>
      </dl>

      <Link className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#20398b]" href="/badge">
        Ver información completa
      </Link>
    </article>
  );
}
