# Fables Flow --- API Standards & Contracts

This document establishes the developer standards for API engineering at Fables Flow.

---

## 1. Request Verification & Security

- **Secure Transport**: All calls require HTTPS.
- **Session Authentication**: Bearer JWT token header or HTTP-only cookie.
- **Tenant Context**: Every call requires an active organizational validation check.

---

## 2. Idempotency Support

For payment creation, order captures, and stock adjustments, requests must support the `Idempotency-Key` header.

```text
Client Request
   │
   ▼
[Validate Idempotency-Key Header?]
   ├── (No) ──► Execute Controller Logic
   └── (Yes) ──► Query Redis (Key Cache)
                    ├── Hit? ──► Return Cached HTTP Status & Payload
                    └── Miss? ─► Lock Key ─► Execute controller ─► Save in Redis ─► Return response
```

### Redis Key Lifetime

- **Key Format**: `idempotency:{orgId}:{key}`
- **TTL**: 24 Hours.
- If a client resends a matching request before processing is complete, the server returns status `409 Conflict` with the code `REQUEST_IN_PROGRESS`.

---

## 3. Query Pagination, Sorting, & Filtering

All array endpoints must implement structured pagination wrappers to avoid memory exhaustion:

### URL Template

`GET /api/v1/orders?page=2&limit=25&sort=-totalAmount&filter[status]=PENDING_REVIEW`

### Query Parameter Schema

- `page`: Integer $\geq 1$ (default: 1).
- `limit`: Integer between 1 and 100 (default: 50).
- `sort`: Comma-separated fields. Prefix field names with `-` for descending, e.g., `sort=-createdAt,totalAmount`.
- `filter[key]=val`: Equal match operators.
- `q`: Free-text fuzzy matches (trigram index execution).

### Uniform Output Schema

```json
{
  "data": [],
  "meta": {
    "totalCount": 1500,
    "page": 2,
    "limit": 25,
    "totalPages": 60
  }
}
```

---

## 4. Rate Limiting Rules

- **Public Sandbox Webhooks (e.g., WhatsApp)**: $100\text{ req/sec}$ burst limit.
- **Transactional App APIs (Orders/Invoices)**: $20\text{ req/sec}$ per user.
- **Reporting & Export Endpoints**: $5\text{ req/min}$ per organization.

---

## 5. Standard System Error Codes

All exceptions return a structured error body to ensure the frontend can map and explain errors clearly:

```json
{
  "success": false,
  "error": {
    "code": "STOCK_RESERVATION_FAILED",
    "message": "Cannot confirm order. SKU PARLE-G-10 is out of stock in Warehouse North.",
    "details": {
      "sku": "PARLE-G-10",
      "requestedQuantity": 100,
      "availableQuantity": 12
    }
  }
}
```

### Global System Error Codes Catalog

- `UNAUTHORIZED`: Invalid or expired JWT token.
- `FORBIDDEN_PERMISSION`: Active role does not contain permissions for this endpoint.
- `CREDIT_LIMIT_EXCEEDED`: Customer outstanding balance is above credit limit.
- `DUPLICATE_PAYMENT_UTR`: UTR payment reference is already registered.
- `STOCK_BATCH_EXPIRED`: Stock allocation batch contains an expired date.
- `INVALID_GSTIN`: GSTIN validator check failed.
