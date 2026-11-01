import type { SQLiteDatabase } from "expo-sqlite";

import type { Schedule, ScheduleInput, TransactionInput } from "@/data/types";
import { advanceDue } from "@/lib/datetime";

import type { ScheduleRow } from "./rows";
import { scheduleFromRow } from "./rows";
import { insertTransaction } from "./transactions";

export const selectSchedules = async (
  db: SQLiteDatabase
): Promise<Schedule[]> => {
  const rows = await db.getAllAsync<ScheduleRow>(
    "SELECT * FROM schedules ORDER BY next_due, type DESC, id"
  );
  return rows.map(scheduleFromRow);
};

export const insertSchedule = async (
  db: SQLiteDatabase,
  input: ScheduleInput
) => {
  await db.runAsync(
    "INSERT INTO schedules (type, amount_cents, category_id, note, icon, color, day_of_month, next_due, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    input.type,
    input.amountCents,
    input.categoryId,
    input.note,
    input.icon,
    input.color,
    input.dayOfMonth,
    input.nextDue,
    Date.now()
  );
};

export const updateSchedule = async (
  db: SQLiteDatabase,
  schedule: Schedule,
  input: ScheduleInput
) => {
  await db.runAsync(
    "UPDATE schedules SET type = ?, amount_cents = ?, category_id = ?, note = ?, icon = ?, color = ?, day_of_month = ?, next_due = ? WHERE id = ?",
    input.type,
    input.amountCents,
    input.categoryId,
    input.note,
    input.icon,
    input.color,
    input.dayOfMonth,
    input.nextDue,
    schedule.id
  );
};

/** Removes the schedule; payments already recorded stay, unlinked. */
export const deleteSchedule = async (db: SQLiteDatabase, id: number) => {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      "UPDATE transactions SET schedule_id = NULL, settles_due = NULL WHERE schedule_id = ?",
      id
    );
    await db.runAsync("DELETE FROM schedules WHERE id = ?", id);
  });
};

const moveToNextMonth = (db: SQLiteDatabase, schedule: Schedule) =>
  db.runAsync(
    "UPDATE schedules SET next_due = ? WHERE id = ?",
    advanceDue(schedule.nextDue, schedule.dayOfMonth),
    schedule.id
  );

/** Records the payment (or receipt) of the next due date and moves the schedule a month ahead. */
export const settleSchedule = async (
  db: SQLiteDatabase,
  schedule: Schedule,
  input: TransactionInput
) => {
  await db.withTransactionAsync(async () => {
    await insertTransaction(db, input, {
      due: schedule.nextDue,
      scheduleId: schedule.id,
    });
    await moveToNextMonth(db, schedule);
  });
};

/** Skips this month without recording anything. */
export const skipSchedule = async (db: SQLiteDatabase, schedule: Schedule) => {
  await moveToNextMonth(db, schedule);
};
