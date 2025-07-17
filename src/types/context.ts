import type { InitData, ProjectSettingsData } from 'orchestrator-pp-core';
import type { PaymentMethod } from 'orchestrator-pp-payment-method';

export type ProjectSettings = Omit<ProjectSettingsData, 'methods'> & { methods: PaymentMethod[] };

export interface ContextStorage {
  initData?: InitData,
  token?: string,
}

export interface ContextManager {
  setInitData: (data: InitData) => void,
  setToken: (token: string) => void,
}

export interface Context {
  getAmount: () => number,
  getCurrency: () => string,
  getProjectHash: () => string,
  getToken: () => string,
}
