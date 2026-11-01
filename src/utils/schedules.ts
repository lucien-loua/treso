import { signedCents } from "@/data/entries";
import type { Schedule, Transaction } from "@/data/types";

import {
  dateInMonth,
  daysBetween,
  formatShortDate,
  monthKeyOf,
  toISODate,
} from "./dates";

export type DueTone = "danger" | "warning" | "normal" | "done";

const inDays = (days: number) => (days === 1 ? "demain" : `dans ${days} j`);

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
 * « Avant le 5 nov. · dans 4 j », « En retard · échéance le 3 nov. », « Payé le 1 nov. · prochain avant le 5 déc. »…
 * When this month is already settled, say by which payment, so a date in the next month never looks like a bug.
 */
export const dueStatus = (
  schedule: Schedule,
  transactions: Transaction[],
  today = new Date()
): { label: string; tone: DueTone } => {
  const isIncome = schedule.type === "income";
  const days = daysBetween(toISODate(today), schedule.nextDue);
  const when = formatShortDate(schedule.nextDue);
  const next = `${isIncome ? "vers" : "avant"} le ${when}`;

  const payment =
    schedule.nextDue.slice(0, 7) > monthKeyOf(today)
      ? paymentThisMonth(schedule, transactions, today)
      : undefined;
  if (payment) {
    return {
      label: `${isIncome ? "Reçu" : "Payé"} le ${formatShortDate(payment.date)} · prochain ${next}`,
      tone: "done",
    };
  }

  if (isIncome) {
    if (days < 0) {
      return { label: `Attendu depuis le ${when}`, tone: "warning" };
    }
    if (days === 0) {
      return { label: "Attendu aujourd’hui", tone: "warning" };
    }
    return { label: `Attendu ${next} · ${inDays(days)}`, tone: "normal" };
  }
  if (days < 0) {
    return { label: `En retard · échéance le ${when}`, tone: "danger" };
  }
  if (days === 0) {
    return { label: "À payer aujourd’hui", tone: "danger" };
  }
  return {
    label: `Avant le ${when} · ${inDays(days)}`,
    tone: days <= 3 ? "warning" : "normal",
  };
};

/** Net of the schedules still due on or before `until` (overdue ones included). */
export const pendingNetCents = (schedules: Schedule[], until: string) =>
  schedules
    .filter((s) => s.nextDue <= until)
    .reduce((sum, s) => sum + signedCents(s), 0);
