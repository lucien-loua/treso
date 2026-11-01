/** How many units of each currency one unit of `base` bought on `date`. */
export interface ExchangeRates {
  /** ISO code every rate is quoted against, e.g. "USD" */
  readonly base: string;
  /** Day the rates were published, `YYYY-MM-DD` */
  readonly date: string;
  /** Units per one `base`, by ISO code; `base` itself is 1 */
  readonly rates: Readonly<Record<string, number>>;
}

/** Converts amounts between currencies at one day's rates. */
export interface Exchange {
  /** Day of the rates, `YYYY-MM-DD` */
  readonly date: string;
  /** Units of `to` one unit of `from` buys, `undefined` when either rate is unknown. */
  rate: (from: string, to: string) => number | undefined;
  /**
   * An amount in hundredths of `from`, in hundredths of `to`. Unchanged when both are the
   * same currency, so an amount never drifts in its own currency.
   * @example convert(100, "USD", "XOF") → 58_546 (1 $US → 585,46 F CFA)
   */
  convert: (amount: number, from: string, to: string) => number;
}

/** Builds conversions on one set of rates. Throws on an unknown currency: a missing rate is a bug. */
export const createExchange = ({
  base,
  date,
  rates,
}: ExchangeRates): Exchange => {
  const perBase = (code: string) => {
    const upper = code.toUpperCase();
    return upper === base.toUpperCase() ? 1 : rates[upper];
  };
  const rate = (from: string, to: string) => {
    const fromRate = perBase(from);
    const toRate = perBase(to);
    return fromRate && toRate ? toRate / fromRate : undefined;
  };
  return Object.freeze({
    convert(amount: number, from: string, to: string) {
      if (from.toUpperCase() === to.toUpperCase()) {
        return amount;
      }
      const factor = rate(from, to);
      if (factor === undefined) {
        throw new RangeError(`No exchange rate from ${from} to ${to}`);
      }
      return Math.round(amount * factor);
    },
    date,
    rate,
  });
};
