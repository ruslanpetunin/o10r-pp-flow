import type { InitData, PaymentMethodField, ProjectSettings } from 'orchestrator-pp-core';

export type PaymentMethodFactory = (initData: InitData, projectSettings: ProjectSettings) => Promise<PaymentMethod[]>;

export interface PaymentMethod {
  code: string,
  icon: string,
  paymentForm: PaymentForm,
  onRemove?: () => Promise<void>,
}

export interface PaymentForm {
  fields: PaymentMethodField[],
  onSubmit?: (data: Record<string, unknown>) => Promise<void>,
}
