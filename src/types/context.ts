import type { InitData, ProjectSettings as ProjectSettingsBase } from 'orchestrator-pp-core';
import type { PaymentMethod } from './method';

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

export type ProjectSettings = Omit<ProjectSettingsBase, 'methods'> & { methods: PaymentMethod[] };
