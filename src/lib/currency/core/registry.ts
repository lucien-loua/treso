import { createCurrency } from "./currency";
import type { Currency } from "./currency";
import type { CurrencyDefinition } from "./definition";

export interface CurrencyRegistryOptions {
  /** The currencies accepted, each once */
  currencies: readonly CurrencyDefinition[];
  /** The code of the currency used when nothing says otherwise */
  defaultCode: string;
  /** BCP 47 locale every currency of the registry writes its figures in */
  locale: string;
}

/** The currencies an application accepts, resolved by their code. */
export interface CurrencyRegistry {
  /** Every accepted currency, the default first */
  readonly all: readonly Currency[];
  /** The currency used when nothing says otherwise */
  readonly default: Currency;
  /** The currency of a code, in any case; `undefined` when it is not accepted. */
  find: (code: string | null | undefined) => Currency | undefined;
  /** Whether a code names an accepted currency, in any case. */
  has: (code: string | null | undefined) => boolean;
}

/**
 * Resolves currencies by code, each built once. Refuses a code listed twice and a default that
 * is not listed: a configuration mistake fails at startup.
 */
export const createCurrencyRegistry = ({
  currencies,
  defaultCode,
  locale,
}: CurrencyRegistryOptions): CurrencyRegistry => {
  const byCode = new Map<string, Currency>();
  for (const definition of currencies) {
    if (byCode.has(definition.code)) {
      throw new RangeError(`Currency ${definition.code} is listed twice`);
    }
    byCode.set(definition.code, createCurrency(definition, { locale }));
  }
  const fallback = byCode.get(defaultCode.toUpperCase());
  if (!fallback) {
    throw new RangeError(
      `Default currency ${defaultCode} is not among ${[...byCode.keys()].join(", ") || "no currency"}`
    );
  }
  const find = (code: string | null | undefined) =>
    code ? byCode.get(code.toUpperCase()) : undefined;
  return Object.freeze({
    all: Object.freeze([
      fallback,
      ...[...byCode.values()].filter((currency) => currency !== fallback),
    ]),
    default: fallback,
    find,
    has: (code: string | null | undefined) => find(code) !== undefined,
  });
};
