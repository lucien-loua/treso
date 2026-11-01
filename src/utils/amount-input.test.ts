import { expect, test } from "bun:test";

import { createCurrencies } from "@/lib/currency";
import { sanitizeAmount } from "@/utils/amount-input";

const currency = (locale: string, code: string) => {
  const found = createCurrencies(locale).find(code);
  if (!found) {
    throw new Error(`Unknown currency: ${code}`);
  }
  return found;
};

const xof = currency("fr-FR", "XOF");
const usdFr = currency("fr-FR", "USD");
const usdEn = currency("en-US", "USD");

test.each([
  ["a dot becomes a French comma", "12.5", usdFr, "12,5"],
  ["a comma becomes an English dot", "12,5", usdEn, "12.5"],
  ["thousands without decimals", "25,000", xof, "25000"],
  ["digits only without decimals", "25 000 F", xof, "25000"],
  ["two decimals at most", "1.239", usdEn, "1.23"],
  ["a leading separator gets its zero", ",5", usdFr, "0,5"],
])("%s", (_name, typed, money, kept) => {
  expect(sanitizeAmount(typed, money)).toBe(kept);
});

test("keeps what it can then parse", () => {
  expect(usdEn.parse(sanitizeAmount("12,5", usdEn))).toBe(1250);
});
