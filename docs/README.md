# Fables Flow --- System Architecture & Functional Specification Docs

Welcome to the central engineering documentation for **Fables Flow** (The Operations Operating System for Indian Wholesalers and Distributors).

---

## 📖 Documentation Catalog

- **01. Product & Scope**
  - [Product Specification](file:///Users/surajkumar/Desktop/Fables-flow/docs/01-product/product_specification.md): Vision, user personas, and target operational journeys.
- **02. Domain Model**
  - [Bounded Contexts Map](file:///Users/surajkumar/Desktop/Fables-flow/docs/02-domain-model/bounded_contexts.md): Domain boundary divisions (Identity, Sales, Inventory, Finance, Accounting, AI, etc.).
  - [Domain Workflows & State Machines](file:///Users/surajkumar/Desktop/Fables-flow/docs/02-domain-model/state_machines.md): Comprehensive state transitions for Orders, Invoices, Payments, and Collections.
- **03. System Architecture**
  - [System Design Specification](file:///Users/surajkumar/Desktop/Fables-flow/docs/03-architecture/system_design.md): Modular Monolith rules, Event-driven architecture payloads, caching structures, and pgvector search design.
  - [Workflow Engine Design](file:///Users/surajkumar/Desktop/Fables-flow/docs/03-architecture/workflow_engine.md): Dynamic workflow engine DAGs and configuration rules.
  - [Plugin & Hook Architecture](file:///Users/surajkumar/Desktop/Fables-flow/docs/03-architecture/plugin_architecture.md): Lifecycle hooks (discounts, custom numbering, taxation) extensions design.
- **04. Database & Auditing**
  - [Database & Audit Specification](file:///Users/surajkumar/Desktop/Fables-flow/docs/04-database/schema.md): Index design, Row-Level Security tenant isolation, and the transaction Audit Log diff model schema.
- **05. REST API Standards**
  - [REST API Standards](file:///Users/surajkumar/Desktop/Fables-flow/docs/05-api/standards.md): Versioning, pagination guidelines, idempotency handlers, and uniform error code maps.
- **07. UI & Design System**
  - [Design System & Components](file:///Users/surajkumar/Desktop/Fables-flow/docs/07-design-system/components.md): Typography, spacing grids, accessibility levels, keyboard shortcuts list, and functional component definitions (`LedgerTable`, `OrderTimeline`, etc.).
- **08. AI Operations**
  - [AI Ingestion Pipeline Spec](file:///Users/surajkumar/Desktop/Fables-flow/docs/08-ai/pipeline.md): Preprocessing, vector indexing RAG, LLM schema parsing, and confidence scoring.
- **09. Security & Access Control**
  - [Permission Matrix Specification](file:///Users/surajkumar/Desktop/Fables-flow/docs/09-security/permission_matrix.md): Granular permission assignments (Owner vs. Admin vs. Accountant vs. Sales/Collection Reps).
- **10. Infrastructure & Reliability**
  - [Disaster Recovery & Retention](file:///Users/surajkumar/Desktop/Fables-flow/docs/10-devops/disaster_recovery.md): RTO/RPO targets, database continuous WAL archiving, Redis queue replay flow, and storage retention limits.
  - [Deployment & Feature Flags](file:///Users/surajkumar/Desktop/Fables-flow/docs/10-devops/deployment.md): Environments (Local $\rightarrow$ Dev $\rightarrow$ Staging $\rightarrow$ Prod) promotion pipeline and toggle evaluations.
- **13. Architecture Decision Records (ADRs)**
  - [ADR-001: Selection of Primary Database Engine](file:///Users/surajkumar/Desktop/Fables-flow/docs/13-adrs/ADR-001-why-postgresql.md) (PostgreSQL choice).
  - [ADR-002: Modular Monolith Architecture Pattern](file:///Users/surajkumar/Desktop/Fables-flow/docs/13-adrs/ADR-002-why-modular-monolith.md) (Modular project setup).
  - [ADR-003: Selection of BullMQ for Queue Management](file:///Users/surajkumar/Desktop/Fables-flow/docs/13-adrs/ADR-003-why-bullmq.md) (Background queue choice).
