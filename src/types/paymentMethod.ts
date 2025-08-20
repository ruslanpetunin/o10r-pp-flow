import type { PaymentMethodData } from 'o10r-pp-core';
import type { PaymentMethod } from 'o10r-pp-payment-method';

export interface PaymentMethodManager {
  list: PaymentMethod[],
  load: (paymentMethodsData: PaymentMethodData[]) => Promise<void>,
  remove: (method: PaymentMethod) => Promise<void>,
}
