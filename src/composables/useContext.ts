import type { Context, ContextStorage, ContextManager } from '../types/context';
import type { InitData } from 'orchestrator-pp-core';

export default function() {
  const storage: ContextStorage = {};

  const contextManager: ContextManager = {
    setInitData: (data: InitData) => {
      storage.initData = data;
    },
    setToken: (token: string) => {
      storage.token = token;
    },
  };

  const context: Context = {
    getAmount: () => storage.initData?.amount || 0,
    getCurrency: () => storage.initData?.currency || '',
    getProjectHash: () => storage.initData?.project_hash || '',
    getToken: () => storage.token || '',
  };

  return {
    context,
    contextManager,
  };
}
