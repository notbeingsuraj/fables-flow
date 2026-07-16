import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '@fables-flow/types';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET'] || 'super-secret-default-key-change-me',
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Basic validation to ensure the user still exists and isn't locked out.
    // Tenant isolation is handled by middleware, but strategy runs before controllers.
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
        organizationId: payload.orgId,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or deactivated');
    }

    if (user.lockedAt) {
      throw new UnauthorizedException('Account is locked');
    }

    return payload; // Returns payload, attached to request.user
  }
}
