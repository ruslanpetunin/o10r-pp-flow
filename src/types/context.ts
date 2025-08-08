import type { InitData, PaymentStatusData } from 'o10r-pp-core';

export interface ContextManager {
  getContext: () => Readonly<Context>,

  setPaymentStatusData: (data: PaymentStatusData) => void,
  setInitData: (data: InitData) => void,
  setToken: (token: string) => void,
}

export interface Context {
  token: string,
  amount: number,
  paymentId: string,
  paymentDescription?: string,
  currency: string,
  projectHash: string,
  hasSavedCards: boolean,
  paymentStatus: PaymentStatusData,
}
