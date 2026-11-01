import type { SQLiteDatabase } from "expo-sqlite";

import { migrations } from "./migrations";

export const DATABASE_NAME = "treso.db";

const readVersion = async (db: SQLiteDatabase) => {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  return row?.user_version ?? 0;
};

/** Runs on open (via `SQLiteProvider.onInit`): applies the migrations the database hasn't had yet, in order. */
export const migrate = async (db: SQLiteDatabase) => {
  // Persistent setting, and not allowed inside a transaction: set it before migrating.
  await db.execAsync("PRAGMA journal_mode = 'wal'");

  const version = await readVersion(db);
  const pending = migrations.filter((migration) => migration.version > version);
  for (const migration of pending) {
    // Each step builds on the previous one, so they must run one after the other.
    // oxlint-disable-next-line no-await-in-loop
    await db.withTransactionAsync(async () => {
      await migration.up(db);
      await db.execAsync(`PRAGMA user_version = ${migration.version}`);
    });
  }
};
