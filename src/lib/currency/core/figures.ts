const DECIMAL = /^\d+(?:\.\d+)?$/u;
const WHITESPACE = /\s/gu;
const WHITESPACE_ONLY = /^\s*$/u;
const DIGIT_RUN = /\d/gu;

/**
 * Does the engine split a formatted figure into parts? Hermes, React Native's engine, has
 * `Intl.NumberFormat` without `formatToParts`: the parts are then read back from `format`.
 */
export const hasParts = () =>
  typeof Intl.NumberFormat.prototype.formatToParts === "function";

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

/** Reads the figures people type in a locale. */
export interface FigureReader {
  /** The character the locale writes before decimals: "," in French, "." in English. */
  readonly decimalSeparator: string;
  /**
   * A typed figure as a plain decimal ("1 234,5" → "1234.5"), `null` when it isn't one.
   * Spaces and the locale's thousands separator are dropped ("25,000" is twenty-five thousand in
   * English); either decimal separator is accepted when the locale doesn't group with it.
   */
  read: (text: string) => string | null;
}

export const createFigureReader = (locale: string): FigureReader => {
  const decimalSeparator = decimalSeparatorOf(locale);
  const groupSeparator = groupSeparatorOf(locale);
  return Object.freeze({
    decimalSeparator,
    read(text: string) {
      let figure = text.replaceAll(WHITESPACE, "");
      if (groupSeparator) {
        figure = figure.replaceAll(groupSeparator, "");
      }
      figure = figure.replaceAll(decimalSeparator, ".").replaceAll(",", ".");
      return DECIMAL.test(figure) ? figure : null;
    },
  });
};

/** Plain numbers (rates, quantities) written and read in a locale. */
export interface Numbers {
  /**
   * 2 decimals from 1 up, 4 below, so small rates stay readable.
   * @example format(8848.1819) → "8 848,18" (fr) · "8,848.18" (en) · format(0.892533) → "0,8925"
   */
  format: (value: number) => string;
  /** The figure to prefill a field with, without grouping: "8848,18" */
  toInput: (value: number) => string;
  /** A positive number typed in the locale ("585,46", "8 848.18"), `null` otherwise. */
  parse: (text: string) => number | null;
}

/** Up to 4 decimals: enough for any exchange rate quoted against the dollar. */
const MAX_DECIMALS = 4;
/** Above 1, 2 decimals are all a reader needs. */
const READ_DECIMALS = 2;

export const createNumbers = (locale: string): Numbers => {
  const reader = createFigureReader(locale);
  const small = new Intl.NumberFormat(locale, {
    maximumFractionDigits: MAX_DECIMALS,
  });
  const large = new Intl.NumberFormat(locale, {
    maximumFractionDigits: READ_DECIMALS,
  });
  const plain = new Intl.NumberFormat(locale, {
    maximumFractionDigits: MAX_DECIMALS,
    useGrouping: false,
  });
  return Object.freeze({
    format: (value: number) =>
      (Math.abs(value) >= 1 ? large : small).format(value),
    parse(text: string) {
      const figure = reader.read(text);
      const value = figure === null ? 0 : Number(figure);
      return Number.isFinite(value) && value > 0 ? value : null;
    },
    toInput: (value: number) => plain.format(value),
  });
};
