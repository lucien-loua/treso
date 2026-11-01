import { createCurrencyRegistry } from "./core/registry";
import { GNF, USD, XOF } from "./currencies";

/**
 * The currencies Treso offers in Settings, and the default one. The only place a currency is
 * chosen: offering another one is adding its definition here.
 */
const OFFERED = [XOF, GNF, USD];

/** The ISO codes Treso offers, the default first. */
export const CURRENCY_CODES: readonly string[] = OFFERED.map(
  ({ code }) => code
);

/** The currency used before any choice in Settings. */
export const DEFAULT_CURRENCY_CODE = XOF.code;

/**
 * The offered currencies, writing amounts in `locale`'s conventions: "1 234,50 $US" in French,
 * "$1,234.50" in English. Made once per locale.
 */
export const createCurrencies = (locale: string) =>
  createCurrencyRegistry({
    currencies: OFFERED,
    defaultCode: DEFAULT_CURRENCY_CODE,
    locale,
  });
