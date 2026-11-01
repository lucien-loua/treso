import { signedCents } from "@/data/entries";
import type { Schedule, Transaction } from "@/data/types";
import type { I18n } from "@/i18n/i18n";
import {
  dateInMonth,
  daysBetween,
  monthKeyOf,
  toISODate,
} from "@/lib/datetime";

export type DueTone = "danger" | "warning" | "normal" | "done";

/** Days before a bill's due date from which it shows in orange. */
const SOON_DAYS = 3;

/** The payment that settled this month's due date, if any. */
export const paymentThisMonth = (
  schedule: Schedule,
  transactions: Transaction[],
  today = new Date()
) => {
  const month = monthKeyOf(today);
  const thisMonthDue = dateInMonth(month, schedule.dayOfMonth);
  return transactions.find(
    (t) =>
      t.scheduleId === schedule.id &&
      (t.settlesDue === thisMonthDue ||
        (t.settlesDue === null && t.date.startsWith(month)))
  );
};

/**
 * « Avant le 5 nov. · dans 4 jours », « En retard · échéance le 3 nov. », « Payé le 1 nov. · prochain avant le 5 déc. »…
 * When this month is already settled, say by which payment, so a date in the next month never looks like a bug.
 */
export const dueStatus = (
  schedule: Schedule,
  transactions: Transaction[],
  { t, dates }: Pick<I18n, "t" | "dates">,
  today = new Date()
): { label: string; tone: DueTone } => {
  const isIncome = schedule.type === "income";
  const days = daysBetween(toISODate(today), schedule.nextDue);
  const when = dates.shortDate(schedule.nextDue);

  const payment =
    schedule.nextDue.slice(0, 7) > monthKeyOf(today)
      ? paymentThisMonth(schedule, transactions, today)
      : undefined;
  if (payment) {
    const paidOn = dates.shortDate(payment.date);
    return {
      label: isIncome
        ? t.schedules.received(paidOn, when)
        : t.schedules.paid(paidOn, when),
      tone: "done",
    };
  }

  if (isIncome) {
    if (days < 0) {
      return { label: t.schedules.expectedSince(when), tone: "warning" };
    }
    if (days === 0) {
      return { label: t.schedules.expectedToday, tone: "warning" };
    }
    return {
      label: t.schedules.expected(when, dates.relativeDays(days)),
      tone: "normal",
    };
  }
  if (days < 0) {
    return { label: t.schedules.late(when), tone: "danger" };
  }
  if (days === 0) {
    return { label: t.schedules.dueToday, tone: "danger" };
  }
  return {
    label: t.schedules.dueBy(when, dates.relativeDays(days)),
    tone: days <= SOON_DAYS ? "warning" : "normal",
  };
};

/** Net of the schedules still due on or before `until` (overdue ones included). */
export const pendingNetCents = (schedules: Schedule[], until: string) =>
  schedules
    .filter((s) => s.nextDue <= until)
    .reduce((sum, s) => sum + signedCents(s), 0);
