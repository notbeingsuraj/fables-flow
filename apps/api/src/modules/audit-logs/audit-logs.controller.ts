import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { paginationQuerySchema } from '@fables-flow/validation';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @RequirePermissions('audit.view')
  @ApiOperation({ summary: 'List audit logs for the organization' })
  async findAll(@Query() query: Record<string, string>): Promise<unknown> {
    const q = paginationQuerySchema.parse(query);
    return this.auditLogsService.findAll(q);
  }
}
