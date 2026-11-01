/**
 * Money for Treso: `createCurrencies(locale)` resolves the currency chosen in Settings (see
 * `useMoney`), `createExchange(rates)` converts between currencies. Screens go through a
 * `Currency`, never through a code, symbol or number of decimals written by hand.
 */
export {
  createCurrencies,
  CURRENCY_CODES,
  DEFAULT_CURRENCY_CODE,
} from "./config";
export type { Currency, FormatOptions } from "./core/currency";
export type { CurrencyDefinition } from "./core/definition";
export { createExchange } from "./core/exchange";
export { createNumbers } from "./core/figures";
export type { Numbers } from "./core/figures";
export type { Exchange, ExchangeRates } from "./core/exchange";
export type { CurrencyRegistry } from "./core/registry";
