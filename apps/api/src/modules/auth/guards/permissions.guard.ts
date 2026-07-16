import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../../prisma/prisma.service';
import type { JwtPayload } from '@fables-flow/types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest() as { user: JwtPayload };
    if (!user) {
      return false;
    }

    // Since Prisma middleware injects organizationId implicitly based on AsyncLocalStorage,
    // we could just fetch permissions. But wait: PermissionsGuard runs BEFORE controller,
    // inside the request lifecycle. TenantMiddleware runs before Guards and sets TenantContext.
    // So this query is automatically tenant-isolated.
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId: user.roleId },
      select: { permissionKey: true },
    });

    const userPermissions = rolePermissions.map((rp) => rp.permissionKey);

    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }
}
