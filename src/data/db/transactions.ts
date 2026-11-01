import type { SQLiteDatabase } from "expo-sqlite";

import type { Transaction, TransactionInput } from "@/data/types";
import { advanceDue } from "@/lib/datetime";

import type { TransactionRow } from "./rows";
import { transactionFromRow } from "./rows";

export const selectTransactions = async (
  db: SQLiteDatabase
): Promise<Transaction[]> => {
  const rows = await db.getAllAsync<TransactionRow>(
    "SELECT * FROM transactions ORDER BY date DESC, created_at DESC"
  );
  return rows.map(transactionFromRow);
};

/** Inserts one transaction; `settlement` links it to the schedule due date it pays. */
export const insertTransaction = async (
  db: SQLiteDatabase,
  input: TransactionInput,
  settlement: { scheduleId: number; due: string } | null = null
) => {
  await db.runAsync(
    "INSERT INTO transactions (type, amount_cents, currency, category_id, note, icon, color, date, schedule_id, settles_due, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    input.type,
    input.amountCents,
    input.currency,
    input.categoryId,
    input.note,
    input.icon,
    input.color,
    input.date,
    settlement?.scheduleId ?? null,
    settlement?.due ?? null,
    Date.now()
  );
};

export const insertTransactions = async (
  db: SQLiteDatabase,
  inputs: TransactionInput[]
) => {
  await db.withTransactionAsync(async () => {
    await Promise.all(inputs.map((input) => insertTransaction(db, input)));
  });
};

export const updateTransaction = async (
  db: SQLiteDatabase,
  id: number,
  input: TransactionInput
) => {
  await db.runAsync(
    "UPDATE transactions SET type = ?, amount_cents = ?, currency = ?, category_id = ?, note = ?, icon = ?, color = ?, date = ? WHERE id = ?",
    input.type,
    input.amountCents,
    input.currency,
    input.categoryId,
    input.note,
    input.icon,
    input.color,
    input.date,
    id
  );
};

/** Deletes a transaction. If it was a schedule's latest payment, that due date becomes pending again. */
export const deleteTransaction = async (db: SQLiteDatabase, id: number) => {
  await db.withTransactionAsync(async () => {
    const payment = await db.getFirstAsync<{
      schedule_id: number | null;
      settles_due: string | null;
    }>("SELECT schedule_id, settles_due FROM transactions WHERE id = ?", id);
    await db.runAsync("DELETE FROM transactions WHERE id = ?", id);
    if (
      !payment ||
      payment.schedule_id === null ||
      payment.settles_due === null
    ) {
      return;
    }

    const schedule = await db.getFirstAsync<{
      day_of_month: number;
      next_due: string;
    }>(
      "SELECT day_of_month, next_due FROM schedules WHERE id = ?",
      payment.schedule_id
    );
    const wasLatestPayment =
      schedule &&
      advanceDue(payment.settles_due, schedule.day_of_month) ===
        schedule.next_due;
    if (wasLatestPayment) {
      await db.runAsync(
        "UPDATE schedules SET next_due = ? WHERE id = ?",
        payment.settles_due,
        payment.schedule_id
      );
    }
  });
};
