import type { Context, ContextManager } from '../types/context';
import type { InitData, PaymentStatusData } from 'orchestrator-pp-core';
import { PaymentStatus } from 'orchestrator-pp-core';

export default function() {
  const context: Context = {
    token: '',
    amount: 0,
    currency: '',
    projectHash: '',
    hasSavedCards: false,
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
      context.amount = data.amount;
      context.currency = data.currency;
      context.projectHash = data.project_hash;
      context.hasSavedCards = data.has_saved_cards || false;
    },
    setToken: (token: string) => {
      context.token = token;
    },
  };

  return contextManager;
}
