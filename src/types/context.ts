import type { SessionData, PaymentStatusData, PaymentIntentData, CustomerData } from 'o10r-pp-core';

export interface ContextManager {
  getContext: () => Readonly<Context>,

  setPaymentStatusData: (data: PaymentStatusData) => void,
  setSessionData: (data: SessionData) => void,
  setSid: (sid: string) => void,
}

export interface Context {
  sid: string,
  payment: PaymentIntentData,
  customer: CustomerData,
  paymentStatus: PaymentStatusData,
}
