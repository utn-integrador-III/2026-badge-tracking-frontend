import { describe, expect, it } from 'vitest';
import { badgeSchema } from './badge-schema';

describe('badgeSchema', () => {
  it('accepts a valid badge identity and status', () => {
    const result = badgeSchema.safeParse({
      id: 'badge_demo_001',
      role: 'Student',
      status: 'active'
    });

    expect(result.success).toBe(true);
  });

  it('rejects an empty id', () => {
    const result = badgeSchema.safeParse({
      id: '',
      role: 'Professor',
      status: 'active'
    });

    expect(result.success).toBe(false);
  });

  it('rejects unsupported roles and statuses', () => {
    const invalidRole = badgeSchema.safeParse({
      id: 'badge_demo_001',
      role: 'Guest',
      status: 'active'
    });
    const invalidStatus = badgeSchema.safeParse({
      id: 'badge_demo_001',
      role: 'Staff',
      status: 'pending'
    });

    expect(invalidRole.success).toBe(false);
    expect(invalidStatus.success).toBe(false);
  });
});
