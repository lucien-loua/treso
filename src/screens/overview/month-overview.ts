import type { AmountOf } from "@/data/entries";
import type { Schedule, Transaction } from "@/data/types";
import { endOfMonth, toISODate } from "@/lib/datetime";
import type { MonthKey } from "@/lib/datetime";
import { pendingNetCents } from "@/utils/schedules";
import { summarizeMonth } from "@/utils/stats";

/** Everything the Overview shows for `month`, derived from the raw data. */
export const monthOverview = ({
  transactions,
  schedules,
  month,
  isCurrentMonth,
  today,
  amountOf,
}: {
  transactions: Transaction[];
  schedules: Schedule[];
  month: MonthKey;
  isCurrentMonth: boolean;
  today: Date;
  /** Converts each amount to the currency on screen */
  amountOf: AmountOf;
}) => {
  const summary = summarizeMonth(transactions, month, amountOf);
  const monthEnd = endOfMonth(month);
  const hasDueThisMonth = schedules.some((s) => s.nextDue <= monthEnd);
  const todayIso = toISODate(today);

  return {
    /** End-of-month balance once this month's schedules are settled; only for the current month. */
    forecastCents:
      isCurrentMonth && hasDueThisMonth
        ? summary.closingCents + pendingNetCents(schedules, monthEnd, amountOf)
        : null,
    summary,
    todaySpentCents: transactions
      .filter((t) => t.date === todayIso && t.type === "expense")
      .reduce((sum, t) => sum + amountOf(t), 0),
  };
};
