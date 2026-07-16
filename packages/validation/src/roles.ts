import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
