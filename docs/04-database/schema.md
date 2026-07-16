# Fables Flow --- Database Architecture & Audit Design

This document details the database schema rules, indexing strategies, audit models, and tenant isolation policies enforced in Fables Flow.

---

## 1. Tenant Isolation & Row Filtering Pattern

Every workspace query must enforce strict organization separation. We implement this using a database context filter middleware in NestJS:

1. A NestJS `AsyncLocalStorage` stores the current request context tenant ID.
2. The Prisma query pipeline intercepts execution and injects an `organizationId` filter constraint onto all tenant-specific entities:
   ```typescript
   prisma.$use(async (params, next) => {
     const tenantId = tenantStorage.getStore()?.organizationId;
     if (tenantId && isTenantEntity(params.model)) {
       // Inject organizationId filter into find, update, delete operations
       params.args.where = {
         ...params.args.where,
         organizationId: tenantId,
       };
     }
     return next(params);
   });
   ```

---

## 2. Relational Schema Indexing Strategy

To handle high volumes (100k+ invoices, 1M+ messages) efficiently, we define strict composite indexes:

- **WhatsApp Lookup**:
  ```sql
  CREATE INDEX idx_retailers_org_phone ON retailers(organization_id, phone_number);
  ```
- **Stock Batch Searches**:
  ```sql
  CREATE INDEX idx_stock_batches_lookup ON stock_batches(organization_id, product_id, warehouse_id);
  ```
- **Outstanding Invoices**:
  ```sql
  CREATE INDEX idx_invoices_outstanding ON invoices(organization_id, status, due_date)
  WHERE status NOT IN ('PAID', 'CANCELLED');
  ```
- **Audit Trails Log**:
  ```sql
  CREATE INDEX idx_audit_logs_lookup ON audit_logs(organization_id, entity_name, entity_id);
  ```

---

## 3. Transactional Audit Log Model (Old/New Diffs)

To support complete transparency, the database stores actual object diff representations for edits rather than simple action text logs.

### Audit Log Schema Columns

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id),
    entity_name VARCHAR(100) NOT NULL, -- e.g., 'Invoice', 'Retailer'
    entity_id VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,       -- e.g., 'UPDATE', 'APPROVE'
    old_values JSONB,                  -- Null on CREATE
    new_values JSONB,                  -- Null on DELETE
    changed_fields JSONB,              -- Array of strings listing altered attributes
    reason TEXT,                       -- Manual note entered by accountant/admin
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Example Audit Entry (Invoice Status Change)

```json
{
  "id": "7a83d9e2-9b21-4f10-90c0-62ba89dfc919",
  "organization_id": "org-839210",
  "actor_id": "usr-493202",
  "entity_name": "Invoice",
  "entity_id": "inv-002931",
  "action": "UPDATE",
  "old_values": {
    "status": "SENT",
    "paidAmount": "10000.00"
  },
  "new_values": {
    "status": "PARTIALLY_PAID",
    "paidAmount": "15000.00"
  },
  "changed_fields": ["status", "paidAmount"],
  "reason": "UTR829302194 payment allocation applied.",
  "createdAt": "2026-07-16T10:50:00Z"
}
```
