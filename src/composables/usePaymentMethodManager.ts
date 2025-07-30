import type { PaymentMethod, PaymentMethodFactory } from 'orchestrator-pp-payment-method';
import type { Api, EventManager, ProjectSettingsData } from 'orchestrator-pp-core';
import type { ContextManager } from './../types/context';
import useBasePaymentMethodFactory, { isSavedCardPaymentMethod } from 'orchestrator-pp-payment-method';
import type { EventMap } from './../types/event';
import type { PaymentMethodManager } from './../types/paymentMethod';

export default function(
  api: Api,
  contextManager: ContextManager,
  eventManager: EventManager<EventMap>,
  paymentMethodFactory?: PaymentMethodFactory
): PaymentMethodManager {
  const context = contextManager.getContext();
  const list: PaymentMethod[] = [];

  async function load(projectSettings: ProjectSettingsData) {
    const pmFactory = paymentMethodFactory || useBasePaymentMethodFactory(api, context.token);

    list.push(
      ...await Promise.all(
        projectSettings.methods.map(config => pmFactory.fromConfig(config))
      )
    );

    eventManager.emit('paymentMethodsChanged', context);

    if (context.hasSavedCards) {
      // We don`t wait it. We emit an event instead. It allows us to render the page much faster
      api.getSavedCards(context.token)
        .then(
          async (cards) => {
            list.unshift(
              ...await Promise.all(
                cards.map(card => pmFactory.fromSavedCard(card))
              )
            );

            eventManager.emit('paymentMethodsChanged', context);
          }
        )
    }
  }

  async function remove(method: PaymentMethod) {
    const index = list.findIndex(m => m.id === method.id);

    if (index !== -1) {
      const removedMethod = list.splice(index, 1)[0];

      eventManager.emit('paymentMethodsChanged', context);

      if (isSavedCardPaymentMethod(removedMethod)) {
        await removedMethod.onRemove();
      }
    }
  }

  return {
    list,
    load,
    remove
  }
}
