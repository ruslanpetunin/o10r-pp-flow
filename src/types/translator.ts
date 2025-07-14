import { Language as LanguageBase } from 'orchestrator-pp-core';
import type { Translate } from 'orchestrator-pp-core';

export type Language = LanguageBase;

export interface Translator {
  translate: Translate;
  setLanguage: (lang: Language) => Promise<void>;
  getLanguage: () => Language;
}
