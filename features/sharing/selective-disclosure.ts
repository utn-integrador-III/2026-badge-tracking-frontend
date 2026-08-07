import type { BadgeShareProof } from './create-share-token';

export type ShareableField = keyof BadgeShareProof;

export type ShareableFieldOption = {
  key: ShareableField;
  label: string;
  required?: boolean;
};

export const shareableFieldOptions: ShareableFieldOption[] = [
  { key: 'badgeId', label: 'ID de credencial', required: true },
  { key: 'fullName', label: 'Nombre completo' },
  { key: 'institutionalId', label: 'Identificación institucional' },
  { key: 'institutionName', label: 'Institución' },
  { key: 'role', label: 'Rol' },
  { key: 'status', label: 'Estado' },
  { key: 'validUntil', label: 'Vigencia' }
];

export function createSelectiveProof(proof: BadgeShareProof, selectedFields: ShareableField[]): Partial<BadgeShareProof> {
  const requiredFields = shareableFieldOptions.filter((field) => field.required).map((field) => field.key);
  const selected = new Set<ShareableField>([...requiredFields, ...selectedFields]);

  return Object.fromEntries(Object.entries(proof).filter(([key]) => selected.has(key as ShareableField))) as Partial<BadgeShareProof>;
}

export function getIncludedFieldLabels(selectedFields: ShareableField[]) {
  const selected = new Set<ShareableField>(selectedFields);
  return shareableFieldOptions.filter((field) => field.required || selected.has(field.key)).map((field) => field.label);
}
