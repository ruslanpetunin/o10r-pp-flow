import type { InitData, PaymentStatusData } from 'o10r-pp-core';

export interface ContextManager {
  getContext: () => Readonly<Context>,

  setPaymentStatusData: (data: PaymentStatusData) => void,
  setInitData: (data: InitData) => void,
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
