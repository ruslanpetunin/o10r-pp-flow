import type { Context, ContextManager } from '../types/context';
import type { PaymentStatusData, SessionData } from 'o10r-pp-core';
import { PaymentStatus, PaymentMode } from 'o10r-pp-core';

export default function() {
  const context: Context = {
    sid: '',
    payment: {
      amount: 0,
      currency: '',
      paymentId: '',
      mode: PaymentMode.PAYMENT
    },
    customer: {},
    consent: [],
    redirect: {},
    options: {},
    paymentStatus: {
      status: PaymentStatus.NOT_STARTED,
      payment: {
        status: PaymentStatus.NOT_STARTED,
        method_code: undefined
      }
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
      context.payment = data.payment;
      context.customer = data.customer;
      context.consent = data.consent;
      context.options = data.options;
      context.redirect = data.redirect;
    },
    setSid: (sid: string) => {
      context.sid = sid;
    },
  };

  return contextManager;
}
