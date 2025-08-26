import { PaymentStatus } from 'o10r-pp-core';
import type { Api, EventManager, PaymentStatusData } from 'o10r-pp-core';
import type { EventMap } from './../types/event';
import type { ContextManager } from './../types/context';
import type { PaymentStatusManager, StatusChangeChecker } from './../types/paymentStatus';

const customChangeCheckers: StatusChangeChecker[] = [];

function hasChanges(newPaymentStatusData: PaymentStatusData, oldPaymentStatusData?: PaymentStatusData): boolean {
  let customCheckResult = true;

  for (const customCheck of customChangeCheckers) {
    customCheckResult = customCheckResult && customCheck(newPaymentStatusData, oldPaymentStatusData);
  }

  if (
    oldPaymentStatusData?.status === PaymentStatus.AWAITING_3DS_RESULT
    && newPaymentStatusData.status === PaymentStatus.AWAITING_3DS_RESULT
  ) {
    return customCheckResult &&  JSON.stringify(newPaymentStatusData.acs) !== JSON.stringify(oldPaymentStatusData.acs);
  }

  return customCheckResult && newPaymentStatusData.status !== oldPaymentStatusData?.status;
}

export default function(api: Api, contextManager: ContextManager, eventManager: EventManager<EventMap>): PaymentStatusManager {
  const context = contextManager.getContext();
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const request = async () => {
    const data = await api.getPaymentStatus(context.sid);

    if (hasChanges(data, context.paymentStatus)) {
      contextManager.setPaymentStatusData(data);

      eventManager.emit('statusChanged', context);
    }

    if (![PaymentStatus.NOT_STARTED, PaymentStatus.SUCCESS, PaymentStatus.FAILED].includes(data.status) && !timerId) {
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

  const setPendingTill = (check: StatusChangeChecker) => {
    // set pending status if check returns true till it returns false
    const realCheck: StatusChangeChecker = (newStatus, oldStatus) => {
      if (check(newStatus, oldStatus)) {
        if (oldStatus?.status !== PaymentStatus.PENDING) {
          const data: PaymentStatusData = {
            status: PaymentStatus.PENDING,
            payment: {
              status: PaymentStatus.PENDING,
              method_code: undefined
            }
          };

          contextManager.setPaymentStatusData(data);
          eventManager.emit('statusChanged', context);
        }

        return false;
      }

      return true;
    };

    realCheck(context.paymentStatus, context.paymentStatus);
    customChangeCheckers.push(realCheck);
  }

  return {
    request,
    setPendingTill
  };
}
