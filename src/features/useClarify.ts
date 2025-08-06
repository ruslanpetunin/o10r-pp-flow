import { type Api, PaymentStatus } from 'orchestrator-pp-core';
import type { ContextManager } from './../types/context';
import { useForm } from 'orchestrator-pp-payment-method';

export default function(api: Api, contextManager: ContextManager) {
  const context = contextManager.getContext();

  const clarify = async (data: Record<string, unknown>) => {
    if (context.paymentStatus.status === PaymentStatus.AWAITING_CLARIFICATION) {
      const { validate } = useForm(context.paymentStatus.clarification_fields);

      const validationResult = await validate(data);

      if (validationResult.isValid) {
        try {
          await api.clarify(context.token, data);

          return;
        } catch {
          console.error('Error sending clarification data');

          throw new Error('Failed to send clarification data.');
        }
      }

      console.error('Clarification data is not valid:', validationResult.errors);

      throw new Error('Clarification data is not valid');
    }

    throw new Error('Payment status is not awaiting clarification');
  }

  return {
    clarify
  };
}
