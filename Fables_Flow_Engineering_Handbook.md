# Fables Flow --- Engineering Handbook

This handbook is the single source of truth for building Fables Flow, an
AI-native Order-to-Collection Operating System for distributors and
wholesalers.

---

## 1. Product Goals

- Replace fragmented WhatsApp + Excel workflows.
- Reduce order processing time.
- Improve collection efficiency.
- Maintain complete auditability.

---

## 2. Target Users

- Business Owner
- Sales Manager
- Accountant
- Sales Representative
- Collection Agent
- Retailer (via WhatsApp only)

---

## 3. User Journeys

1.  Retailer sends WhatsApp order.
2.  AI extracts intent.
3.  Draft order created.
4.  Staff reviews if needed.
5.  Invoice generated.
6.  Payment tracked.
7.  Collections automated.

---

## 4. System Architecture

See architecture document. Backend is a modular monolith (NestJS),
Next.js frontend, PostgreSQL, Redis/BullMQ workers, official WhatsApp
Business Platform, LLM-powered extraction.

---

## 5. Domain Modules

Authentication, Organizations, Users, Roles, Retailers, Products,
Orders, Invoices, Payments, Collections, Claims, Notifications, Reports,
Audit, AI, WhatsApp.

---

## 6. Suggested Database Schema

Core tables: - organizations - users - organization_members - roles -
permissions - retailers - products - orders - order_items - invoices -
invoice_items - payments - payment_allocations - collection_tasks -
whatsapp_messages - ai_extractions - notifications - audit_logs

---

## 7. REST API

Examples: - POST /auth/login - POST /orders - GET /orders - PATCH
/orders/:id - POST /invoices - GET /reports/aging - POST /payments - GET
/retailers/:id/history

---

## 8. AI Design

Always return structured JSON validated with Zod. Never allow AI to
directly mutate financial records. Low-confidence outputs require human
approval.

---

## 9. Permission Matrix

Owner: all. Admin: operational management. Accountant:
invoices/payments. Sales: retailers/orders. Collection Agent:
collections only. Viewer: read-only.

---

## 10. Frontend Information Architecture

Dashboard, Orders, Retailers, Products, Invoices, Payments, Collections,
Reports, Settings. Responsive with PWA support.

---

## 11. Folder Structure

```text
apps/
  web/
  api/
  worker/
packages/
  ui/
  types/
  validation/
```

---

## 12. UI Guidelines

Use shadcn/ui, Tailwind CSS, clean enterprise layouts, searchable
tables, keyboard shortcuts, optimistic UI where safe.

---

## 13. State Management

TanStack Query for server state, React Hook Form + Zod for forms, local
state only for transient UI.

---

## 14. Background Workers

Invoice PDFs, reminders, AI parsing, scheduled reports, webhook retries.

---

## 15. Notifications

WhatsApp, email, in-app. Retry with exponential backoff.

---

## 16. Reporting

Sales, collections, outstanding, aging, retailer performance, user
productivity.

---

## 17. Observability

Sentry for errors, PostHog for analytics, structured logs, health
endpoints.

---

## 18. Security

HTTPS, RBAC, tenant isolation, signed webhooks, rate limiting, backups,
audit logs, Argon2 password hashing, HTTP-only cookies.

---

## 19. Testing Strategy

Unit tests for services, integration tests for APIs, E2E tests for
critical workflows, AI regression dataset for parser quality.

---

## 20. CI/CD

GitHub Actions → lint → typecheck → tests → build → deploy preview →
production after approval.

---

## 21. Scaling Strategy

Start as modular monolith. Extract services only after measurable
bottlenecks (AI worker, reporting, notifications).

---

## 22. Milestones

MVP → Pilot customers → Billing → Advanced analytics → Inventory →
Native companion app.

---

## 23. Engineering Standards

Strict TypeScript, Prisma migrations, API versioning, OpenAPI docs,
semantic commits, feature flags.

---

## Appendix A: Core KPIs

Order processing time, AI accuracy, overdue invoices, collection rate,
DSO, active retailers, daily processed orders.

---

## Appendix B: Future Integrations

Tally, Zoho Books, ERPNext, Razorpay, UPI, barcode scanners, inventory
systems.

---
