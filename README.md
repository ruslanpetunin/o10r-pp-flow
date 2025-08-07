# o10r-pp-flow

`o10r-pp-flow` is a TypeScript library for building payment pages. It provides a single flow object with the methods, data and events required to initialize the payment context, handle user input and finalize the transaction.

---

## 📦 Installation

```bash
npm install o10r-pp-flow
```

> Requires **Node.js v24+**

---

## 🚀 Usage

### Create a flow

```ts
import PPFlow from 'o10r-pp-flow';
import paymentMethodFactory from '...';

const apiHost = 'https://example.com';
const flow = PPFlow(apiHost, paymentMethodFactory);
```

### Subscribe to events

```ts
flow.on('init', (ctx) => console.log('Initialized', ctx));
flow.on('statusChanged', (ctx) => console.log('Status', ctx.paymentStatus.status));
flow.on('paymentMethodsChanged', () => console.log('Methods', flow.paymentMethods));
flow.on('languageChanged', (lang) => console.log('Language', lang));
```

### Initialize the flow

```ts
const jwtToken = '...';
await flow.init(jwtToken);
```

`init` loads project settings, payment methods and payment status. You may also call `flow.init(jwtToken)` without awaiting and react to the `init` event.

### Access the context

```ts
console.log(flow.context.amount);
console.log(flow.context.currency);
```

The context object is populated after `init` and is emitted with every event handler.

### Work with payment methods

```ts
const method = flow.paymentMethods[0];

// Remove a saved payment method
await flow.remove(method);
```

Listen to `paymentMethodsChanged` to track updates to the `paymentMethods` array.

### Change language

```ts
import { Language } from 'o10r-pp-core';

await flow.translator.setLanguage(Language.FR);
console.log(flow.translator.t('PAY'));
```

### Pay

```ts
const method = flow.paymentMethods[0];
// Collect payment data using method's own API if needed
await flow.pay(method);
```

After `pay`, the latest payment status is requested automatically and emitted via `statusChanged`.

### Clarify additional data

```ts
import { PaymentStatus } from 'o10r-pp-core';

if (flow.context.paymentStatus.status === PaymentStatus.AWAITING_CLARIFICATION) {
  await flow.clarify({ code: '123456' });
}
```

---

See the exported `Flow`, `Context`, `EventMap` and payment method types for complete type information.

