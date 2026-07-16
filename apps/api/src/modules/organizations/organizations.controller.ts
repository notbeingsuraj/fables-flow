import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { updateOrgSettingsSchema } from '@fables-flow/validation';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current organization details' })
  async findMyOrganization(): Promise<unknown> {
    return this.orgsService.findMyOrganization();
  }

  @Patch('me/settings')
  @RequirePermissions('settings.edit')
  @ApiOperation({ summary: 'Update organization settings' })
  async updateSettings(@Body() body: unknown): Promise<unknown> {
    const input = updateOrgSettingsSchema.parse(body);
    return this.orgsService.updateSettings(input);
  }
}
