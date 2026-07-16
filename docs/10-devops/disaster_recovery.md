# Fables Flow --- Disaster Recovery & Data Retention Policy

This document defines the disaster recovery (DR) plans, backup frequencies, recovery metrics, and data retention standards for the Fables Flow production environments.

---

## 1. Disaster Recovery Metrics (RPO & RTO)

- **Recovery Point Objective (RPO)**:
  - Transaction Database (PostgreSQL): $\leq 1\text{ Hour}$ (data loss limit in a catastrophic region failure).
  - Queue Storage (Redis): $\leq 24\text{ Hours}$ (re-enqueueing webhook payloads can recover queue states).
  - File Storage (Cloudflare R2): $\leq 24\text{ Hours}$ (underlying documents can be regenerated from database transactions).
- **Recovery Time Objective (RTO)**:
  - System Availability Restored: $\leq 4\text{ Hours}$ (critical services online, read/write access active).

---

## 2. Backup Strategy & Database WAL Archiving

- **Neon PostgreSQL Backups**:
  - Continuous **Write-Ahead Logging (WAL)** archiving enabled. Supports Point-in-Time Recovery (PITR) to any millisecond within the past 14 days.
  - Full logical database dumps executed daily at 02:00 IST and exported to a secondary cloud provider (AWS S3) in a separate geographical region.
- **Cloudflare R2 Storage Backups**:
  - R2 buckets configured with multi-region replication.
  - Life-cycle policies replicate uploaded PDFs (Invoices, Reports) across AP-South (Mumbai) and AP-East (Singapore) regions.

---

## 3. Redis Failure & Queue Replay Strategy

If the primary Redis instance (Upstash/Railway) crashes or experiences data corruption, the background worker queue may drop active jobs. We mitigate this using a Webhook Ingress Audit model:

```text
Inbound Webhook ──► Write to DB (whatsapp_messages: Status 'PENDING')
                         │
                         ├─► Enqueue BullMQ Job (If Redis fails, job is lost)
                         │
                   [Hourly Cron Audit]
                         │
                         ▼
                   Scan whatsapp_messages with status 'PENDING' for > 30 Mins
                         │
                         ▼
                   Re-enqueue missing IDs into BullMQ
```

### Redis Recovery Execution

1. **Circuit Breaker**: If Redis connection is lost, NestJS API switches to a degraded state. Inbound WhatsApp webhooks continue to write to PostgreSQL but write events to a fallback database table `delayed_jobs` instead of Redis.
2. **Replay Trigger**: Once Redis is healthy, an admin script processes `delayed_jobs` and pushes them to BullMQ.

---

## 4. Data Retention Policy

To comply with Indian tax regulations and optimize system database performance, data is stored according to the following retention rules:

| Data Type                  | Retention Period | Storage Target                                             | Disposal Method                                    |
| :------------------------- | :--------------- | :--------------------------------------------------------- | :------------------------------------------------- |
| **Audit Logs**             | 7 Years          | PostgreSQL $\rightarrow$ Cold AWS S3 Glacier after 1 year. | Compressed Cold Archive.                           |
| **Soft-deleted Records**   | 90 Days          | Primary PostgreSQL Table                                   | Automated cron executes physical `DELETE` queries. |
| **Raw AI Prompt Logs**     | 30 Days          | AI extraction table                                        | Cleaned via automated background worker.           |
| **Generated Invoice PDFs** | Indefinitely     | Cloudflare R2                                              | None (Mandatory for GST audits).                   |
| **Database Backups**       | 35 Days          | Secondary S3 Storage                                       | Automatic rotation deletion.                       |
