import type { Migration } from "./types";

/**
 * The first schema. Amounts are integers in hundredths of the unit of `currency`, the one they
 * were entered in (screens convert them); dates are local `YYYY-MM-DD`.
 */
export const initial: Migration = {
  name: "initial",
  up: async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
        amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
        currency TEXT NOT NULL,
        category_id TEXT NOT NULL,
        note TEXT NOT NULL DEFAULT '',
        icon TEXT,
        color TEXT,
        day_of_month INTEGER NOT NULL CHECK (day_of_month BETWEEN 1 AND 31),
        next_due TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
        amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
        currency TEXT NOT NULL,
        category_id TEXT NOT NULL,
        note TEXT NOT NULL DEFAULT '',
        icon TEXT,
        color TEXT,
        date TEXT NOT NULL,
        schedule_id INTEGER,
        settles_due TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date DESC);
    `);
  },
  version: 1,
};
