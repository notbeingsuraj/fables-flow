# Fables Flow --- Plugin & Extension Architecture

To avoid code bloat when matching custom distributor workflows (e.g., specialized pricing deals, regional tax exceptions, or specific legacy API formats), Fables Flow implements a **Plugin and Hook Extension Architecture**.

---

## 1. Architectural Concept

The system defines **Extension Points** (lifecycle hooks) throughout the backend modules. External plugins or dynamic configuration modules register callbacks against these extension points.

```text
Core Operations ──────► Invoke Extension Hook (e.g., 'invoice.calculate_tax')
                              │
                              ▼
                       Plugin Manager ──(Resolve Configured Hooks)──┐
                              │                                      │
                              ▼                                      ▼
                      [Default Tax Engine]                   [Custom Cess Plugin]
                              │                                      │
                              └─────────────────┬────────────────────┘
                                                ▼
                                    Return Modified Payload
```

---

## 2. Supported Extension Hooks

### 1. Invoice Formatting (`invoice.format_number`)

- **Use Case**: Distributors using specific legal prefixes (`INV-2026-XXXX`) or financial year divisions.
- **Parameters**: `orgId: string, seq: number`
- **Output**: `formattedNumber: string`

### 2. Pricing Engine (`order.calculate_discount`)

- **Use Case**: Supporting custom discounts like volume discounts, buy-one-get-one schemes, or specific retailer discounts.
- **Parameters**: `order: OrderData, customer: RetailerData`
- **Output**: `lineItemDiscounts: Array<{ itemId: string, discount: Decimal }>`

### 3. Collection Rules (`collection.reminder_schedule`)

- **Use Case**: Custom frequency of messages based on retailer segment risk scores.
- **Parameters**: `invoice: InvoiceData`
- **Output**: `schedule: Array<{ offsetDays: number, channel: 'WHATSAPP' | 'SMS' }>`

### 4. Custom Taxation (`tax.calculate_levy`)

- **Use Case**: Municipal entry fees, agricultural marketing tax (mandi cess), or green tax.
- **Parameters**: `items: OrderItemData[]`
- **Output**: `taxLines: Array<{ name: string, rate: Decimal, amount: Decimal }>`

---

## 3. Implementation Blueprint (NestJS Interceptor Hooks)

```typescript
export interface PluginHook<TInput = any, TOutput = any> {
  hookName: string;
  execute(input: TInput, context: OrganizationContext): Promise<TOutput>;
}

@Injectable()
export class PluginManager {
  private hooks = new Map<string, PluginHook[]>();

  registerHook(hook: PluginHook) {
    const existing = this.hooks.get(hook.hookName) || [];
    existing.push(hook);
    this.hooks.set(hook.hookName, existing);
  }

  async runPipeline<TInput = any>(
    hookName: string,
    initialInput: TInput,
    context: OrganizationContext,
  ): Promise<TInput> {
    const registered = this.hooks.get(hookName);
    if (!registered || registered.length === 0) {
      return initialInput;
    }

    let payload = initialInput;
    for (const hook of registered) {
      payload = await hook.execute(payload, context);
    }
    return payload;
  }
}
```

---

## 4. Example: Custom Discount Plugin

A plugin that checks if the buyer has purchased at least 100 cases of a product in the last 30 days and applies a custom $5\%$ discount:

```typescript
@Injectable()
export class VolumeDiscountPlugin implements PluginHook {
  hookName = 'order.calculate_discount';

  constructor(private db: PrismaService) {}

  async execute(input: OrderInput, context: OrganizationContext): Promise<OrderInput> {
    const thresholdCount = await this.db.orderItem.aggregate({
      where: {
        order: { retailerId: input.retailerId, status: 'DELIVERED' },
        productId: 'target-item-id',
      },
      _sum: { quantity: true },
    });

    if (thresholdCount._sum.quantity >= 100) {
      input.items = input.items.map((item) => {
        if (item.productId === 'target-item-id') {
          item.price = item.price.mul(0.95); // Apply 5% discount
        }
        return item;
      });
    }

    return input;
  }
}
```
