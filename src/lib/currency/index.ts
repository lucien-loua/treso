/**
 * Money for Treso: `createCurrencies(locale)` resolves the currency chosen in
 * Settings (see `useMoney`). Screens go through a `Currency`, never through a code, symbol or
 * number of decimals written by hand.
 */
export { createCurrencies } from "./config";
export type { Currency, FormatOptions } from "./core/currency";
export type { CurrencyDefinition } from "./core/definition";
export type { CurrencyRegistry } from "./core/registry";
