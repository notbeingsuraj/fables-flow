# Fables Flow --- System Architecture & Design

This document details the core technical design of Fables Flow, focusing on Monolith modularity, event-driven orchestration, search architecture, and caching.

---

## 1. Modular Monolith Modularity Rules

To prevent Fables Flow from devolving into a spaghetti codebase, we enforce strict architectural boundaries:

- **Zero Cross-Module Direct Table Joins**: Modules cannot join tables owned by other modules. Cross-module data queries must go through interface service layers or emit events.
- **Dependency Inversion**: High-level modules define interfaces for services they depend on. Target modules implement these interfaces.
- **Independent Folders**: Each module contains its own controllers, services, entities, and events (e.g., `src/modules/orders/`).

---

## 2. Event-Driven Architecture (EDA) & Event Bus

We implement an asynchronous event system to decouple tasks like PDF generation, analytics logging, and notification dispatches from the core HTTP thread.

```text
HTTP Thread (Controller)
   │
   ▼
Execute Command (Service) ───[Emit Event]───► Event Bus (NestJS EventEmitter)
                                                    │
                                   ┌────────────────┴────────────────┐
                                   ▼                                 ▼
                             [Sync Listeners]                [Async Redis Queue]
                             - Audit Logger                  - BullMQ Worker
                             - Ledger Balancer               - WhatsApp Notifier
                                                             - PDF Generation
```

### Event Payload Schema

All events published to the event bus must implement the standard envelope:

```typescript
interface DomainEvent<T = any> {
  eventId: string; // Unique UUID
  eventName: string; // e.g., 'order.approved'
  organizationId: string; // Tenant ID
  timestamp: string; // ISO 8601 string
  actorId: string | null; // User who triggered event
  payload: T; // Event payload
}
```

---

## 3. Caching Strategy & Cache Invalidation

To meet p95 latency targets of $< 200\text{ ms}$, we use a layered caching system (NestJS cache manager + Redis).

```text
Client Request ──► Cache Middleware ──► Hit? ──(Yes)──► Return JSON
                         │
                       (No)
                         ▼
                   Database Query ──► Update Redis ──► Return JSON
```

### Cache Mappings & Invalidation Policies

| Cache Key Namespace        | Target Contents                            | TTL      | Invalidation Trigger                              |
| :------------------------- | :----------------------------------------- | :------- | :------------------------------------------------ |
| `org:settings:{orgId}`     | Organization-specific metadata             | 24 Hours | `OrganizationSettingsUpdated` event.              |
| `user:perms:{userId}`      | RBAC permissions evaluation                | 1 Hour   | User role update or permissions adjustments.      |
| `catalog:products:{orgId}` | Product names, prices, SKUs                | 1 Hour   | `ProductCreated` / `ProductUpdated` event.        |
| `metrics:daily:{orgId}`    | Dashboard revenue/collections calculations | 15 Mins  | Scheduled worker recalculation or manual refresh. |

---

## 4. Search Architecture

Wholesaler databases frequently query large datasets of SKUs and customer records. Fables Flow uses a tiered search strategy:

### 1. PostgreSQL Full-Text Search

- Used for locating orders, invoices, and ledger records.
- Implements `tsvector` and `tsquery` on combined column values (e.g., invoice number, notes, retailer name) to leverage index searches.

### 2. Trigram Search

- Used for auto-completing search queries (kirana names, address lines) with typos.
- Leverages the PostgreSQL `pg_trgm` extension. An index is defined using a GIST operators list:
  ```sql
  CREATE INDEX idx_retailer_name_trgm ON retailers USING gist (name gist_trgm_ops);
  ```

### 3. Semantic Vector Search (RAG)

- Used during the WhatsApp parsing pipeline to match fuzzy item transcripts (e.g., "ParleG 5 wala") to structured catalog SKUs.
- Product descriptions and names are tokenized and stored as embeddings in PostgreSQL using `pgvector` or matched inside an external memory storage (such as Redis VL).
