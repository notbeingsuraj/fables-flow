# Fables Flow --- Permission Matrix Specification

Fables Flow enforces role-based access control (RBAC) at the API layer, authorizing actions based on permissions rather than roles alone. This ensures maximum flexibility and security in production.

---

## 1. System Roles Catalog

- **Owner**: The creator of the organization tenant. Has full, unrestricted access to settings, user management, API keys, billing, and system audits.
- **Admin**: General manager of operations. Has full write access to all business features (Retailers, Products, Orders, Invoices, Payments), but cannot modify organization billing plans or invite/delete Owner profiles.
- **Accountant**: Financial auditor. Full access to Invoices, Payments, General Ledgers, and financial summaries. Restricted from editing catalog configurations or assigning delivery routes.
- **Sales Representative**: Field salesperson. Can invite Retailers, draft Orders, and view assigned territory history. Locked from editing invoices or modifying accounting ledger parameters.
- **Collection Agent**: Collection coordinator. Can view assigned payment tasks, record physical collections, and write follow-up logs.
- **Warehouse Staff**: Logistics operator. Can view pick lists, confirm packed items, create GRNs, and move inventory stock.

---

## 2. Permissions Authorization Matrix

| Domain Module          | Permission Key                | Owner | Admin | Accountant | Sales Rep | Collection Agent | Warehouse Staff |
| :--------------------- | :---------------------------- | :---: | :---: | :--------: | :-------: | :--------------: | :-------------: |
| **Users & Settings**   | `users.invite`                |  ✅   |  ✅   |     ❌     |    ❌     |        ❌        |       ❌        |
|                        | `billing.manage`              |  ✅   |  ❌   |     ❌     |    ❌     |        ❌        |       ❌        |
|                        | `api_keys.manage`             |  ✅   |  ❌   |     ❌     |    ❌     |        ❌        |       ❌        |
|                        | `settings.edit`               |  ✅   |  ✅   |     ❌     |    ❌     |        ❌        |       ❌        |
| **Retailers**          | `retailers.create`            |  ✅   |  ✅   |     ❌     |    ✅     |        ❌        |       ❌        |
|                        | `retailers.edit`              |  ✅   |  ✅   |     ❌     |    ✅     |        ❌        |       ❌        |
|                        | `retailers.credit_limit.edit` |  ✅   |  ✅   |     ✅     |    ❌     |        ❌        |       ❌        |
| **Orders**             | `orders.create`               |  ✅   |  ✅   |     ❌     |    ✅     |        ❌        |       ❌        |
|                        | `orders.approve`              |  ✅   |  ✅   |     ✅     |    ❌     |        ❌        |       ❌        |
|                        | `orders.cancel`               |  ✅   |  ✅   |     ❌     |    ✅     |        ❌        |       ❌        |
| **Invoices**           | `invoices.create`             |  ✅   |  ✅   |     ✅     |    ❌     |        ❌        |       ❌        |
|                        | `invoices.edit`               |  ✅   |  ✅   |     ✅     |    ❌     |        ❌        |       ❌        |
|                        | `invoices.cancel`             |  ✅   |  ✅   |     ✅     |    ❌     |        ❌        |       ❌        |
| **Payments & Ledgers** | `payments.record`             |  ✅   |  ✅   |     ✅     |    ✅     |        ✅        |       ❌        |
|                        | `payments.allocate`           |  ✅   |  ✅   |     ✅     |    ❌     |        ❌        |       ❌        |
|                        | `ledgers.reconcile`           |  ✅   |  ✅   |     ✅     |    ❌     |        ❌        |       ❌        |
| **Inventory**          | `stock.adjust`                |  ✅   |  ✅   |     ❌     |    ❌     |        ❌        |       ✅        |
|                        | `stock.transfer`              |  ✅   |  ✅   |     ❌     |    ❌     |        ❌        |       ✅        |
|                        | `grn.create`                  |  ✅   |  ✅   |     ✅     |    ❌     |        ❌        |       ✅        |

---

## 3. API Authorization Implementation (NestJS Guard)

The backend evaluates permissions using a custom decorator `@RequirePermissions()` linked to a NestJS Guard.

```typescript
@SetMetadata('permissions', permissions)
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private db: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Injected by JWT validation guard

    // Evaluate permissions catalog assigned to user.role in database
    const rolePermissions = await this.db.rolePermission.findMany({
      where: { role: user.role },
      select: { permissionKey: true }
    });

    const userPermissionKeys = rolePermissions.map(p => p.permissionKey);
    return requiredPermissions.every(permission => userPermissionKeys.includes(permission));
  }
}
```
