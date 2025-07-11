import type { EventManager } from 'orchestrator-pp-core';
import type { EventMap } from './event';
import type { Context } from './context';
import type { Translator } from './translator';

export interface Flow extends Omit<EventManager<EventMap>, 'emit'> {
  context: Context;
  translator: Translator,

  init: (token: string) => Promise<void>;
  pay: (data: unknown) => Promise<void>;
}
