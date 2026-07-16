import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateRoleInput, UpdateRoleInput, PaginationQuery } from '@fables-flow/validation';
import { tenantStorage } from '../../core/context/tenant.context';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQuery) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      this.prisma.role.findMany({
        skip,
        take: limit,
        include: { permissions: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.role.count(),
    ]);

    return {
      data: data.map((role) => ({
        ...role,
        permissions: role.permissions.map((p) => p.permissionKey),
      })),
      meta: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return {
      ...role,
      permissions: role.permissions.map((p) => p.permissionKey),
    };
  }

  async create(input: CreateRoleInput) {
    // tenantStorage always has the organizationId once the TenantMiddleware has run.
    // We read it explicitly here because Prisma middleware injects it only on read ops;
    // for `create` we must supply it in data to satisfy the schema constraint.
    const store = tenantStorage.getStore();
    const organizationId = store?.organizationId ?? '';

    try {
      const role = await this.prisma.role.create({
        data: {
          name: input.name,
          description: input.description,
          organizationId,
          permissions: {
            create: input.permissions.map((p) => ({ permissionKey: p })),
          },
        },
        include: { permissions: true },
      });
      return role;
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === 'P2002') {
        throw new BadRequestException('A role with this name already exists in this organization');
      }
      throw e;
    }
  }

  async update(id: string, input: UpdateRoleInput) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    if (role.isSystem) throw new BadRequestException('System roles cannot be modified');

    const updateData: {
      name?: string;
      description?: string | null;
      permissions?: { deleteMany: Record<string, never>; create: { permissionKey: string }[] };
    } = {};

    if (input.name) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;

    if (input.permissions) {
      updateData.permissions = {
        deleteMany: {},
        create: input.permissions.map((p) => ({ permissionKey: p })),
      };
    }

    try {
      return await this.prisma.role.update({
        where: { id },
        data: updateData,
        include: { permissions: true },
      });
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === 'P2002') {
        throw new BadRequestException('A role with this name already exists in this organization');
      }
      throw e;
    }
  }

  async remove(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    if (role.isSystem) throw new BadRequestException('System roles cannot be deleted');

    const userCount = await this.prisma.user.count({ where: { roleId: id } });
    if (userCount > 0) {
      throw new BadRequestException('Cannot delete a role that is assigned to users');
    }

    await this.prisma.role.delete({ where: { id } });
    return { success: true };
  }
}
