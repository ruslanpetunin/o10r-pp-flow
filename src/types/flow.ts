import type { EventManager } from 'orchestrator-pp-core';
import type { PaymentMethod } from 'orchestrator-pp-payment-method';
import type { EventMap } from './event';
import type { Context } from './context';
import type { Translator } from './translator';

export interface Flow extends Omit<EventManager<EventMap>, 'emit'> {
  context: Readonly<Context>;

  paymentMethods: PaymentMethod[];
  translator: Translator,

  init: (token: string) => Promise<void>;
  pay: (method: PaymentMethod) => Promise<void>;
}
