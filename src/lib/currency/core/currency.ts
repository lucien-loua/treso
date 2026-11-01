import type { CurrencyDefinition } from "./definition";
import { createFigureReader, hasParts } from "./figures";

/**
 * Treso stores every amount as an integer count of **hundredths** of the unit, whatever the
 * currency: 25 000 F CFA is 2 500 000, 12,50 $US is 1 250.
 */
const AMOUNT_SCALE = 100;

export interface FormatOptions {
  /** `symbol` (default) writes "25 000 F CFA"; `none` writes the figure alone. */
  display?: "none" | "symbol";
  /** `always` writes "+" before a positive amount ("−" is always written for a negative one). */
  sign?: "always" | "auto";
}

/**
 * A currency bound to a locale, built on `Intl.NumberFormat`: the only way the app writes and
 * reads an amount. Amounts are integers in hundredths of the unit.
 */
export interface Currency {
  /** ISO 4217 code */
  readonly code: string;
  /** Digits shown and accepted after the decimal separator: 0 for XOF and GNF, 2 for USD. */
  readonly decimals: number;
  /** The character the locale writes before decimals: "," in French, "." in English. */
  readonly decimalSeparator: string;
  readonly locale: string;
  /** The sign written next to an amount: the definition's, else `Intl`'s ("F CFA", "$US"). */
  readonly symbol: string;
  /**
   * The amount as people read it.
   * @example xof.format(2_500_000) → "25 000 F CFA"
   * @example xof.format(-50_000, { sign: "always" }) → "−500 F CFA"
   */
  format: (amount: number, options?: FormatOptions) => string;
  /**
   * An amount typed by a person ("25 000", "25 000 F CFA", "12,50"), in hundredths; `null` when
   * the text is not a positive amount of this currency (letters, more decimals than it has).
   */
  parse: (text: string) => number | null;
  /** The figure to prefill a field with, rounded to the currency's decimals: 125_050 → "1250,5" in French. */
  toInput: (amount: number) => string;
}

/** Hundredths → the unit amount `Intl` formats, sign removed. */
const toMajor = (amount: number) => Math.abs(amount) / AMOUNT_SCALE;

const ONLY_ZEROS = /^0*$/u;
const WHITESPACE = /\s/gu;
const REGEXP_SPECIAL = /[$()*+.?[\\\]^{|}]/gu;

const escapeRegExp = (text: string) =>
  text.replaceAll(REGEXP_SPECIAL, String.raw`\$&`);

/** The text a formatter writes for the currency of a figure (its sign). */
const currencyText = (
  formatter: Intl.NumberFormat,
  value: number
): string | undefined => {
  if (hasParts()) {
    return formatter
      .formatToParts(value)
      .find((part) => part.type === "currency")?.value;
  }
  // The same figure without the currency: same rounding and digits
  const { locale, minimumFractionDigits, maximumFractionDigits } =
    formatter.resolvedOptions();
  const figure = new Intl.NumberFormat(locale, {
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value);
  return formatter.format(value).replace(figure, "").trim() || undefined;
};

/**
 * Builds a currency on `Intl.NumberFormat`: `Intl` lays out every figure (separators, decimals,
 * where the sign goes); the definition only overrides the sign. Formatters are made once.
 */
export const createCurrency = (
  definition: CurrencyDefinition,
  { locale }: { locale: string }
): Currency => {
  const { code } = definition;
  const intl = new Intl.NumberFormat(locale, {
    currency: code,
    style: "currency",
  });
  const decimals =
    definition.decimals ?? intl.resolvedOptions().maximumFractionDigits ?? 0;
  const intlSymbol = currencyText(intl, 0) ?? code;
  const symbol = definition.symbol ?? intlSymbol;
  const digits = {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  };
  const withSymbol = new Intl.NumberFormat(locale, {
    ...digits,
    currency: code,
    style: "currency",
  });
  const figureOnly = new Intl.NumberFormat(locale, digits);
  // What a person would type: no grouping, decimals only when there are some ("1250,5")
  const inputFigure = new Intl.NumberFormat(locale, {
    maximumFractionDigits: decimals,
    useGrouping: false,
  });
  const figures = createFigureReader(locale);
  const { decimalSeparator } = figures;
  let signsPattern: RegExp | undefined;

  /** Intl places the sign and its spacing; only the sign's text may change. */
  const formatWithSymbol = (value: number) => {
    const text = withSymbol.format(value);
    return symbol === intlSymbol ? text : text.replace(intlSymbol, symbol);
  };

  return Object.freeze({
    code,
    decimalSeparator,
    decimals,
    format(amount: number, options: FormatOptions = {}) {
      const { display = "symbol", sign = "auto" } = options;
      const value = toMajor(amount);
      const text =
        display === "none" ? figureOnly.format(value) : formatWithSymbol(value);
      if (amount < 0) {
        return `−${text}`;
      }
      return amount > 0 && sign === "always" ? `+${text}` : text;
    },
    locale,
    parse(text: string) {
      signsPattern ??= new RegExp(
        [...new Set([symbol, intlSymbol, code])]
          .map((sign) => sign.replaceAll(WHITESPACE, ""))
          // Longest first, so "F CFA" is removed whole before "F"
          .sort((a, b) => b.length - a.length)
          .map(escapeRegExp)
          .join("|"),
        "giu"
      );
      const figure = figures.read(
        text.replaceAll(WHITESPACE, "").replaceAll(signsPattern, "")
      );
      if (figure === null) {
        return null;
      }
      const [whole = "", fraction = ""] = figure.split(".");
      if (!ONLY_ZEROS.test(fraction.slice(decimals))) {
        return null;
      }
      const amount = Math.round(
        Number(`${whole}.${fraction || "0"}`) * AMOUNT_SCALE
      );
      return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
    },
    symbol,
    toInput: (amount: number) => inputFigure.format(toMajor(amount)),
  });
};
