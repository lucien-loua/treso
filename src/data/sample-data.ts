import { toISODate } from "@/utils/dates";

import type { TransactionInput } from "./types";

type Template = Omit<TransactionInput, "date" | "icon" | "color"> & {
  day: number;
};

// One typical month, replayed over the current month and the two before it.
const month: Template[] = [
  {
    amountCents: 245_000,
    categoryId: "salary",
    day: 1,
    note: "Salaire",
    type: "income",
  },
  {
    amountCents: 75_000,
    categoryId: "housing",
    day: 2,
    note: "Loyer",
    type: "expense",
  },
  {
    amountCents: 6420,
    categoryId: "groceries",
    day: 3,
    note: "Supermarché",
    type: "expense",
  },
  {
    amountCents: 1599,
    categoryId: "subscriptions",
    day: 5,
    note: "Musique",
    type: "expense",
  },
  {
    amountCents: 3200,
    categoryId: "restaurants",
    day: 6,
    note: "Dîner entre amis",
    type: "expense",
  },
  {
    amountCents: 7500,
    categoryId: "transport",
    day: 8,
    note: "Pass transport",
    type: "expense",
  },
  {
    amountCents: 8990,
    categoryId: "bills",
    day: 10,
    note: "Électricité",
    type: "expense",
  },
  {
    amountCents: 4875,
    categoryId: "groceries",
    day: 12,
    note: "Marché",
    type: "expense",
  },
  {
    amountCents: 40_000,
    categoryId: "freelance",
    day: 14,
    note: "Mission design",
    type: "income",
  },
  {
    amountCents: 5990,
    categoryId: "shopping",
    day: 15,
    note: "Chaussures",
    type: "expense",
  },
  {
    amountCents: 2500,
    categoryId: "health",
    day: 17,
    note: "Pharmacie",
    type: "expense",
  },
  {
    amountCents: 1850,
    categoryId: "leisure",
    day: 19,
    note: "Cinéma",
    type: "expense",
  },
  {
    amountCents: 5730,
    categoryId: "groceries",
    day: 21,
    note: "Supermarché",
    type: "expense",
  },
  {
    amountCents: 2990,
    categoryId: "bills",
    day: 24,
    note: "Internet",
    type: "expense",
  },
  {
    amountCents: 1450,
    categoryId: "restaurants",
    day: 26,
    note: "Déjeuner",
    type: "expense",
  },
];

// Template amounts are written in dollars; scale them so francs get realistic figures.
const scale: Record<string, { factor: number; roundTo: number }> = {
  GNF: { factor: 8600, roundTo: 100_000 },
  USD: { factor: 1, roundTo: 1 },
  XOF: { factor: 600, roundTo: 10_000 },
};

export const buildSampleTransactions = (
  currency: string,
  today = new Date()
): TransactionInput[] => {
  const { factor, roundTo } = scale[currency] ?? scale.USD;
  const result: TransactionInput[] = [];
  for (let offset = 2; offset >= 0; offset -= 1) {
    const year = today.getFullYear();
    const monthIndex = today.getMonth() - offset;
    for (const { day, ...rest } of month) {
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
      });
    }
  }
  return result;
};
