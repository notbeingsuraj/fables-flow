import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateUserInput, UpdateUserInput, PaginationQuery } from '@fables-flow/validation';
import { tenantStorage } from '../../core/context/tenant.context';
import * as argon2 from 'argon2';
import crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQuery) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          roleId: true,
          isEmailVerified: true,
          lockedAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { deletedAt: null } }),
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

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roleId: true,
        isEmailVerified: true,
        lockedAt: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(input: CreateUserInput) {
    // Generate random initial password — user must complete setup via email link
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const passwordHash = await argon2.hash(tempPassword);

    // Read tenant context for the mandatory organizationId FK
    const store = tenantStorage.getStore();
    const organizationId = store?.organizationId ?? '';

    try {
      const user = await this.prisma.user.create({
        data: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          roleId: input.roleId,
          passwordHash,
          organizationId,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          roleId: true,
          createdAt: true,
        },
      });
      return user;
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === 'P2002')
        throw new BadRequestException('Email already exists in this organization');
      throw e;
    }
  }

  async update(id: string, input: UpdateUserInput) {
    const user = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');

    const updateData: {
      firstName?: string;
      lastName?: string;
      roleId?: string;
    } = {};

    if (input.firstName) updateData.firstName = input.firstName;
    if (input.lastName) updateData.lastName = input.lastName;
    if (input.roleId) updateData.roleId = input.roleId;

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        roleId: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true };
  }
}
