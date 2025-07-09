import type { EventManager } from 'orchestrator-pp-core';
import type { EventMap } from './event';
import type { Context } from './context';

export interface Flow extends Omit<EventManager<EventMap>, 'emit'>{
  context: Context;

  init: (token: string) => Promise<void>;
  pay: (data: unknown) => Promise<void>;
}
