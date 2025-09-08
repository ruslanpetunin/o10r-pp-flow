import {
  Language,
  useTranslator,
  useCookies,
  PaymentStatus
} from 'o10r-pp-core';
import type { Api, EventManager, Translator } from 'o10r-pp-core';
import type { ContextManager } from './../types/context';
import type { EventMap } from './../types/event';
import type { PaymentStatusManager } from './../types/paymentStatus';
import type { PaymentMethodManager } from './../types/paymentMethod';

const languageCookieKey = 'opp_language';
const cookies = useCookies();

function isLanguage(value: string): value is Language {
  return Object.values(Language).includes(value as Language);
}

function getDefaultLanguage(): Language {
  const languageFromCookie = cookies.get(languageCookieKey) || '';

  if (isLanguage(languageFromCookie)) {
    return languageFromCookie;
  }

  const browserLanguages = (navigator.languages || [navigator.language] || []) as string[];

  for (const language of browserLanguages) {
    const short = language.split('-')[0].toLowerCase(); // normalize: "en-US" → "en"

    if (isLanguage(short)) {
      return short;
    }
  }

  return Language.EN;
}

function makeTranslator(api: Api, eventManager: EventManager<EventMap>): Translator {
  const translator = useTranslator(api);

  translator.on(
    'languageChanged',
    (lang) => {
      cookies.set(languageCookieKey, lang, { expires: 1 });
      eventManager.emit('languageChanged', lang);
    }
  );

  return translator;
}

async function askPaymentStatus(
  paymentStatusManager: PaymentStatusManager,
  eventManager: EventManager<EventMap>,
  sid: string
) {
  const alreadyStartedKey = `opp_started`;

  // we wait for payment status result only if we know that user has already started payment
  if (cookies.get(alreadyStartedKey) === sid) {
    await paymentStatusManager.request();
  } else {
    eventManager.on(
      'statusChanged',
      (context) => {
        if (context.paymentStatus.status !== PaymentStatus.NOT_STARTED) {
          cookies.set(alreadyStartedKey, sid, { expires: 1 });
        }
      }
    );

    paymentStatusManager.request().then(() => {});
  }
}

export default function(
  api: Api,
  contextManager: ContextManager,
  eventManager: EventManager<EventMap>,
  paymentStatusManager: PaymentStatusManager,
  paymentMethodManager: PaymentMethodManager
) {
  const context = contextManager.getContext();
  const translator = makeTranslator(api, eventManager);

  const init = async (sid: string) => {
    try {
      const [ sessionData ] = await Promise.all([
        api.getSession(sid),
        translator.setLanguage(getDefaultLanguage())
      ]);

      contextManager.setSessionData(sessionData);
      contextManager.setSid(sid);

      await Promise.all([
        paymentMethodManager.load(sessionData.methods),
        askPaymentStatus(paymentStatusManager, eventManager, sid)
      ]);

      eventManager.emit('init', context);
    } catch (e) {
      const error = new Error('Failed to initialize flow');

      eventManager.emit('error', context, error);

      console.error(e);

      throw error;
    }
  }

  return {
    translator,

    init
  };
}
