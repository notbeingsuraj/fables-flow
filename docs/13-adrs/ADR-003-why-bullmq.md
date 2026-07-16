# Architecture Decision Record (ADR) --- ADR-003: Selection of BullMQ for Queue Management

## Status

Approved

## Context & Problem

Fables Flow requires a background queue system to process asynchronous, resource-heavy tasks like:

1. Parsing incoming WhatsApp chats using LLMs.
2. Transcribing audio voice messages.
3. Generating and storing PDF invoices.
4. Sending automated collections alerts and notifications.

We need a queue manager that supports job scheduling, automated retries with exponential backoffs, status visibility, and robust TypeScript integration, all with minimal infrastructure maintenance.

---

## Options Considered

### Option 1: RabbitMQ

- _Pros_: Standard message broker, supports complex routing patterns, robust integration.
- _Cons_: High deployment overhead (requires running separate RabbitMQ cluster nodes), lacks native support for scheduled jobs / delayed messages without installing external plugins.

### Option 2: Apache Kafka

- _Pros_: Incredible scale bounds, high throughput, event replay capabilities.
- _Cons_: High operational complexity to manage, steep learning curve, and over-engineered for our MVP target scales.

### Option 3: BullMQ (Redis-based)

- _Pros_:
  - Leverages Redis, which we already use for session caching and rate-limiting, reducing infrastructure dependencies.
  - Native support for job delays, cron-like scheduling, priority queues, and parent-child parent-child job flows.
  - Built-in automatic retries with custom backoff curves.
  - Excellent NestJS support via `@nestjs/bullmq` with clean TypeScript types.
- _Cons_: Queue memory size is bound by Redis RAM capacity. Requires managing Redis persistence to prevent loss of queued items during power failures.

---

## Decision

We choose **BullMQ** as our primary background queue provider.

---

## Consequences

- **Infrastructure Simplicity**: We use Upstash or local Redis to power caching, session stores, rate-limit counters, and workers, keeping operational costs low.
- **Reliable Executions**: If the LLM service experiences a rate limit exception (HTTP 429), BullMQ automatically retries the job using exponential backoff (e.g., retrying after 10s, 30s, 90s).
- **Scalability**: We can scale the background execution layer by running multiple instances of the worker package (`apps/worker`), which check out jobs from Redis in parallel.
