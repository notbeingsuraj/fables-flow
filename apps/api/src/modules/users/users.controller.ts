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
import { UsersService } from './users.service';
import { createUserSchema, updateUserSchema, paginationQuerySchema } from '@fables-flow/validation';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('users.invite')
  @ApiOperation({ summary: 'List all users in the organization' })
  async findAll(@Query() query: Record<string, string>) {
    const q = paginationQuerySchema.parse(query);
    return this.usersService.findAll(q);
  }

  @Get(':id')
  @RequirePermissions('users.invite')
  @ApiOperation({ summary: 'Get user details' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @RequirePermissions('users.invite')
  @ApiOperation({ summary: 'Create (invite) a new user' })
  async create(@Body() body: unknown) {
    const input = createUserSchema.parse(body);
    return this.usersService.create(input);
  }

  @Patch(':id')
  @RequirePermissions('users.invite')
  @ApiOperation({ summary: 'Update an existing user' })
  async update(@Param('id') id: string, @Body() body: unknown) {
    const input = updateUserSchema.parse(body);
    return this.usersService.update(id, input);
  }

  @Delete(':id')
  @RequirePermissions('users.invite')
  @ApiOperation({ summary: 'Deactivate a user' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
