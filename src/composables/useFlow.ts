import type { Flow } from './../types/flow';
import type { EventMap } from './../types/event';
import useContext from './useContext';
import { useEventManager, useJwtToken, useApi, useProjectSettings, useTranslator, Language } from 'orchestrator-pp-core';
import type { PaymentMethodFactory } from 'orchestrator-pp-core';

export default function(apiHost: string, paymentMethodFactory: PaymentMethodFactory): Flow {
  const { context, contextManager } = useContext();
  const { on, off, emit } = useEventManager<EventMap>();
  const api = useApi(apiHost);
  const translator = useTranslator(api);

  translator.on(
    'languageChanged',
    (lang) => emit('languageChanged', lang)
  );

  const init = async (token: string) => {
    const initData = useJwtToken(token);
    const [ projectSettings ] = await Promise.all([
      useProjectSettings(api, initData, paymentMethodFactory),
      translator.setLanguage(Language.EN)
    ]);

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
    translator: {
      translate: translator.translate,
      getLanguage: translator.getLanguage,
      setLanguage: translator.setLanguage
    },

    init,
    pay,

    on,
    off
  };
}
