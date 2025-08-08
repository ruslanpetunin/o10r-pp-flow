import type { EventManager, Translator, Formatter } from 'o10r-pp-core';
import type { PaymentMethod } from 'o10r-pp-payment-method';
import type { EventMap } from './event';
import type { Context } from './context';

export interface Flow extends Omit<EventManager<EventMap>, 'emit'> {
  context: Readonly<Context>;

  paymentMethods: PaymentMethod[];
  translator: Translator,
  formatter: Formatter,

  init: (token: string) => Promise<void>;
  remove: (method: PaymentMethod) => Promise<void>;
  pay: (method: PaymentMethod) => Promise<void>;
  clarify: (data: Record<string, unknown>) => Promise<void>;
}
