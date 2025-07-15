import type { Flow } from './../types/flow';
import type { EventMap } from './../types/event';
import type { Translator } from './../types/translator';
import useContext from './useContext';
import useProjectSettings from './useProjectSettings';
import {
  useEventManager,
  useJwtToken,
  useApi,
  useTranslator,
  Language
} from 'orchestrator-pp-core'
import type { PaymentMethodFactory, PaymentMethod } from 'orchestrator-pp-payment-method';
import type { Emit, Api } from 'orchestrator-pp-core';

function makeTranslator(api: Api, emit: Emit<EventMap>): Translator {
  const translator = useTranslator(api);

  translator.on(
    'languageChanged',
    (lang) => emit('languageChanged', lang)
  );

  return {
    translate: translator.translate,
    getLanguage: translator.getLanguage,
    setLanguage: translator.setLanguage
  };
}

export default function(apiHost: string, paymentMethodFactory: PaymentMethodFactory): Flow {
  const { context, contextManager } = useContext();
  const { on, off, emit } = useEventManager<EventMap>();
  const api = useApi(apiHost);
  const translator = makeTranslator(api, emit);

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

  const pay = async (method: PaymentMethod) => {
    try {
      const collectedData = await method.getCollectedData();

      console.log('Executing payment with method:', method.code);
      console.log('Collected data:', collectedData);
    } catch (error) {
      console.error('Error collecting payment data:', error);

      throw new Error('Failed to collect payment data.');
    }
  }

  return {
    context,
    translator,

    init,
    pay,

    on,
    off
  };
}
