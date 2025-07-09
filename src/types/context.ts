import type { InitData, ProjectSettings } from 'orchestrator-pp-core';

export interface ContextStorage {
  initData?: InitData,
  projectSettings?: ProjectSettings,
  token?: string,
}

export interface ContextManager {
  setInitData: (data: InitData) => void,
  setProjectSettings: (settings: ProjectSettings) => void,
  setToken: (token: string) => void,
}

export interface Context {
  getAmount: () => number,
  getCurrency: () => string,
  getProjectHash: () => string,
  getProjectSettings: () => ProjectSettings,
  getToken: () => string,
}
