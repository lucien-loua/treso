import type { SQLiteDatabase } from "expo-sqlite";

import type { Schedule, Transaction } from "@/data/types";

/**
 * Replaces every schedule and transaction with `data`, ids included so payments stay linked
 * to their schedule. One SQL transaction: if a row fails, nothing changes.
 */
export const replaceAllData = async (
  db: SQLiteDatabase,
  data: { schedules: Schedule[]; transactions: Transaction[] }
) => {
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM transactions");
    await db.runAsync("DELETE FROM schedules");

    const insertSchedule = await db.prepareAsync(
      "INSERT INTO schedules (id, type, amount_cents, currency, category_id, note, icon, color, day_of_month, next_due, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    const insertTransaction = await db.prepareAsync(
      "INSERT INTO transactions (id, type, amount_cents, currency, category_id, note, icon, color, date, schedule_id, settles_due, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    try {
      const now = Date.now();
      // One prepared statement runs one row at a time
      for (const s of data.schedules) {
        // oxlint-disable-next-line no-await-in-loop
        await insertSchedule.executeAsync(
          s.id,
          s.type,
          s.amountCents,
          s.currency,
          s.categoryId,
          s.note,
          s.icon,
          s.color,
          s.dayOfMonth,
          s.nextDue,
          now
        );
      }
      for (const t of data.transactions) {
        // oxlint-disable-next-line no-await-in-loop
        await insertTransaction.executeAsync(
          t.id,
          t.type,
          t.amountCents,
          t.currency,
          t.categoryId,
          t.note,
          t.icon,
          t.color,
          t.date,
          t.scheduleId,
          t.settlesDue,
          t.createdAt
        );
      }
    } finally {
      await insertSchedule.finalizeAsync();
      await insertTransaction.finalizeAsync();
    }
  });
};
