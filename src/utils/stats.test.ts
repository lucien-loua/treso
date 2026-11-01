import { expect, test } from "bun:test";

import type { AmountOf } from "@/data/entries";
import type { Transaction } from "@/data/types";
import { createExchange } from "@/lib/currency";
import { summarizeMonth } from "@/utils/stats";

const asRecorded: AmountOf = ({ amountCents }) => amountCents;

const entry = (changes: Partial<Transaction>): Transaction => ({
  amountCents: 1000,
  categoryId: "groceries",
  color: null,
  createdAt: 0,
  currency: "XOF",
  date: "2026-11-10",
  icon: null,
  id: 1,
  note: "",
  scheduleId: null,
  settlesDue: null,
  type: "expense",
  ...changes,
});

test("adds up the month's income and expenses", () => {
  const summary = summarizeMonth(
    [
      entry({ amountCents: 50_000, categoryId: "salary", type: "income" }),
      entry({ amountCents: 1000 }),
      entry({ amountCents: 2000 }),
    ],
    "2026-11",
    asRecorded
  );
  expect(summary.incomeCents).toBe(50_000);
  expect(summary.expenseCents).toBe(3000);
  expect(summary.balanceCents).toBe(47_000);
});

test("carries earlier months over, and ignores later ones", () => {
  const summary = summarizeMonth(
    [
      entry({
        amountCents: 10_000,
        categoryId: "salary",
        date: "2026-09-30",
        type: "income",
      }),
      entry({ amountCents: 4000, date: "2026-10-31" }),
      entry({ amountCents: 1000, date: "2026-11-01" }),
      entry({ amountCents: 9999, date: "2026-12-01" }),
    ],
    "2026-11",
    asRecorded
  );
  expect(summary.openingCents).toBe(6000);
  expect(summary.expenseCents).toBe(1000);
  expect(summary.closingCents).toBe(5000);
  expect(summary.transactions).toHaveLength(1);
});

test("ranks categories by spending, with their share", () => {
  const { expensesByCategory } = summarizeMonth(
    [
      entry({ amountCents: 1000, categoryId: "transport" }),
      entry({ amountCents: 3000, categoryId: "housing" }),
    ],
    "2026-11",
    asRecorded
  );
  expect(expensesByCategory).toEqual([
    { categoryId: "housing", share: 0.75, totalCents: 3000 },
    { categoryId: "transport", share: 0.25, totalCents: 1000 },
  ]);
});

test("gives no share when nothing was spent", () => {
  const summary = summarizeMonth([], "2026-11", asRecorded);
  expect(summary.expensesByCategory).toEqual([]);
  expect(summary.closingCents).toBe(0);
});

test("converts before adding up amounts in different currencies", () => {
  const exchange = createExchange({
    base: "USD",
    date: "2026-11-01",
    rates: { USD: 1, XOF: 600 },
  });
  const inXof: AmountOf = ({ amountCents, currency }) =>
    exchange.convert(amountCents, currency, "XOF");
  const summary = summarizeMonth(
    [
      entry({ amountCents: 100, currency: "USD" }),
      entry({ amountCents: 40_000, currency: "XOF" }),
    ],
    "2026-11",
    inXof
  );
  expect(summary.expenseCents).toBe(100_000);
});
