import Image from 'next/image';
import { Palette } from 'lucide-react';
import { getBadgeBranding } from '@/features/branding/institution-branding';
import type { DigitalBadge } from '@/types/badge';

export function InstitutionBrandingPreview({ badge }: Readonly<{ badge: DigitalBadge }>) {
  const branding = getBadgeBranding(badge);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#20398b]">
          <Palette className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-bold text-slate-950">Marca institucional</h2>
          <p className="text-sm text-slate-600">Logo y colores aplicados al carnet digital.</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
        <Image src={branding.logoUrl} alt="Logo institucional" width={44} height={44} className="rounded-xl bg-white p-1" />
        <div>
          <p className="font-semibold text-slate-950">{badge.institution.name}</p>
          <p className="text-xs text-slate-500">
            {branding.primaryColor} / {branding.secondaryColor}
          </p>
        </div>
      </div>
    </section>
  );
}
