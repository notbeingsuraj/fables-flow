import { z } from 'zod';

export const updateOrgSettingsSchema = z.object({
  settings: z.record(z.any()), // Can be refined later based on actual settings schema
});

export type UpdateOrgSettingsInput = z.infer<typeof updateOrgSettingsSchema>;
