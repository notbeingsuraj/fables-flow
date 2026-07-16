# Architecture Decision Record (ADR) --- ADR-002: Modular Monolith Architecture Pattern

## Status

Approved

## Context & Problem

Fables Flow needs to support multiple business operations (Auth, Orders, Invoices, Payments, Inventory, AI pipeline) for multi-tenant users. As a founding team, we must maximize developer velocity, ease of testing, and deployment simplicity, while designing the system to avoid code spaghetti and keep modules decoupled enough for future scaling demands.

---

## Options Considered

### Option 1: Microservices Architecture

- _Pros_: Independent scaling of modules (e.g., scaling AI parser or reporting workers separately), isolated database scopes.
- _Cons_: High operational overhead, complex distributed transaction handling (e.g., SAGA pattern for stock reservations and invoice generation), shared networks bottlenecks, slow developer velocity, and complex local developer setup.

### Option 2: Traditional Monolith (Unstructured)

- _Pros_: Extremely simple database access, unified codebase, rapid early feature deployment.
- _Cons_: High risk of domain boundaries bleeding together (cross-joining tables directly), making refactoring difficult and creating hard dependencies that prevent extracting services later.

### Option 3: Modular Monolith

- _Pros_:
  - Codebase operates as a single application, eliminating RPC network calls and simplified deployments.
  - Domains are strictly isolated inside modular folder constructs (NestJS modules).
  - Explicit boundaries: direct database joins across modules are banned. Communications must pass through public APIs, internal event systems, or interface providers.
  - Allows isolating CPU-heavy background queues (like AI workers) into distinct process executors (BullMQ workers) while sharing the same codebase.
- _Cons_: Requires discipline to enforce boundaries. Shared database resources (CPU/Memory).

---

## Decision

We choose to implement a **Modular Monolith** pattern.

---

## Consequences

- **Velocity**: Fast iterations; developers can modify multiple domain schemas in a single commit.
- **Transactional Safety**: Relational databases can run multi-domain operations inside single standard transactions without complex coordination protocols.
- **Scale Path**: If the AI parsing worker or background PDF rendering experiences bottlenecks, we can deploy the same monolith package running only target worker processes (`apps/worker`), leaving the core REST API API undisturbed.
