import type { ProjectSettingsData } from 'orchestrator-pp-core';
import type { PaymentMethod } from 'orchestrator-pp-payment-method';

export interface PaymentMethodManager {
  list: PaymentMethod[],
  load: (projectSettings: ProjectSettingsData) => Promise<void>,
  remove: (method: PaymentMethod) => Promise<void>,
}
