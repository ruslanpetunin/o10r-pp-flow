import type { PaymentMethod } from 'orchestrator-pp-payment-method';
import type { Api, EventManager } from 'orchestrator-pp-core';
import type { ContextManager } from './../types/context';
import type { EventMap } from './../types/event';
import type { PaymentStatusManager } from './../types/paymentStatus';

export default function(
  api: Api,
  contextManager: ContextManager,
  eventManager: EventManager<EventMap>,
  paymentStatusManager: PaymentStatusManager
) {
  const pay = async (method: PaymentMethod) => {
    try {
      const context = contextManager.getContext();
      const collectedData = method.getCollectedData();

      await api.pay(context.token, collectedData);

      eventManager.emit('pay', context);

      await paymentStatusManager.request();
    } catch (error) {
      console.error('Error collecting payment data:', error);

      throw new Error('Failed to collect payment data.');
    }
  }

  return {
    pay
  };
}
