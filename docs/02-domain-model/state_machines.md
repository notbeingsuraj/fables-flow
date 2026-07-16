# Fables Flow --- Domain Workflows & State Machines

This document defines the strict states, valid transitions, and invariants for all major operational entities in Fables Flow.

---

## 1. Order State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT : WhatsApp Input / Sales Rep Input
    DRAFT --> PENDING_REVIEW : Low confidence match / manual hold
    DRAFT --> APPROVED : Confirm order (Credit limit checked)
    PENDING_REVIEW --> APPROVED : Admin / Accountant approval
    APPROVED --> STOCK_RESERVED : System reserves FIFO batches
    STOCK_RESERVED --> PICKING : Generate picking list
    PICKING --> PACKED : Verify items, pack in crates
    PACKED --> DISPATCHED : Assign vehicle & transit route
    DISPATCHED --> DELIVERED : Handoff to retailer (Logs invoice trigger)
    DELIVERED --> COMPLETED : Invoiced and payment cleared

    DRAFT --> CANCELLED
    PENDING_REVIEW --> CANCELLED
    APPROVED --> CANCELLED : Release stock reservations
    STOCK_RESERVED --> CANCELLED : Release stock reservations
    PICKING --> CANCELLED : Return items to original bins
    PACKED --> CANCELLED : Return items to original bins
    DISPATCHED --> CANCELLED : Process returns/adjustments
```

### Invariants & Rules

- **Approved**: Triggers credit limit checks. If outstanding + order value > limit, state defaults to `PENDING_REVIEW` with tag `CREDIT_BLOCK`.
- **Stock Reserved**: Inserts reservation entries in the `StockLedger`.
- **Cancelled**: Releasing reservations is mandatory. If cancelled after packing, items must be re-added to inventory bins using a `TRANSFER_IN` ledger type.

---

## 2. Invoice State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Triggered by Order Dispatch
    DRAFT --> SENT : Export PDF & Send to WhatsApp
    SENT --> PARTIALLY_PAID : Allocation of partial payment
    SENT --> PAID : Full payment allocation
    PARTIALLY_PAID --> PAID : Full payment allocation
    SENT --> OVERDUE : Chronological time > Due date
    PARTIALLY_PAID --> OVERDUE : Chronological time > Due date

    DRAFT --> CANCELLED
    SENT --> CANCELLED : Must issue matching Credit Note
    OVERDUE --> CANCELLED : Must issue matching Credit Note
```

### Invariants & Rules

- **Draft**: GST (CGST, SGST, IGST) values are calculated.
- **Sent**: The record becomes **immutable**. Direct database edits are blocked; adjustments require a credit/debit note.
- **Paid**: Triggers check on corresponding Order state to transition it to `Completed` if all linked invoices are paid.

---

## 3. Payment State Machine

```mermaid
stateDiagram-v2
    [*] --> RECORDED : Collector logs cash/UPI/cheque
    RECORDED --> VERIFIED : Accountant reconciles UTR / cash amount
    VERIFIED --> CLEARED : Bank clearance (for cheques / transfers)
    RECORDED --> REJECTED : Cheque bounce / invalid UTR reference
    VERIFIED --> REJECTED : Clearance error
```

### Invariants & Rules

- **Recorded**: Unallocated amount is set to total amount.
- **Verified**: Generates ledger journal entries in the double-entry accounting system.
- **Rejected**: Removes payment allocation rows and recalculates linked invoice balances. Emits alert event `PaymentReboundAlert`.

---

## 4. Collection Task State Machine

```mermaid
stateDiagram-v2
    [*] --> ASSIGNED : Overdue invoice alert / Manual assign
    ASSIGNED --> OUT_FOR_COLLECTION : Agent route start
    OUT_FOR_COLLECTION --> COMPLETED : Payment recorded
    OUT_FOR_COLLECTION --> DISPUTED : Retailer claims error / goods return
    DISPUTED --> ASSIGNED : Dispute resolved (Requires accountant audit)
```

### Invariants & Rules

- **Assigned**: Task assigned to a Collector role for a specific territory.
- **Completed**: Triggers payment recording event.

---

## 5. Purchase Order (PO) State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Creator draft
    DRAFT --> SENT : Transmitted to Supplier
    SENT --> PARTIALLY_RECEIVED : First GRN received
    SENT --> COMPLETED : Full stock received
    PARTIALLY_RECEIVED --> COMPLETED : Final GRN received
    SENT --> CANCELLED
```

---

## 6. Goods Received Note (GRN) State Machine

```mermaid
stateDiagram-v2
    [*] --> RECEIVED : Stock arrives at bay
    RECEIVED --> INSPECTING : Quality checks & batch allocation
    INSPECTING --> APPROVED : Verified and added to stock ledger
    INSPECTING --> REJECTED : Returns generated for failed items
```

### Invariants & Rules

- **Approved**: Triggers creation of `StockBatch` and registers addition entries in the `StockLedger`. Writes Journal Entry (Debit Inventory Asset, Credit AP Accrual).

---

## 7. Return & Credit Note State Machine

```mermaid
stateDiagram-v2
    [*] --> REQUESTED : Claim registered (breakage/shortage)
    REQUESTED --> INSPECTING : Physical verification at warehouse
    INSPECTING --> APPROVED : Credit Note approved
    APPROVED --> POSTED : Applied to Customer Ledger
    REQUESTED --> REJECTED : Discrepancy invalid
```

### Invariants & Rules

- **Posted**: Triggers Journal Entry (Debit Sales Returns, Debit GST Payable, Credit Accounts Receivable) and automatically updates the corresponding Retailer Ledger balance.
