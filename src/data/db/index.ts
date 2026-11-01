import type { SQLiteDatabase } from "expo-sqlite";

export {
  deleteSchedule,
  insertSchedule,
  selectSchedules,
  settleSchedule,
  skipSchedule,
  updateSchedule,
} from "./schedules";
export { DATABASE_NAME, migrate } from "./migrate";
export {
  deleteTransaction,
  insertTransactions,
  selectTransactions,
  updateTransaction,
} from "./transactions";

/** Wipes every transaction and schedule (Settings › Erase all data). */
export const deleteAllData = async (db: SQLiteDatabase) => {
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM transactions");
    await db.runAsync("DELETE FROM schedules");
  });
};
