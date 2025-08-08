import type { PaymentMethodFactory } from 'o10r-pp-payment-method';
import type { Flow } from './types/flow';
import { useApi, useEventManager, useFormatter } from 'o10r-pp-core';
import type { EventMap } from './types/event';
import useContextManager from './managers/useContextManager';
import useStatusManager from './managers/useStatusManager';
import usePaymentMethodManager from './managers/usePaymentMethodManager';
import useInit from './features/useInit';
import usePay from './features/usePay';
import useClarify from './features/useClarify';

export * from './types/context';
export * from './types/flow';
export * from './types/event';

export { PaymentStatus, Language } from 'o10r-pp-core';
export type * from 'o10r-pp-core';

export { isSavedCardPaymentMethod } from 'o10r-pp-payment-method';
export type * from 'o10r-pp-payment-method';

export default function(apiHost: string, paymentMethodFactory?: PaymentMethodFactory): Flow {
  const api = useApi(apiHost);
  const formatter = useFormatter();
  const eventManager = useEventManager<EventMap>();
  const contextManager= useContextManager();
  const paymentStatusManager = useStatusManager(api, contextManager, eventManager);
  const paymentMethodManager = usePaymentMethodManager(api, contextManager, eventManager, paymentMethodFactory);

  const context = contextManager.getContext();
  const { translator, init } = useInit(api, contextManager,eventManager, paymentStatusManager, paymentMethodManager);
  const { pay } = usePay(api, contextManager, eventManager, paymentStatusManager);
  const { clarify } = useClarify(api, contextManager);

  const { on, off } = eventManager;
  const { list: paymentMethods, remove } = paymentMethodManager;

  return {
    context,

    paymentMethods,
    translator,
    formatter,

    init,
    remove,
    pay,
    clarify,

    on,
    off
  };
};
