import { Injectable } from '@nestjs/common';
import { Prisma } from '@fables-flow/database';
import { PrismaService } from '../../prisma/prisma.service';
import { tenantStorage } from '../../core/context/tenant.context';
import type { PaginationQuery } from '@fables-flow/validation';

export interface CreateAuditLogParams {
  entityName: string;
  entityId: string;
  action: string;
  oldValues?: Prisma.InputJsonValue;
  newValues?: Prisma.InputJsonValue;
  changedFields?: string[];
  reason?: string;
  ipAddress?: string;
}

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Called internally by other services to log mutations.
   * Can also be wired into Prisma middleware for true automatic logging.
   */
  async log(params: CreateAuditLogParams): Promise<unknown> {
    const store = tenantStorage.getStore();
    const organizationId = store?.organizationId;
    const actorId = store?.userId;

    if (!organizationId) {
      // Cannot log audit trail without tenant context — silently skip rather than crash
      return null;
    }

    return this.prisma.auditLog.create({
      data: {
        organizationId,
        actorId,
        entityName: params.entityName,
        entityId: params.entityId,
        action: params.action,
        oldValues: params.oldValues,
        newValues: params.newValues,
        changedFields: params.changedFields,
        reason: params.reason,
        ipAddress: params.ipAddress,
      },
    });
  }

  /**
   * Fetch audit logs for the current tenant (tenant isolation applied automatically by Prisma middleware)
   */
  async findAll(query: PaginationQuery): Promise<unknown> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count(),
    ]);

    return {
      data,
      meta: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}
