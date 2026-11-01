import type { Messages } from "@/i18n/messages/fr";
import { toISODate } from "@/lib/datetime";

import type { TransactionInput } from "./types";

type SampleName = keyof Messages["samples"]["names"];

type Template = Omit<TransactionInput, "date" | "icon" | "color" | "note"> & {
  day: number;
  name: SampleName;
};

// One typical month, replayed over the current month and the two before it.
const month: Template[] = [
  {
    amountCents: 245_000,
    categoryId: "salary",
    day: 1,
    name: "salary",
    type: "income",
  },
  {
    amountCents: 75_000,
    categoryId: "housing",
    day: 2,
    name: "rent",
    type: "expense",
  },
  {
    amountCents: 6420,
    categoryId: "groceries",
    day: 3,
    name: "supermarket",
    type: "expense",
  },
  {
    amountCents: 1599,
    categoryId: "subscriptions",
    day: 5,
    name: "music",
    type: "expense",
  },
  {
    amountCents: 3200,
    categoryId: "restaurants",
    day: 6,
    name: "dinner",
    type: "expense",
  },
  {
    amountCents: 7500,
    categoryId: "transport",
    day: 8,
    name: "transportPass",
    type: "expense",
  },
  {
    amountCents: 8990,
    categoryId: "bills",
    day: 10,
    name: "electricity",
    type: "expense",
  },
  {
    amountCents: 4875,
    categoryId: "groceries",
    day: 12,
    name: "market",
    type: "expense",
  },
  {
    amountCents: 40_000,
    categoryId: "freelance",
    day: 14,
    name: "freelance",
    type: "income",
  },
  {
    amountCents: 5990,
    categoryId: "shopping",
    day: 15,
    name: "shoes",
    type: "expense",
  },
  {
    amountCents: 2500,
    categoryId: "health",
    day: 17,
    name: "pharmacy",
    type: "expense",
  },
  {
    amountCents: 1850,
    categoryId: "leisure",
    day: 19,
    name: "cinema",
    type: "expense",
  },
  {
    amountCents: 5730,
    categoryId: "groceries",
    day: 21,
    name: "supermarket",
    type: "expense",
  },
  {
    amountCents: 2990,
    categoryId: "bills",
    day: 24,
    name: "internet",
    type: "expense",
  },
  {
    amountCents: 1450,
    categoryId: "restaurants",
    day: 26,
    name: "lunch",
    type: "expense",
  },
];

// Template amounts are written in dollars; scale them so francs get realistic figures.
const scale: Record<string, { factor: number; roundTo: number }> = {
  GNF: { factor: 8600, roundTo: 100_000 },
  USD: { factor: 1, roundTo: 1 },
  XOF: { factor: 600, roundTo: 10_000 },
};

/** Three months of transactions in `currency`, named in the app's language (`names`). */
export const buildSampleTransactions = (
  currency: string,
  names: Messages["samples"]["names"],
  today = new Date()
): TransactionInput[] => {
  const { factor, roundTo } = scale[currency] ?? scale.USD;
  const result: TransactionInput[] = [];
  for (let offset = 2; offset >= 0; offset -= 1) {
    const year = today.getFullYear();
    const monthIndex = today.getMonth() - offset;
    for (const { day, name, ...rest } of month) {
      const date = new Date(year, monthIndex, day);
      if (date > today) {
        continue;
      }
      // Vary amounts a little from month to month so the charts look alive.
      const jitter =
        rest.type === "expense" && rest.categoryId !== "housing"
          ? 1 + (offset - 1) * 0.12
          : 1;
      const amountCents = Math.max(
        roundTo,
        Math.round((rest.amountCents * jitter * factor) / roundTo) * roundTo
      );
      result.push({
        ...rest,
        amountCents,
        color: null,
        date: toISODate(date),
        icon: null,
        note: names[name],
      });
    }
  }
  return result;
};
