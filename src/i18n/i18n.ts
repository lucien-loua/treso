import { createCurrencies } from "@/lib/currency";
import type { CurrencyRegistry } from "@/lib/currency";
import { createDateTexts } from "@/lib/datetime";
import type { DateTexts } from "@/lib/datetime";

import { en } from "./messages/en";
import { fr } from "./messages/fr";
import type { Messages } from "./messages/fr";

const MESSAGES = { en, fr } satisfies Record<string, Messages>;

/** The languages Treso is written in. Adding one is adding its `messages/<code>.ts` here. */
export type Language = keyof typeof MESSAGES;

/** Spoken when none of the phone's languages is one of Treso's. */
const FALLBACK_LANGUAGE: Language = "en";

/** Everything a screen needs to speak the phone's language, made once per locale. */
export interface I18n {
  language: Language;
  /** BCP 47 locale every figure and date is written in, e.g. "fr-CI" or "en-US". */
  locale: string;
  /** The texts of `language` */
  t: Messages;
  /** Dates in `locale`: months, days, "in 3 days"… */
  dates: DateTexts;
  /** The offered currencies, writing amounts in `locale` */
  currencies: CurrencyRegistry;
  /** @example percent(0.42) → "42 %" (fr) · "42%" (en) */
  percent: (ratio: number) => string;
}

/** What `expo-localization` tells about one of the phone's languages. */
interface DeviceLocale {
  languageCode: string | null;
  languageTag: string;
}

const isLanguage = (code: string | null): code is Language =>
  code !== null && Object.hasOwn(MESSAGES, code);

/** A tag `Intl` accepts; an odd one from the system falls back to the bare language. */
const isUsableLocale = (tag: string) => {
  try {
    return new Intl.NumberFormat(tag).resolvedOptions().locale.length > 0;
  } catch {
    return false;
  }
};

/**
 * The first of the phone's languages, in the order of its settings, that Treso speaks, with that
 * entry's region ("fr-CI" writes figures the Ivorian way). English when none is.
 */
const pickLocale = (
  locales: readonly DeviceLocale[]
): { language: Language; locale: string } => {
  for (const { languageCode, languageTag } of locales) {
    const code = languageCode?.toLowerCase() ?? null;
    if (isLanguage(code)) {
      return {
        language: code,
        locale: isUsableLocale(languageTag) ? languageTag : code,
      };
    }
  }
  return { language: FALLBACK_LANGUAGE, locale: FALLBACK_LANGUAGE };
};

const cache = new Map<string, I18n>();

/** The `I18n` of the phone's languages; the same object while they don't change. */
export const i18nFor = (locales: readonly DeviceLocale[]): I18n => {
  const { language, locale } = pickLocale(locales);
  const key = `${language}|${locale}`;
  let i18n = cache.get(key);
  if (!i18n) {
    const percent = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
      style: "percent",
    });
    i18n = Object.freeze({
      currencies: createCurrencies(locale),
      dates: createDateTexts(locale),
      language,
      locale,
      percent: (ratio: number) => percent.format(ratio),
      t: MESSAGES[language],
    });
    cache.set(key, i18n);
  }
  return i18n;
};
