import type { Context, ContextStorage, ContextManager } from '../types/context';
import type { InitData } from 'orchestrator-pp-core';
import type { ProjectSettings } from '../types/context';

export default function() {
  const storage: ContextStorage = {};

  const contextManager: ContextManager = {
    setInitData: (data: InitData) => {
      storage.initData = data;
    },
    setProjectSettings: (settings: ProjectSettings) => {
      storage.projectSettings = settings;
    },
    setToken: (token: string) => {
      storage.token = token;
    },
  };

  const context: Context = {
    getAmount: () => storage.initData?.amount || 0,
    getCurrency: () => storage.initData?.currency || '',
    getProjectHash: () => storage.initData?.project_hash || '',
    getProjectSettings: () => storage.projectSettings || { methods: []},
    getToken: () => storage.token || '',
  };

  return {
    context,
    contextManager,
  };
}
