import { chosenCurrencyCode } from "@/data/settings";

import type { Migration } from "./types";

/**
 * Each amount keeps the currency it was recorded in, so changing currency in Settings converts
 * on screen and never rewrites data. Rows recorded before were in the currency chosen then.
 */
export const currency: Migration = {
  name: "currency",
  up: async (db) => {
    await db.execAsync(`
      ALTER TABLE transactions ADD COLUMN currency TEXT NOT NULL DEFAULT 'XOF';
      ALTER TABLE schedules ADD COLUMN currency TEXT NOT NULL DEFAULT 'XOF';
    `);
    const code = chosenCurrencyCode();
    await db.runAsync("UPDATE transactions SET currency = ?", code);
    await db.runAsync("UPDATE schedules SET currency = ?", code);
  },
  version: 2,
};
