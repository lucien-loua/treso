import type { Schedule, Transaction } from "@/data/types";

/** A `transactions` row as SQLite returns it. */
export interface TransactionRow {
  id: number;
  type: Transaction["type"];
  amount_cents: number;
  category_id: string;
  note: string;
  icon: string | null;
  color: string | null;
  date: string;
  schedule_id: number | null;
  settles_due: string | null;
  created_at: number;
}

/** A `schedules` row as SQLite returns it. */
export interface ScheduleRow {
  id: number;
  type: Schedule["type"];
  amount_cents: number;
  category_id: string;
  note: string;
  icon: string | null;
  color: string | null;
  day_of_month: number;
  next_due: string;
}

export const transactionFromRow = (row: TransactionRow): Transaction => ({
  amountCents: row.amount_cents,
  categoryId: row.category_id,
  color: row.color,
  createdAt: row.created_at,
  date: row.date,
  icon: row.icon,
  id: row.id,
  note: row.note,
  scheduleId: row.schedule_id,
  settlesDue: row.settles_due,
  type: row.type,
});

export const scheduleFromRow = (row: ScheduleRow): Schedule => ({
  amountCents: row.amount_cents,
  categoryId: row.category_id,
  color: row.color,
  dayOfMonth: row.day_of_month,
  icon: row.icon,
  id: row.id,
  nextDue: row.next_due,
  note: row.note,
  type: row.type,
});
