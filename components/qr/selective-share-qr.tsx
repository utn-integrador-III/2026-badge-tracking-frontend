'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ShareQr } from '@/components/qr/share-qr';
import type { BadgeShareProof } from '@/features/sharing/create-share-token';
import { createSelectiveProof, getIncludedFieldLabels, type ShareableField, shareableFieldOptions } from '@/features/sharing/selective-disclosure';

type SelectiveShareQrProps = Readonly<{
  proof: BadgeShareProof;
  ttlSeconds: number;
}>;

const defaultFields: ShareableField[] = ['fullName', 'institutionalId', 'institutionName', 'role', 'status', 'validUntil'];

export function SelectiveShareQr({ proof, ttlSeconds }: SelectiveShareQrProps) {
  const [selectedFields, setSelectedFields] = useState<ShareableField[]>(defaultFields);
  const selectiveProof = useMemo(() => createSelectiveProof(proof, selectedFields) as BadgeShareProof, [proof, selectedFields]);
  const includedLabels = useMemo(() => getIncludedFieldLabels(selectedFields), [selectedFields]);

  const toggleField = (field: ShareableField) => {
    setSelectedFields((current) => (current.includes(field) ? current.filter((item) => item !== field) : [...current, field]));
  };

  return (
    <div className="w-full space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-[#20398b]" aria-hidden />
          <h2 className="font-bold text-slate-950">Campos a compartir</h2>
        </div>
        <p className="mt-1 text-sm text-slate-600">Seleccione únicamente la información necesaria para la verificación.</p>

        <div className="mt-4 grid gap-2">
          {shareableFieldOptions.map((field) => (
            <label key={field.key} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
              <span>{field.label}</span>
              <input
                type="checkbox"
                checked={field.required || selectedFields.includes(field.key)}
                disabled={field.required}
                onChange={() => toggleField(field.key)}
                className="h-4 w-4 accent-[#20398b]"
              />
            </label>
          ))}
        </div>
      </section>

      <ShareQr proof={selectiveProof} ttlSeconds={ttlSeconds} includedFields={includedLabels} />
    </div>
  );
}
