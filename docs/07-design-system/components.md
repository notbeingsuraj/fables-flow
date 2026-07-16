# Fables Flow --- Design System & Component Library

This specification documents the frontend design guidelines, layout tokens, and reusable component specs for Fables Flow.

---

## 1. Visual & Spatial Tokens

We implement an editorial, minimal UI styling focusing on high readability for heavy transactional work.

- **Spacing Grid**: Strict 8px spacing system:
  - Padding: `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px).
  - Margin: `m-2` (8px), `m-4` (16px), `m-6` (24px), `m-8` (32px).
- **Typography Hierarchy**:
  - Headers: Outfit (tracking-tight, medium/semibold).
  - Body / Form Inputs: Inter (regular, 14px, tracking-normal).
  - Numeric Tables / Codes: JetBrains Mono (monospace, tabular numbers).
- **Color Contrast System**: Accessibility levels must exceed **WCAG AA** standards:
  - Backgrounds: Dark Mode (`bg-zinc-950`), Light Mode (`bg-white`).
  - Text: High Contrast (`text-zinc-50` / `text-zinc-900`), Muted Label (`text-zinc-400` / `text-zinc-500`).
  - Borders: Sleek borders using $1\text{px}$ lines with light transparency: `border-zinc-800` (dark), `border-zinc-200` (light).

---

## 2. Core Functional Components

### 1. `LedgerTable`

Tabular view showing chronological transactions (Invoices, Payments, Credit Notes) for a specific customer.

- **Features**:
  - Monospace columns for Debit, Credit, and Running Balance.
  - Sortable columns, paginated scrolls.
  - Visual flags for unallocated payments.
  - Hover states detailing the linked audit entry.

### 2. `WhatsAppConversation`

Split pane interface that mimics a messaging screen adjacent to an editable Order form.

- **Features**:
  - Displays original chat bubble inputs from retailers.
  - Underlines parsed items. Clicking on an item highlights the respective form line.
  - Support for playing back audio transcript voice notes.

### 3. `OrderTimeline`

Vertical status path showing step events of an order.

- **Features**:
  - Tracks transitions from raw WhatsApp input up to final delivery and payment clearing.
  - Clicking a timeline node expands the details panel showing the actor, IP, timestamp, and database changes.

### 4. `AIConfidenceBadge`

Dynamic visual badge indicating accuracy levels of parsed WhatsApp data.

- **Visual Mapping**:
  - **High ($\geq 90\%$)**: Green outline with green backdrop glow (`text-emerald-400 border-emerald-500/20 bg-emerald-500/10`).
  - **Medium ($70\%\text{--}89\%$)**: Amber outline (`text-amber-400 border-amber-500/20 bg-amber-500/10`). Triggers form verification markers.
  - **Low ($< 70\%$)**: Red outline (`text-rose-400 border-rose-500/20 bg-rose-500/10`). Flags the order for manual review.

---

## 3. Keyboard Accessibility & Shortcuts

distributor employees process hundreds of invoices daily. To maximize speed, mouse movements are minimized by defining keyboard commands.

| Key Trigger             | Command Action                                   | Context                |
| :---------------------- | :----------------------------------------------- | :--------------------- |
| `Cmd + K` or `Ctrl + K` | Open global Command Palette.                     | Application scope      |
| `Esc`                   | Close modal overlays, escape focus input fields. | Application scope      |
| `Alt + A`               | Approve current parsed draft order.              | Order review workspace |
| `Alt + P`               | Route to picking list generation.                | Order details screen   |
| `Alt + I`               | Confirm packing and issue invoice.               | Order packing screen   |
| `ArrowUp` / `ArrowDown` | Navigate lists and table rows.                   | Ledger & Inboxes       |
| `/`                     | Set cursor focus on Global Search input.         | Layout Header          |
