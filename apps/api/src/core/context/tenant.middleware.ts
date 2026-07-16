import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { tenantStorage } from './tenant.context';
import type { JwtPayload } from '@fables-flow/types';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return tenantStorage.run({ organizationId: '' }, () => next());
    }

    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const payload = this.jwtService.verify<JwtPayload>(token, {
          secret: process.env['JWT_SECRET'] || 'super-secret-default-key-change-me',
        });

        // Populate the tenant context
        return tenantStorage.run(
          {
            organizationId: payload.orgId,
            userId: payload.sub,
            roleId: payload.roleId,
          },
          () => next(),
        );
      } catch {
        // Invalid token, just proceed without tenant context. AuthGuards will catch it if it's protected.
        return tenantStorage.run({ organizationId: '' }, () => next());
      }
    }

    return tenantStorage.run({ organizationId: '' }, () => next());
  }
}
