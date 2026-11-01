import type { CurrencyDefinition } from "./definition";

/**
 * Treso stores every amount as an integer count of **hundredths** of the unit, whatever the
 * currency: 25 000 F CFA is 2 500 000. Switching the currency in Settings then never rescales
 * what was recorded.
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
  /** The figure to prefill a field with: 125_050 → "1250,5" in French. */
  toInput: (amount: number) => string;
}

/** Hundredths → the unit amount `Intl` formats, sign removed. */
const toMajor = (amount: number) => Math.abs(amount) / AMOUNT_SCALE;

const DECIMAL = /^\d+(?:\.\d+)?$/u;
const ONLY_ZEROS = /^0*$/u;
const WHITESPACE = /\s/gu;
const WHITESPACE_ONLY = /^\s*$/u;
const DIGIT_RUN = /\d/gu;
const REGEXP_SPECIAL = /[$()*+.?[\\\]^{|}]/gu;

const escapeRegExp = (text: string) =>
  text.replaceAll(REGEXP_SPECIAL, String.raw`\$&`);

/**
 * Does the engine split a formatted figure into parts? Hermes, React Native's engine, has
 * `Intl.NumberFormat` without `formatToParts`: the parts are then read back from `format`.
 */
const hasParts = () =>
  typeof Intl.NumberFormat.prototype.formatToParts === "function";

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

/** The decimal separator the locale writes figures with, read once from `Intl`. */
const decimalSeparatorOf = (locale: string) => {
  const formatter = new Intl.NumberFormat(locale);
  if (!hasParts()) {
    // "1,5": the separator is the character before the last digit
    return formatter.format(1.5).at(-2) ?? ".";
  }
  return (
    formatter.formatToParts(1.5).find((part) => part.type === "decimal")
      ?.value ?? "."
  );
};

/**
 * The thousands separator the locale writes, read once from `Intl`: "," in English, a space in
 * French (spaces are dropped anyway). `undefined` when the locale groups with a space or not at all.
 */
const groupSeparatorOf = (locale: string) => {
  const formatter = new Intl.NumberFormat(locale);
  // Without parts, "1,000" minus its digits leaves the separator
  const separator = hasParts()
    ? formatter.formatToParts(1000).find((part) => part.type === "group")?.value
    : formatter.format(1000).replaceAll(DIGIT_RUN, "");
  return separator && !WHITESPACE_ONLY.test(separator) ? separator : undefined;
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
  const decimalSeparator = decimalSeparatorOf(locale);
  const groupSeparator = groupSeparatorOf(locale);
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
      let figure = text.replaceAll(WHITESPACE, "").replaceAll(signsPattern, "");
      if (groupSeparator) {
        // "25,000" is twenty-five thousand in English
        figure = figure.replaceAll(groupSeparator, "");
      }
      // People type either decimal separator when the locale doesn't group with it
      figure = figure.replaceAll(decimalSeparator, ".").replaceAll(",", ".");
      if (!DECIMAL.test(figure)) {
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
    toInput: (amount: number) =>
      String(amount / AMOUNT_SCALE).replace(".", decimalSeparator),
  });
};
