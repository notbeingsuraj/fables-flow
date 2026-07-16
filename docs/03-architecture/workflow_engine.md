# Fables Flow --- Workflow Engine Architecture

Instead of hardcoding order progression loops, Fables Flow implements a configurable **Workflow Engine** that defines step transitions based on organization-specific preferences. This allows distributors to toggle verification steps, credit checks, or manual approvals dynamically.

---

## 1. Engine Model & Components

A Workflow is modeled as a Directed Acyclic Graph (DAG) consisting of:

- **Steps**: Discrete task nodes (e.g., `CreditCheck`, `InventoryCheck`, `ManagerApproval`, `GenerateInvoice`, `PickingList`).
- **Transitions**: Connections between nodes matching target conditions.
- **Triggers**: Events starting execution (e.g., `OrderCreated`).
- **Actions**: Code executed during steps.

```text
[Order Ingested]
       │
       ▼
┌──────────────┐
│  CreditCheck │ ──(Passed)──┐
└──────────────┘             ▼
       │              ┌──────────────┐
    (Failed)          │InventoryCheck│
       │              └──────────────┘
       ▼                     │
┌──────────────┐          (Passed)
│ManagerApprove│             │
└──────────────┘             ▼
       │              ┌──────────────┐
   (Approved) ────────► ReserveStock │
                      └──────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │Invoice & Ship│
                      └──────────────┘
```

---

## 2. Configuration & Schema

Workflows are configured using JSON definitions. Organizations store active workflows in `organization_settings`.

```json
{
  "workflowId": "wf-standard-fmcg",
  "trigger": "order.created",
  "steps": {
    "credit_check": {
      "type": "AUTOMATED",
      "action": "checkRetailerOutstanding",
      "onSuccess": "inventory_check",
      "onFailure": "manager_approval"
    },
    "manager_approval": {
      "type": "MANUAL",
      "roleRequired": "ADMIN",
      "onSuccess": "inventory_check",
      "onFailure": "cancel_order"
    },
    "inventory_check": {
      "type": "AUTOMATED",
      "action": "verifyStockAvailability",
      "onSuccess": "reserve_stock",
      "onFailure": "pending_inventory_approval"
    },
    "reserve_stock": {
      "type": "AUTOMATED",
      "action": "createStockReservations",
      "onSuccess": "generate_invoice"
    },
    "generate_invoice": {
      "type": "AUTOMATED",
      "action": "createInvoiceDraft",
      "onSuccess": "dispatch_queue"
    }
  }
}
```

---

## 3. Core Engine Service Execution

The engine is executed as a NestJS service `WorkflowEngineService`.

```typescript
@Injectable()
export class WorkflowEngineService {
  async executeStep(context: WorkflowContext, stepName: string): Promise<void> {
    const stepConfig = context.workflow.steps[stepName];

    // Evaluate transition conditions
    const stepResult = await this.resolver.run(stepConfig.action, context);

    if (stepResult.success) {
      await this.transitionTo(context, stepConfig.onSuccess);
    } else {
      await this.transitionTo(context, stepConfig.onFailure);
    }
  }

  private async transitionTo(context: WorkflowContext, nextStep: string): Promise<void> {
    await this.db.order.update({
      where: { id: context.orderId },
      data: { workflowState: nextStep },
    });

    // Publish step event to Event Bus
    this.eventEmitter.emit(`workflow.step.${nextStep}`, context);
  }
}
```

---

## 4. Default System Workflows

1. **Standard Fast-Track (Low Risk)**:
   `OrderCreated` $\rightarrow$ `Auto Inventory Match` $\rightarrow$ `Auto Reserve` $\rightarrow$ `Invoice Draft` $\rightarrow$ `Ready to Dispatch`.
2. **Credit-Sensitive (Default kirana)**:
   `OrderCreated` $\rightarrow$ `Credit Limit Evaluator` $\rightarrow$ (If block) `Manager Overrides` $\rightarrow$ `Inventory Match` $\rightarrow$ `Reserve` $\rightarrow$ `Invoice Draft` $\rightarrow$ `Dispatch`.
3. **Restricted Inventory**:
   `OrderCreated` $\rightarrow$ `Inventory Match` $\rightarrow$ (If missing) `Purchase Order Suggestion` $\rightarrow$ `Awaiting Inward Stock` $\rightarrow$ `Reserve` $\rightarrow$ `Invoice` $\rightarrow$ `Dispatch`.
