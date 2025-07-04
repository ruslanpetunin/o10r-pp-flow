import type { Flow } from './../types/flow';
import type { EventMap } from './../types/event';
import useContext from './useContext';
import { useEventManager, useJwtToken } from 'orchestrator-pp-core';

export default function(): Flow {
  const { context, contextManager } = useContext();
  const { on, off, emit } = useEventManager<EventMap>();

  const init = async (token: string) => {
    const initData = useJwtToken(token);

    contextManager.setInitData(token, initData);

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
