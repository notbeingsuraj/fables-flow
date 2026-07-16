import { Injectable, type OnModuleInit, type OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@fables-flow/database';
import { tenantStorage } from '../core/context/tenant.context';

// Inline minimal type for Prisma middleware params to avoid importing from the internal runtime path
interface PrismaMiddlewareParams {
  model?: string;
  action: string;
  args: {
    where?: Record<string, unknown>;
    data?: Record<string, unknown> | Record<string, unknown>[];
  };
  dataPath: string[];
  runInTransaction: boolean;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
    // Using Prisma Client legacy middleware ($use) for tenant isolation.
    // $extends() returns a new object which breaks NestJS DI; $use mutates the client in place.

    // @ts-expect-error Prisma $use exists at runtime but is absent from some generated typings
    this.$use(
      async (
        params: PrismaMiddlewareParams,
        next: (p: PrismaMiddlewareParams) => Promise<unknown>,
      ) => {
        const store = tenantStorage.getStore();
        const tenantId = store?.organizationId;

        // Models that must be scoped to the current tenant
        const tenantEntities = [
          'OrganizationSetting',
          'User',
          'Role',
          'RolePermission',
          'AuditLog',
        ];

        if (tenantId && params.model && tenantEntities.includes(params.model)) {
          const args = params.args;

          // ── READ OPS ──────────────────────────────────────────────────────────────
          if (
            params.action === 'findUnique' ||
            params.action === 'findFirst' ||
            params.action === 'findMany' ||
            params.action === 'count'
          ) {
            // Downgrade findUnique → findFirst because we're adding organizationId
            // which breaks uniqueness identifiers in the where clause
            if (params.action === 'findUnique') params.action = 'findFirst';

            args.where = {
              ...args.where,
              organizationId: args.where?.['organizationId'] ?? tenantId,
            };
          }

          // ── WRITE OPS ─────────────────────────────────────────────────────────────
          if (
            params.action === 'update' ||
            params.action === 'updateMany' ||
            params.action === 'delete' ||
            params.action === 'deleteMany'
          ) {
            if (params.action === 'update') params.action = 'updateMany';
            if (params.action === 'delete') params.action = 'deleteMany';

            args.where = {
              ...args.where,
              organizationId: args.where?.['organizationId'] ?? tenantId,
            };
          }

          // ── CREATE OPS ────────────────────────────────────────────────────────────
          if (params.action === 'create') {
            const data = args.data as Record<string, unknown>;
            if (data && data['organizationId'] === undefined) {
              data['organizationId'] = tenantId;
            }
          }

          if (params.action === 'createMany') {
            if (Array.isArray(args.data)) {
              args.data = (args.data as Record<string, unknown>[]).map((item) => ({
                ...item,
                organizationId: item['organizationId'] ?? tenantId,
              }));
            }
          }
        }

        return next(params);
      },
    );
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from database');
  }
}
