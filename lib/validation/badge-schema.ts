import { z } from 'zod';

export const badgeSchema = z.object({
  id: z.string().min(1),
  role: z.enum(['Student', 'Professor', 'Staff']),
  status: z.enum(['active', 'suspended', 'revoked', 'expired'])
});
