import type { Currency } from "@/lib/currency";

const NOT_A_FIGURE = /[^\d.,]/gu;
const SEPARATORS = /[.,]/gu;
/** Up to hundreds of billions: enough for francs, short of float rounding. */
const MAX_WHOLE_DIGITS = 12;

/**
 * Keeps digits and, when the currency has cents, one decimal separator (the locale's, whichever
 * the keyboard typed) with at most the currency's decimals. Without cents, separators are
 * thousands: "25,000" stays twenty-five thousand.
 */
export const sanitizeAmount = (text: string, money: Currency) => {
  const figure = text.replaceAll(NOT_A_FIGURE, "");
  if (money.decimals === 0) {
    return figure.replaceAll(SEPARATORS, "").slice(0, MAX_WHOLE_DIGITS);
  }
  const [whole, ...fraction] = figure.split(SEPARATORS);
  const integer = whole.slice(0, MAX_WHOLE_DIGITS);
  if (fraction.length === 0) {
    return integer;
  }
  return `${integer || "0"}${money.decimalSeparator}${fraction.join("").slice(0, money.decimals)}`;
};
