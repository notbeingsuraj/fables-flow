import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { createRoleSchema, updateRoleSchema, paginationQuerySchema } from '@fables-flow/validation';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermissions('settings.edit')
  @ApiOperation({ summary: 'List all roles in the organization' })
  async findAll(@Query() query: Record<string, string>) {
    const q = paginationQuerySchema.parse(query);
    return this.rolesService.findAll(q);
  }

  @Get(':id')
  @RequirePermissions('settings.edit')
  @ApiOperation({ summary: 'Get role details' })
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @RequirePermissions('settings.edit')
  @ApiOperation({ summary: 'Create a new custom role' })
  async create(@Body() body: unknown) {
    const input = createRoleSchema.parse(body);
    return this.rolesService.create(input);
  }

  @Patch(':id')
  @RequirePermissions('settings.edit')
  @ApiOperation({ summary: 'Update an existing role' })
  async update(@Param('id') id: string, @Body() body: unknown) {
    const input = updateRoleSchema.parse(body);
    return this.rolesService.update(id, input);
  }

  @Delete(':id')
  @RequirePermissions('settings.edit')
  @ApiOperation({ summary: 'Delete a role' })
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
