import type { Context } from './context';

export type EventMap = {
  init: (context: Context) => void;
};
