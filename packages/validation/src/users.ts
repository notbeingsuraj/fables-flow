import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  roleId: z.string().uuid('Invalid role ID'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  roleId: z.string().uuid().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
