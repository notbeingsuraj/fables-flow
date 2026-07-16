import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { UpdateOrgSettingsInput } from '@fables-flow/validation';
import { tenantStorage } from '../../core/context/tenant.context';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMyOrganization(): Promise<unknown> {
    // Organization is the tenant root — we query by ID from tenant context explicitly
    // rather than relying on Prisma middleware (which isolates *within* a tenant)
    const store = tenantStorage.getStore();
    const id = store?.organizationId;

    if (!id) throw new NotFoundException('Organization context not found');

    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: { settings: true },
    });

    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async updateSettings(input: UpdateOrgSettingsInput): Promise<unknown> {
    const store = tenantStorage.getStore();
    const id = store?.organizationId;

    if (!id) throw new NotFoundException('Organization context not found');

    return this.prisma.organizationSetting.upsert({
      where: { organizationId: id },
      create: { settings: input.settings, organizationId: id },
      update: { settings: input.settings },
    });
  }
}
