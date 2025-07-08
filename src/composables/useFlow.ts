import type { Flow } from './../types/flow';
import type { EventMap } from './../types/event';
import useContext from './useContext';
import { useEventManager, useJwtToken, useApi } from 'orchestrator-pp-core';
import type { PaymentMethodFactory } from './../types/method';

export default function(apiHost: string, paymentMethodFactory: PaymentMethodFactory): Flow {
  const { context, contextManager } = useContext();
  const { on, off, emit } = useEventManager<EventMap>();
  const { getProjectSettings } = useApi(apiHost);

  const init = async (token: string) => {
    const initData = useJwtToken(token);
    const projectSettings = await getProjectSettings(initData.project_hash);
    const paymentMethods = await paymentMethodFactory(initData, projectSettings);

    contextManager.setInitData(initData);
    contextManager.setProjectSettings({...projectSettings, methods: paymentMethods });
    contextManager.setToken(token);

    emit('init', context);
  }

  async function pay(data: unknown): Promise<void> {
    if (!data) {
      throw new Error('No data provided for payment.');
    }

    console.log('Processing payment with data:', data);
  }

  return {
    context,

    init,
    pay,

    on,
    off,
    emit
  };
}
