import type { PaymentStatusData } from 'o10r-pp-core';

export type StatusChangeChecker = (newPaymentStatusData: PaymentStatusData, oldPaymentStatusData?: PaymentStatusData) => boolean;

export interface PaymentStatusManager {
  request: () => Promise<PaymentStatusData>;
  setPendingTill: (check: StatusChangeChecker) => void;
}
