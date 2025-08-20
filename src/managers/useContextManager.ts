import type { Context, ContextManager } from '../types/context';
import type { PaymentStatusData, SessionData } from 'o10r-pp-core';
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
    setSessionData: (data: SessionData) => {
      context.amount = data.details.amount;
      context.currency = data.details.currency;
      context.paymentId = data.details.paymentId;
      context.paymentDescription = data.details.paymentDescription;
      context.customerId = data.details.customerId;
    },
    setSid: (sid: string) => {
      context.sid = sid;
    },
  };

  return contextManager;
}
