import type { Context } from './context';
import type { TranslationEventMap } from 'o10r-pp-core';

export type EventMap = {
  init: (context: Readonly<Context>) => void;
  pay: (context: Readonly<Context>) => void;
  statusChanged: (context: Readonly<Context>) => void;
  paymentMethodsChanged: (context: Readonly<Context>) => void;
} & TranslationEventMap;
