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
}: {
  transactions: Transaction[];
  schedules: Schedule[];
  month: MonthKey;
  isCurrentMonth: boolean;
  today: Date;
}) => {
  const summary = summarizeMonth(transactions, month);
  const monthEnd = endOfMonth(month);
  const hasDueThisMonth = schedules.some((s) => s.nextDue <= monthEnd);
  const todayIso = toISODate(today);

  return {
    /** End-of-month balance once this month's schedules are settled; only for the current month. */
    forecastCents:
      isCurrentMonth && hasDueThisMonth
        ? summary.closingCents + pendingNetCents(schedules, monthEnd)
        : null,
    summary,
    todaySpentCents: transactions
      .filter((t) => t.date === todayIso && t.type === "expense")
      .reduce((sum, t) => sum + t.amountCents, 0),
  };
};
