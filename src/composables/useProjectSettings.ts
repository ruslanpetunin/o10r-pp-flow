import type { PaymentMethodFactory } from 'orchestrator-pp-payment-method';
import type { Api, InitData } from 'orchestrator-pp-core';
import type { ProjectSettings } from '../types/context';

export default async function(api: Api, initData: InitData, paymentMethodFactory: PaymentMethodFactory): Promise<ProjectSettings> {
  const projectSettings = await api.getProjectSettings(initData.project_hash);
  const methods = await paymentMethodFactory(initData, projectSettings);

    return { ...projectSettings, methods };
}
