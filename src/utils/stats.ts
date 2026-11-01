import type { Transaction } from "@/data/types";

import type { MonthKey } from "./dates";

export interface CategoryTotal {
  categoryId: string;
  totalCents: number;
  /** Fraction of the month's expenses, 0–1. */
  share: number;
}

export interface MonthSummary {
  /** Carried over from every earlier month. */
  openingCents: number;
  incomeCents: number;
  expenseCents: number;
  /** This month only: income − expenses. */
  balanceCents: number;
  /** Running balance at the end of the month: opening + this month. */
  closingCents: number;
  expensesByCategory: CategoryTotal[];
  transactions: Transaction[];
}

export const signedCents = (transaction: Transaction) =>
  transaction.type === "income"
    ? transaction.amountCents
    : -transaction.amountCents;

export const summarizeMonth = (
  transactions: Transaction[],
  month: MonthKey
): MonthSummary => {
  const inMonth = transactions.filter((t) => t.date.startsWith(month));
  const monthStart = `${month}-01`;
  let openingCents = 0;
  let incomeCents = 0;
  let expenseCents = 0;
  const byCategory = new Map<string, number>();

  for (const t of transactions) {
    if (t.date < monthStart) {
      openingCents += signedCents(t);
    }
  }

  for (const t of inMonth) {
    if (t.type === "income") {
      incomeCents += t.amountCents;
    } else {
      expenseCents += t.amountCents;
      byCategory.set(
        t.categoryId,
        (byCategory.get(t.categoryId) ?? 0) + t.amountCents
      );
    }
  }

  const expensesByCategory = [...byCategory]
    .map(([categoryId, totalCents]) => ({
      categoryId,
      share: expenseCents > 0 ? totalCents / expenseCents : 0,
      totalCents,
    }))
    .sort((a, b) => b.totalCents - a.totalCents);

  const balanceCents = incomeCents - expenseCents;
  return {
    balanceCents,
    closingCents: openingCents + balanceCents,
    expenseCents,
    expensesByCategory,
    incomeCents,
    openingCents,
    transactions: inMonth,
  };
};

export interface DaySection {
  date: string;
  netCents: number;
  data: Transaction[];
}

/** Groups transactions (already sorted newest first) into one section per day. */
export const groupByDay = (transactions: Transaction[]): DaySection[] => {
  const sections: DaySection[] = [];
  for (const t of transactions) {
    const last = sections.at(-1);
    if (last && last.date === t.date) {
      last.data.push(t);
      last.netCents += signedCents(t);
    } else {
      sections.push({ data: [t], date: t.date, netCents: signedCents(t) });
    }
  }
  return sections;
};
