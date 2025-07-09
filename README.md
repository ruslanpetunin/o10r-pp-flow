# orchestrator-pp-flow

`orchestrator-pp-flow` is a TypeScript library that helps you build your own payment page.

It provides a flow object with all the necessary methods, data, and events required to initialize and complete a payment process.

---

## 📦 Installation

```bash
npm install orchestrator-pp-flow
```

> Requires **Node.js v24+**

---

## ⚡️ Quick Start

### 1. Create a flow instance

To get started, create a flow instance by passing the API host and a payment method factory (implementing `PaymentMethodFactory` from [`orchestrator-pp-core`](https://github.com/ruslanpetunin/orchestrator-pp-core)):

```ts
import PPFlow from 'orchestrator-pp-flow';
import paymentMethodFactory from '...';

const apiHost = 'https://example.com';
const flow = PPFlow(apiHost, paymentMethodFactory);
```

---

### 2. Subscribe to events

You can subscribe to events at any point, but if you want to catch events emitted during initialization, subscribe before calling `init`:

```ts
flow.on('init', (context) => {
  console.log(context);
});
```

> A full list of events and their handler parameters is defined in the exported `EventMap` type.

---

### 3. Initialize the flow

Call the `init` method with a JWT token to load the payment context and project settings:

```ts
const jwtToken = '...';
await flow.init(jwtToken);
```

Or use event-based initialization:

```ts
flow.init(jwtToken);

flow.on('init', (context) => {
  console.log(context);
});
```

---

### 4. Use payment context

After initialization, you can access payment data via the flow context:

```ts
console.log(flow.context.getAmount());
```

Or from the event handler:

```ts
flow.on('init', (context) => {
  console.log(context.getAmount());
});
```

> Note: the context is only populated **after** calling `flow.init`. Accessing it before will return empty or default values (e.g., amount = 0).

A full description of context properties is available in the exported `Context` interface.

---
