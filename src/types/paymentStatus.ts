import type { PaymentStatusData } from 'o10r-pp-core';

export interface PaymentStatusManager {
  request: () => Promise<PaymentStatusData>;
}
