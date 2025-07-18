import type { Flow } from './../types/flow';
import type { EventMap } from './../types/event';
import useContextManager from './useContextManager';
import { useEventManager, useApi } from 'orchestrator-pp-core';
import type { PaymentMethodFactory } from 'orchestrator-pp-payment-method';
import useInit from './../features/useInit';
import usePay from './../features/usePay';
import useStatusManager from './useStatusManager';

export default function(apiHost: string, paymentMethodFactory: PaymentMethodFactory): Flow {
  const api = useApi(apiHost);
  const eventManager = useEventManager<EventMap>();
  const contextManager= useContextManager();
  const paymentStatusManager = useStatusManager(api, contextManager, eventManager);

  const context = contextManager.getContext();
  const { translator, paymentMethods, init } = useInit(api, contextManager,eventManager, paymentStatusManager, paymentMethodFactory);
  const { pay } = usePay(api, contextManager, eventManager, paymentStatusManager);

  const { on, off } = eventManager;

  return {
    context,

    paymentMethods,
    translator,

    init,
    pay,

    on,
    off
  };
}
