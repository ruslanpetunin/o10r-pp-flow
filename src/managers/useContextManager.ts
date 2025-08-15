import type { Context, ContextManager } from '../types/context';
import type { InitData, PaymentStatusData } from 'o10r-pp-core';
import { PaymentStatus } from 'o10r-pp-core';

export default function() {
  const context: Context = {
    sid: '',
    amount: 0,
    currency: '',
    paymentId: '',
    paymentStatus: {
      status: PaymentStatus.NOT_STARTED,
    }
  };

  const readonlyContext: Readonly<Context> = new Proxy(
    context,
    {
      set() {
        throw new Error('Cannot modify context directly');
      },
      deleteProperty() {
        throw new Error('Cannot delete properties directly');
      }
    }
  );

  const contextManager: ContextManager = {
    getContext: () => readonlyContext,

    setPaymentStatusData: (data: PaymentStatusData) => {
      context.paymentStatus = data;
    },
    setInitData: (data: InitData) => {
      context.amount = data.payment.amount;
      context.currency = data.payment.currency;
      context.paymentId = data.payment.id;
      context.paymentDescription = data.payment.description;
      context.customerId = data.payment.customer_id;
    },
    setSid: (sid: string) => {
      context.sid = sid;
    },
  };

  return contextManager;
}
