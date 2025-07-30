import type { PaymentStatusData } from 'orchestrator-pp-core';

export interface PaymentStatusManager {
  request: () => Promise<PaymentStatusData>;
}
