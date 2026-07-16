# Fables Flow --- Deployment, Environments & Feature Flag Strategy

This document details the software deployment lifecycle, hosting environments, and feature flag management policies for Fables Flow.

---

## 1. Deployment Environments & Promotion Flow

Fables Flow runs across four environments with strict configurations:

```text
[Local Machine]
       │ (git push branch)
       ▼
[Development (Vercel Preview / Railway Dev Project)]
       │ (Auto-deploy on commit to main)
       ▼
[Staging (Railway Staging Project / Neon Staging Database Branch)]
       │ (Manual trigger / GitHub Release Tag)
       ▼
[Production (Railway Production Project / Neon Primary Branch)]
```

### Environment Configurations

- **Local**:
  - Runs in local Docker containers (Redis, PG).
  - Webhooks simulated using local tunnels (ngrok/Localtunnel).
- **Development**:
  - Auto-deploys preview branches from GitHub.
  - Generates sandbox credentials for testing.
- **Staging**:
  - Exact production clone. Uses a Neon branch fork database containing anonymized production database snapshots.
  - Used for E2E verification tests.
- **Production**:
  - Deployed in active regions (e.g., AWS Mumbai / GCP India equivalents).
  - Auto-scaling active, DB backups active.

---

## 2. Feature Flag Strategy

We use Feature Flags (integrated via PostHog or custom local context configurations) to release features progressively and handle per-tenant subscription plans.

### Core Feature Flags Catalog

| Flag Key                         | Target Scope      | Description                                                            | Default State                        |
| :------------------------------- | :---------------- | :--------------------------------------------------------------------- | :----------------------------------- |
| `enable-ai-parsing`              | Global / Tenant   | Enables the WhatsApp AI parser pipeline.                               | `Disabled` (Toggled upon WABA setup) |
| `enable-inventory-reservations`  | Tenant config     | Switches order approvals to reserve stock in warehouses.               | `Enabled`                            |
| `enable-double-entry-accounting` | Tenant plan       | Activates general ledger entries. Toggled off for basic billing users. | `Disabled` (Plan specific)           |
| `beta-voice-notes-parsing`       | Beta tester group | Permits processing incoming WhatsApp voice audio clips.                | `Disabled`                           |

---

## 3. Dynamic Flag Ingestion Pattern (NestJS Guard)

To avoid database lookup overhead on every API call, flags are checked in middleware using Redis-backed caching.

```typescript
@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private flagsService: FeatureFlagsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFlag = this.reflector.get<string>('featureFlag', context.getHandler());
    if (!requiredFlag) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const orgId = request.user.organizationId;

    const isEnabled = await this.flagsService.evaluateFlag(requiredFlag, orgId);
    if (!isEnabled) {
      throw new ForbiddenException(
        `Feature flag ${requiredFlag} is disabled for your organization.`,
      );
    }
    return true;
  }
}
```
