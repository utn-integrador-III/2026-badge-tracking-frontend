export type AuditEventType = 'issued' | 'verified' | 'shared' | 'revoked' | 'suspended';

export type AuditEvent = {
  actor: string;
  badgeId: string;
  createdAt: string;
  details: string;
  id: string;
  type: AuditEventType;
};

export const auditEvents: AuditEvent[] = [
  {
    actor: 'Registro Universitario',
    badgeId: 'badge_demo_001',
    createdAt: '2026-08-07T09:15:00Z',
    details: 'Badge issued to Juan Carlos Rodriguez Vargas.',
    id: 'audit_001',
    type: 'issued'
  },
  {
    actor: 'Badge holder',
    badgeId: 'badge_demo_001',
    createdAt: '2026-08-07T10:20:00Z',
    details: 'Time-limited QR proof generated.',
    id: 'audit_002',
    type: 'shared'
  },
  {
    actor: 'Security checkpoint',
    badgeId: 'badge_demo_001',
    createdAt: '2026-08-07T10:21:00Z',
    details: 'QR verification granted.',
    id: 'audit_003',
    type: 'verified'
  }
];

export function getAuditEventsForBadge(events: AuditEvent[], badgeId: string) {
  return events
    .filter((event) => event.badgeId === badgeId)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

export function summarizeAuditEvents(events: AuditEvent[]) {
  return events.reduce<Record<AuditEventType, number>>(
    (summary, event) => ({ ...summary, [event.type]: summary[event.type] + 1 }),
    { issued: 0, verified: 0, shared: 0, revoked: 0, suspended: 0 }
  );
}
