import { expect, test } from "bun:test";

import {
  createCurrencies,
  createExchange,
  createNumbers,
} from "@/lib/currency";
import { plainSpaces } from "@/test/helpers";

const currency = (locale: string, code: string) => {
  const found = createCurrencies(locale).find(code);
  if (!found) {
    throw new Error(`Unknown currency: ${code}`);
  }
  return found;
};

const xofFr = currency("fr-FR", "XOF");
const xofEn = currency("en-US", "XOF");
const gnfFr = currency("fr-FR", "GNF");
const usdFr = currency("fr-FR", "USD");
const usdEn = currency("en-US", "USD");

test.each([
  ["XOF in French", xofFr.format(2_500_000), "25 000 F CFA"],
  ["XOF in English", xofEn.format(2_500_000), "F CFA 25,000"],
  ["a negative amount", xofFr.format(-50_000), "−500 F CFA"],
  [
    "an explicit plus",
    xofFr.format(147_000_000, { sign: "always" }),
    "+1 470 000 F CFA",
  ],
  ["the figure alone", xofFr.format(2_500_000, { display: "none" }), "25 000"],
  ["GNF with its short symbol", gnfFr.format(10_000_000), "100 000 FG"],
  ["USD in French", usdFr.format(123_450), "1 234,50 $US"],
  ["USD in English", usdEn.format(123_450), "$1,234.50"],
])("formats %s", (_name, written, expected) => {
  expect(plainSpaces(written)).toBe(expected);
});

test("describes each currency", () => {
  expect(plainSpaces(xofFr.symbol)).toBe("F CFA");
  expect(xofFr.decimals).toBe(0);
  expect(usdFr.decimalSeparator).toBe(",");
  expect(usdEn.decimalSeparator).toBe(".");
  expect(createCurrencies("fr-FR").default.code).toBe("XOF");
});

test.each([
  ["grouped figures", xofFr, "25 000", 2_500_000],
  ["figures with the symbol", xofFr, "25 000 F CFA", 2_500_000],
  ["the English form of XOF", xofEn, "F CFA 25,000", 2_500_000],
  ["a French decimal", usdFr, "12,5", 1250],
  ["a dot in French", usdFr, "12.5", 1250],
  ["an English decimal", usdEn, "1234.50", 123_450],
  ["English thousands", usdEn, "25,000", 2_500_000],
  ["English thousands and decimals", usdEn, "1,234.50", 123_450],
])("parses %s", (_name, money, text, cents) => {
  expect(money.parse(text)).toBe(cents);
});

test.each([
  ["decimals on a currency without any", xofFr, "12,5"],
  ["three decimals", usdFr, "1,234"],
  ["letters", xofFr, "abc"],
])("refuses %s", (_name, money, text) => {
  expect(money.parse(text)).toBeNull();
});

test.each([
  ["XOF in French", xofFr, 2_500_000],
  ["XOF in English", xofEn, 2_500_000],
  ["USD in French", usdFr, 123_450],
  ["USD in English", usdEn, 123_450],
])("reads back what it wrote: %s", (_name, money, cents) => {
  expect(money.parse(money.format(cents))).toBe(cents);
});

test.each([
  ["USD in French", usdFr, 125_050, "1250,5"],
  ["USD in English", usdEn, 125_050, "1250.5"],
  ["no grouping", usdEn, 12_345_678, "123456.78"],
  ["XOF, rounded down to its unit", xofFr, 2_500_123, "25001"],
])("prefills an input: %s", (_name, money, cents, text) => {
  expect(money.toInput(cents)).toBe(text);
});

const XOF_PER_USD = 585.463;
const GNF_PER_USD = 8848.18;
const exchange = createExchange({
  base: "USD",
  date: "2026-11-01",
  rates: { GNF: GNF_PER_USD, USD: 1, XOF: XOF_PER_USD },
});

test("converts between currencies", () => {
  expect(exchange.convert(100, "USD", "XOF")).toBe(58_546);
  expect(exchange.convert(2_500_000, "XOF", "USD")).toBe(4270);
  expect(exchange.convert(100_000, "XOF", "GNF")).toBe(
    Math.round((100_000 * GNF_PER_USD) / XOF_PER_USD)
  );
  expect(exchange.rate("usd", "xof")).toBe(XOF_PER_USD);
});

test("leaves an amount in its own currency untouched", () => {
  expect(exchange.convert(123_457, "XOF", "XOF")).toBe(123_457);
});

test("stays close after a round trip", () => {
  const dollars = exchange.convert(2_500_000, "XOF", "USD");
  const back = exchange.convert(dollars, "USD", "XOF");
  expect(Math.abs(back - 2_500_000)).toBeLessThan(1000);
});

test("refuses a currency without a rate", () => {
  expect(() => exchange.convert(100, "XOF", "EUR")).toThrow();
});

const numbersFr = createNumbers("fr-FR");
const numbersEn = createNumbers("en-US");

test("writes plain numbers per locale", () => {
  expect(plainSpaces(numbersFr.format(8848.18))).toBe("8 848,18");
  expect(numbersEn.format(8848.18)).toBe("8,848.18");
  expect(numbersFr.format(0.892533)).toBe("0,8925");
  expect(numbersFr.toInput(8848.18)).toBe("8848,18");
});

test("reads plain numbers per locale", () => {
  expect(numbersFr.parse("585,46")).toBe(585.46);
  expect(numbersFr.parse("585.46")).toBe(585.46);
  expect(numbersEn.parse("8,848.18")).toBe(8848.18);
  expect(numbersFr.parse("0")).toBeNull();
  expect(numbersFr.parse("abc")).toBeNull();
});
