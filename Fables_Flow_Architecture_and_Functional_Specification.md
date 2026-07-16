# Fables Flow --- Product Architecture & Functional Specification

## Vision

Fables Flow is an AI-native Order-to-Collection Operating System for
distributors and wholesalers. It converts unstructured WhatsApp
conversations into structured business operations, reducing manual work,
missed orders, delayed collections, and operational dependency on
individuals.

---

# High-Level Workflow

```text
Retailer
    │
    ▼
WhatsApp Order
    │
    ▼
WhatsApp Webhook
    │
    ▼
Store Raw Message
    │
    ▼
AI Parsing & Validation
    │
    ▼
Draft Order
    │
    ▼
Human Review (if needed)
    │
    ▼
Confirmed Order
    │
    ▼
Invoice Generation
    │
    ▼
Payment Tracking
    │
    ▼
Collections & Reminders
    │
    ▼
Reports & Analytics
```

---

# Recommended Technology Stack

---

Layer Technology

---

Frontend Next.js, TypeScript, Tailwind CSS,
shadcn/ui

State TanStack Query, React Hook Form, Zod

Backend NestJS (TypeScript), REST API

ORM Prisma

Database PostgreSQL

Queue Redis + BullMQ

AI Structured LLM Outputs + Zod Validation

Storage Cloudflare R2

Monitoring Sentry, PostHog

Deployment Vercel (Frontend), Railway/Render
(Backend), Neon (PostgreSQL), Upstash
(Redis)

Messaging Official WhatsApp Business Platform
-----------------------------------------------------------------------

---

# System Architecture

```text
Users
│
├── Retailers (WhatsApp)
├── Distributor Staff
└── Owners

            │

Responsive Web App (PWA)

            │

REST API (NestJS)

            │

Modular Monolith

├── Authentication
├── Organizations
├── Users
├── Retailers
├── Products
├── Orders
├── Invoices
├── Payments
├── Collections
├── Claims
├── Reports
├── Notifications
├── AI
├── WhatsApp
└── Audit

            │

PostgreSQL
Redis
Cloudflare R2
```

---

# Functional Modules

## Authentication & Organizations

- Secure login
- Refresh tokens
- Multi-tenant organization support
- Role-based access control
- Permission management

## User Management

- Invite users
- Manage roles
- Activate/deactivate accounts
- Audit user activity

## Retailer Management

- Retailer profiles
- Contact persons
- Addresses
- Credit limits
- Payment terms
- Purchase history

## Product Management

- Product catalog
- Variants
- Pricing
- SKU management
- Stock visibility (optional future)

## WhatsApp Integration

- Receive orders
- Store raw messages
- AI extraction
- Order confirmation workflow
- Delivery status tracking

## AI Order Parsing

AI extracts: - Intent - Products - Quantities - Notes - Confidence score

Low-confidence requests require manual approval.

## Order Management

- Draft orders
- Review
- Confirm
- Edit
- Cancel
- Status tracking
- Order history

## Invoice Management

- Automatic invoice generation
- PDF invoices
- GST-ready structure
- Credit notes
- Invoice history

## Payments

- Record payments
- Partial payments
- Multiple payment modes
- Outstanding balance
- Payment allocation

## Collections

- Collection schedule
- Overdue invoices
- Reminder automation
- Collection history
- Agent notes

## Claims & Returns

- Damaged goods
- Short supply
- Returns
- Credit adjustments

## Reports

- Sales
- Collections
- Outstanding invoices
- Retailer performance
- Aging analysis
- Daily business summary

## Notifications

- Payment reminders
- Order approvals
- Overdue invoices
- Internal alerts

## Audit Logs

Track every critical action: - Invoice edits - Payment updates - Order
approvals - User changes

---

# Database Core Entities

- Organizations
- Users
- Roles
- Permissions
- Retailers
- Products
- Orders
- Order Items
- Invoices
- Invoice Items
- Payments
- Payment Allocations
- Collection Tasks
- Claims
- Returns
- WhatsApp Messages
- AI Extractions
- Notifications
- Audit Logs

Every business entity contains: - id - organization_id - created_at -
updated_at - created_by

---

# Background Jobs

BullMQ workers handle: - AI message parsing - Invoice PDF generation -
Payment reminders - Report generation - Scheduled notifications - Retry
failed webhooks

---

# Security

- HTTPS
- Tenant isolation
- Input validation
- Rate limiting
- Secure password hashing
- HTTP-only cookies
- Signed webhooks
- Database backups
- Audit logs
- Idempotent payment processing

---

# Deployment

```text
apps/
├── web
├── api
└── worker

packages/
├── ui
├── types
├── validation
├── config
└── eslint-config
```

Use a Turborepo monorepo with pnpm workspaces.

---

# Product Roadmap

## Phase 1 (MVP)

- Authentication
- Retailers
- Products
- WhatsApp order capture
- AI parsing
- Draft orders
- Invoice generation
- Payment tracking

## Phase 2

- Collections
- Reports
- Claims
- Notifications
- PWA installation

## Phase 3

- Inventory
- Purchase management
- Delivery tracking
- Accounting integrations
- Advanced AI insights
- Native mobile companion app

---

# Design Principles

1.  WhatsApp is the primary input channel.
2.  The web app is the operational control center.
3.  AI assists but never makes irreversible business decisions.
4.  Human review handles ambiguous cases.
5.  Every financial action is auditable.
6.  Build as a modular monolith first; split services only when scaling
    demands it.

---

# Long-Term Vision

Fables Flow should become the operating system for Indian distributors
by unifying order capture, invoicing, payments, collections, customer
history, and AI-assisted workflows into one reliable platform.
