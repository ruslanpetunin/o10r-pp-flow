import type { SessionData, PaymentStatusData } from 'o10r-pp-core';

export interface ContextManager {
  getContext: () => Readonly<Context>,

  setPaymentStatusData: (data: PaymentStatusData) => void,
  setSessionData: (data: SessionData) => void,
  setSid: (sid: string) => void,
}

export interface Context {
  sid: string,
  amount: number,
  paymentId: string,
  paymentDescription?: string,
  currency: string,
  customerId?: number,
  paymentStatus: PaymentStatusData,
}
