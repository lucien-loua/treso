import { useLocales } from "expo-localization";
import type { ReactNode } from "react";

import { I18nContext } from "./context";
import { i18nFor } from "./i18n";

/**
 * Follows the phone's languages: change them in the system settings and the whole app, texts,
 * dates and amounts, switches without a restart.
 */
export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const locales = useLocales();
  return <I18nContext value={i18nFor(locales)}>{children}</I18nContext>;
};
