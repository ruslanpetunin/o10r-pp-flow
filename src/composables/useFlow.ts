import type { Flow } from './../types/flow';
import type { EventMap } from './../types/event';
import useContext from './useContext';
import { useEventManager, useJwtToken, useApi } from 'orchestrator-pp-core';

export default function(apiHost: string): Flow {
  const { context, contextManager } = useContext();
  const { on, off, emit } = useEventManager<EventMap>();
  const { getProjectSettings } = useApi(apiHost);

  const init = async (token: string) => {
    const initData = useJwtToken(token);
    const projectSettings = await getProjectSettings(initData.project_hash);

    contextManager.setInitData(initData);
    contextManager.setProjectSettings(projectSettings);
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
