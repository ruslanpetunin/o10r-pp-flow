import type { PaymentStatusData as PaymentStatusDataBase } from 'orchestrator-pp-core';

export interface PaymentStatusManager {
  request: () => Promise<PaymentStatusDataBase>;
}

export interface PaymentStatusData {
  isNotStarted: boolean;
  isPending: boolean;
  isFinalized: boolean;
  source: PaymentStatusDataBase
}
