import { z } from 'zod';

/**
 * Pagination query parameters schema.
 * Used by all list endpoints.
 * @see docs/05-api/standards.md
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  sort: z.string().optional(),
  q: z.string().optional(),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export * from './auth';
export * from './users';
export * from './roles';
export * from './orgs';
