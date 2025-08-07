import type { Flow } from './../types/flow';
import type { EventMap } from './../types/event';
import useContextManager from './useContextManager';
import { useEventManager, useApi } from 'o10r-pp-core';
import type { PaymentMethodFactory } from 'o10r-pp-payment-method';
import useInit from './../features/useInit';
import usePay from './../features/usePay';
import useClarify from './../features/useClarify';
import useStatusManager from './useStatusManager';
import usePaymentMethodManager from './usePaymentMethodManager';

export default function(apiHost: string, paymentMethodFactory?: PaymentMethodFactory): Flow {
  const api = useApi(apiHost);
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

    init,
    remove,
    pay,
    clarify,

    on,
    off
  };
}
