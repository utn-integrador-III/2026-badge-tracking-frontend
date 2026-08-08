import { describe, expect, it } from 'vitest';
import { auditEvents, getAuditEventsForBadge, summarizeAuditEvents } from './audit-history';

describe('audit history', () => {
  it('returns badge events ordered from newest to oldest', () => {
    const events = getAuditEventsForBadge(auditEvents, 'badge_demo_001');

    expect(events.map((event) => event.id)).toEqual(['audit_003', 'audit_002', 'audit_001']);
  });

  it('summarizes event types for dashboard usage', () => {
    expect(summarizeAuditEvents(auditEvents)).toMatchObject({ issued: 1, shared: 1, verified: 1 });
  });
});
