/**
 * A currency as the code base declares it: its ISO 4217 code, and nothing `Intl.NumberFormat`
 * already knows. Symbol and decimals come from `Intl`; a field here only overrides it, for a
 * local usage the runtime's data does not have ("FG" for the Guinean franc, which `Intl` writes
 * "GNF"). Adding a currency is writing one of these, never a branch in the code.
 */
export interface CurrencyDefinition {
  /** ISO 4217 alphabetic code, upper case. */
  readonly code: string;
  /** Digits shown and typed after the decimal separator, when `Intl`'s don't suit. */
  readonly decimals?: number;
  /** The sign written next to an amount, when `Intl`'s does not suit. */
  readonly symbol?: string;
}

const CODE = /^[A-Z]{3}$/u;

/** ISO 4217 has no currency with more than 4 decimals. */
const MAX_DECIMALS = 4;

/**
 * Checks a definition once, where it is written, and freezes it: a typo in a code or a negative
 * number of decimals fails at startup, not on the first amount shown.
 */
export const defineCurrency = <const Definition extends CurrencyDefinition>(
  definition: Definition
): Readonly<Definition> => {
  if (!CODE.test(definition.code)) {
    throw new RangeError(
      `Currency code must be 3 upper-case letters (ISO 4217), got "${definition.code}"`
    );
  }
  const { decimals } = definition;
  if (
    decimals !== undefined &&
    (!Number.isInteger(decimals) || decimals < 0 || decimals > MAX_DECIMALS)
  ) {
    throw new RangeError(
      `${definition.code}: decimals must be an integer from 0 to ${MAX_DECIMALS}, got ${decimals}`
    );
  }
  if (definition.symbol?.trim() === "") {
    throw new RangeError(`${definition.code}: symbol cannot be blank`);
  }
  return Object.freeze({ ...definition });
};
