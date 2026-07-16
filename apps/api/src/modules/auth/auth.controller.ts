import { Controller, Post, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { loginSchema } from '@fables-flow/validation';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { Request } from 'express';

// We should use a ValidationPipe for Zod, but for now we manually parse in controller or use an interceptor.
// A ZodValidationPipe is standard in NestJS. We'll create one shortly.

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login to obtain access and refresh tokens' })
  async login(@Body() body: unknown, @Req() req: Request) {
    const input = loginSchema.parse(body);
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    return this.authService.login(input, ip, userAgent);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  async logout(@CurrentUser('sub') userId: string, @Body('refreshToken') refreshToken: string) {
    await this.authService.logout(userId, refreshToken);
    return { message: 'Logged out successfully' };
  }
}
