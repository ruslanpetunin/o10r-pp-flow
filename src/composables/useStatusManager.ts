import { PaymentStatus } from 'orchestrator-pp-core';
import type { Api, EventManager, PaymentStatusData } from 'orchestrator-pp-core';
import type { EventMap } from './../types/event';
import type { ContextManager } from './../types/context';
import type { PaymentStatusManager } from './../types/paymentStatus';

function hasChanges(newPaymentStatusData: PaymentStatusData, oldPaymentStatusData?: PaymentStatusData): boolean {
  return newPaymentStatusData.status !== oldPaymentStatusData?.status;
}

export default function(api: Api, contextManager: ContextManager, eventManager: EventManager<EventMap>): PaymentStatusManager {
  const context = contextManager.getContext();
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const request = async () => {
    const data = await api.getPaymentStatus(context.token);

    if (hasChanges(data, context.paymentStatus)) {
      contextManager.setPaymentStatusData(data);

      eventManager.emit('statusChanged', context);
    }

    if (data.status === PaymentStatus.PENDING && !timerId) {
      timerId = setTimeout(
        () => {
          if (timerId) {
            clearTimeout(timerId);
            timerId = null;
          }

          request();
        },
        2000
      );
    }

    return data;
  };

  return {
    request,
  };
}
