import { AsyncLocalStorage } from 'async_hooks';

export interface TenantStore {
  organizationId: string;
  userId?: string;
  roleId?: string;
}

/**
 * Global AsyncLocalStorage for tracking the current tenant context.
 * This is populated by the TenantMiddleware on each request.
 */
export const tenantStorage = new AsyncLocalStorage<TenantStore>();
