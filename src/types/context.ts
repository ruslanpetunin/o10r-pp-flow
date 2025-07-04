import type { InitData } from 'orchestrator-pp-core'

export interface ContextStorage {
  initData?: InitData;
  token?: string;
}

export interface ContextManager {
  setInitData: (token: string, data: InitData) => void,
}

export interface Context {
  getAmount: () => number,
  getCurrency: () => string,
  getProjectHash: () => string,
  getToken: () => string,
}
