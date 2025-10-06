import type { PaymentMethod, PaymentMethodFactory } from 'o10r-pp-payment-method';
import type { Api, EventManager, PaymentMethodData } from 'o10r-pp-core';
import type { ContextManager, Context } from './../types/context';
import useBasePaymentMethodFactory, { isSavedCardPaymentMethod } from 'o10r-pp-payment-method';
import type { EventMap } from './../types/event';
import type { PaymentMethodManager } from './../types/paymentMethod';
import { useBillingFields } from "o10r-pp-core";

const billingFields = useBillingFields();

function makePaymentMethod(context: Context, factory: PaymentMethodFactory, config: PaymentMethodData) {
  if (context.customer.billing?.mode === 'required') {
    config.schema = [...config.schema, ...billingFields];
  }

  return factory.fromConfig(config);
}

export default function(
  api: Api,
  contextManager: ContextManager,
  eventManager: EventManager<EventMap>,
  paymentMethodFactory?: PaymentMethodFactory
): PaymentMethodManager {
  const context = contextManager.getContext();
  const list: PaymentMethod[] = [];

  async function load(paymentMethodsData: PaymentMethodData[]) {
    const pmFactory = paymentMethodFactory || useBasePaymentMethodFactory(api, context.sid);

    list.push(
      ...await Promise.all(
        paymentMethodsData.map(config => makePaymentMethod(context, pmFactory, config))
      )
    );

    eventManager.emit('paymentMethodsChanged', context);

    if (list.map(m => m.code).includes('card') && context.customer.id) {
      // We don`t wait it. We emit an event instead. It allows us to render the page much faster
      api.getSavedCards(context.sid)
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
