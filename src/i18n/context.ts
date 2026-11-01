import { createContext, use } from "react";

import type { I18n } from "./i18n";

export const I18nContext = createContext<I18n | null>(null);

/** Texts, dates and currencies in the phone's language. Re-renders when the language changes. */
export const useI18n = (): I18n => {
  const i18n = use(I18nContext);
  if (!i18n) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return i18n;
};
