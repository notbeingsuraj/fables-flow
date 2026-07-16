# Architecture Decision Record (ADR) --- ADR-001: Selection of Primary Database Engine

## Status

Approved

## Context & Problem

Fables Flow is a highly transactional operations platform handling orders, double-entry financial ledgers, and inventory tracking for Indian wholesalers. We need a primary database engine that guarantees absolute data integrity, supports complex relational models (warehousing hierarchies, payment allocations), handles high-concurrency searches, and scales to millions of records.

---

## Options Considered

### Option 1: MongoDB (NoSQL)

- _Pros_: Flexible document schemas, easy indexing of raw JSON payload logs from WhatsApp webhooks.
- _Cons_: Lacks strict ACID transactional boundaries across collections out of the box, does not enforce relational constraints (foreign keys), and double-entry accounting ledgers would need complex application-layer validations.

### Option 2: MySQL

- _Pros_: Robust ACID compliance, strong community, reliable replication.
- _Cons_: Inferior support for JSON columns compared to PostgreSQL, lacking built-in vector similarity search extensions (`pgvector`), which are required for product matching in our AI pipeline.

### Option 3: PostgreSQL

- _Pros_:
  - Fully ACID compliant.
  - Rich support for JSONB data types with index capabilities (GIN indexes), allowing structured and unstructured data to exist in the same database.
  - Extensible ecosystem, notably `pgvector` for vector similarity matching and `pg_trgm` for trigram typo-tolerant searches.
  - Built-in support for Row-Level Security (RLS) to enforce tenant isolation.
- _Cons_: Scaling writes requires sharding or connection poolers (e.g., PgBouncer) at high scale.

---

## Decision

We choose **PostgreSQL** as the primary relational database engine.

---

## Consequences

- **ACID Guarantees**: Enforces transactional safety for all ledger changes.
- **Relational Integrity**: Uses native database foreign keys to prevent orphan records on warehouse stock or payment allocations.
- **Unified AI & DB Vector Store**: We can store product catalogs and their embeddings inside the same PostgreSQL instance using the `pgvector` extension.
- **Tenancy Boundary**: PostgreSQL RLS or query interceptors ensure zero cross-tenant leakage.
- **Scale Bounds**: At high scales, we will utilize PgBouncer for connection pooling and Neon database branching/scaling features.
