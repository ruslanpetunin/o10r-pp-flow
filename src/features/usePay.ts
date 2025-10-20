import type { PaymentMethod } from 'o10r-pp-payment-method';
import type { Api, EventManager, PayFields, FingerprintData } from 'o10r-pp-core';
import type { ContextManager, Context } from './../types/context';
import type { EventMap } from './../types/event';
import type { PaymentStatusManager } from './../types/paymentStatus';
import { useBillingFields, useCustomerFields, useShippingFields, useConsentFields } from "o10r-pp-core";

function getPayFields(context: Context, method: PaymentMethod, additionalData: Record<string, unknown>): PayFields {
  const customerFieldsNames = useCustomerFields().map(field => field.name);
  const billingFieldsNames = useBillingFields().map(field => field.name);
  const shippingFieldsNames = useShippingFields().map(field => field.name);
  const consentFieldsNames = useConsentFields(context.consent).map(field => field.name);

  const collectedData = Object.assign(method.getCollectedData(), additionalData);
  const result: PayFields = { method: {}, customer: {} };

  for (const [key, value] of Object.entries(collectedData)) {
    if (customerFieldsNames.includes(key)) {
      result.customer[key.replace(/^customer\_/, '')] = value;
    } else if (billingFieldsNames.includes(key)) {
      result.billing = result.billing || {};
      result.billing[key.replace(/^billing\_/, '')] = value;
    } else if (shippingFieldsNames.includes(key)) {
      result.shipping = result.shipping || {};
      result.shipping[key.replace(/^shipping\_/, '')] = value;
    } else if (!consentFieldsNames.includes(key)) {
      result.method[key] = value;
    }
  }

  return result;
}

async function getFingerprintData(): Promise<FingerprintData> {
  const FingerprintJS = await import('@fingerprintjs/fingerprintjs');
  const agent = await FingerprintJS.load();
  const data = await agent.get();
  const result: FingerprintData = {
    params: {},
    hash: data.visitorId
  };

  for (const [key, value] of Object.entries(data.components)) {
    if ('value' in value) {
      result.params[key] = value.value;
    }
  }

  return result;
}

export default function(
  api: Api,
  contextManager: ContextManager,
  eventManager: EventManager<EventMap>,
  paymentStatusManager: PaymentStatusManager
) {
  const pay = async (method: PaymentMethod, additionalData: Record<string, unknown>) => {
    try {
      const context = contextManager.getContext();
      const payFields = getPayFields(context, method, additionalData);
      const fingerprintData = await getFingerprintData();

      await api.pay(context.sid, method.code, fingerprintData, payFields);

      eventManager.emit('pay', context);

      await paymentStatusManager.request();
    } catch (error) {
      console.error('Error collecting payment data:', error);

      throw new Error('Failed to collect payment data.');
    }
  }

  return {
    pay
  };
}
