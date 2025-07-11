import type { Context } from './context';
import type { TranslationEventMap } from 'orchestrator-pp-core';

export type EventMap = {
  init: (context: Context) => void;
} & TranslationEventMap;
