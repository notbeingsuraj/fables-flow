import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '@fables-flow/types';
import type { LoginInput } from '@fables-flow/validation';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(input: LoginInput, ipAddress?: string, userAgent?: string) {
    // We cannot assume tenant context is set yet for login, because login usually doesn't have a token.
    // However, if users must belong to exactly one organization, their email + password is enough to find them.
    // If they can belong to multiple, we need organizationId in the login payload. For now, findFirst works.

    // We must bypass tenant isolation temporarily for login if tenant isn't established yet.
    // Prisma $use middleware injects organizationId IF tenantStorage has it.
    // At login, tenantStorage is empty, so we must query globally.
    const user = await this.prisma.user.findFirst({
      where: { email: input.email, deletedAt: null },
      include: { organization: true },
    });

    if (!user || user.organization.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid credentials or organization inactive');
    }

    if (user.lockedAt) {
      throw new UnauthorizedException('Account is locked. Please contact support.');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, input.password);
    if (!isPasswordValid) {
      // Increment login attempts
      const attempts = user.loginAttempts + 1;
      const lockedAt = attempts >= 5 ? new Date() : null;
      await this.prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: attempts, lockedAt },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset login attempts on success
    await this.prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedAt: null },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      orgId: user.organizationId,
      roleId: user.roleId,
      type: 'access',
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const refreshPayload: JwtPayload = { ...payload, type: 'refresh' };
    const refreshToken = this.jwtService.sign(refreshPayload, { expiresIn: '7d' });
    const refreshTokenHash = await argon2.hash(refreshToken);

    // Save session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: user.organizationId,
        roleId: user.roleId,
      },
    };
  }

  async logout(userId: string, refreshToken: string) {
    // Find sessions for user and revoke the one matching the refresh token
    const sessions = await this.prisma.session.findMany({
      where: { userId, isRevoked: false },
    });

    for (const session of sessions) {
      if (await argon2.verify(session.refreshTokenHash, refreshToken)) {
        await this.prisma.session.update({
          where: { id: session.id },
          data: { isRevoked: true },
        });
        break;
      }
    }
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const sessions = await this.prisma.session.findMany({
        where: { userId: payload.sub, isRevoked: false },
      });

      let activeSession = null;
      for (const session of sessions) {
        if (
          session.expiresAt > new Date() &&
          (await argon2.verify(session.refreshTokenHash, token))
        ) {
          activeSession = session;
          break;
        }
      }

      if (!activeSession) {
        throw new UnauthorizedException('Session expired or revoked');
      }

      // Generate new access token
      const accessPayload: JwtPayload = {
        sub: payload.sub,
        email: payload.email,
        orgId: payload.orgId,
        roleId: payload.roleId,
        type: 'access',
      };
      const accessToken = this.jwtService.sign(accessPayload, { expiresIn: '15m' });

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
