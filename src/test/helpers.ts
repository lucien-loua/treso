import { Database } from "bun:sqlite";
import type { SQLQueryBindings } from "bun:sqlite";

import type { SQLiteDatabase } from "expo-sqlite";

import { migrate } from "@/data/db";

const SPECIAL_SPACES = /[  ]/gu;

/** Amounts and dates are written with no-break spaces; tests read them as plain ones. */
export const plainSpaces = (text: string) =>
  text.replaceAll(SPECIAL_SPACES, " ");

/**
 * The part of `expo-sqlite`'s async API the data layer uses, over an in-memory `bun:sqlite`
 * database: the real schema and queries, without a phone. Transactions take the same steps as
 * `withTransactionAsync` in `expo-sqlite`.
 */
export const openTestDatabase = async () => {
  const sqlite = new Database(":memory:");
  const db = {
    execAsync: (sql: string) => {
      sqlite.run(sql);
      return Promise.resolve();
    },
    getAllAsync: (sql: string, ...params: SQLQueryBindings[]) =>
      Promise.resolve(sqlite.prepare(sql).all(...params)),
    getFirstAsync: (sql: string, ...params: SQLQueryBindings[]) =>
      Promise.resolve(sqlite.prepare(sql).get(...params)),
    prepareAsync: (sql: string) => {
      const statement = sqlite.prepare(sql);
      return Promise.resolve({
        executeAsync: (...params: SQLQueryBindings[]) =>
          Promise.resolve(statement.run(...params)),
        finalizeAsync: () => {
          statement.finalize();
          return Promise.resolve();
        },
      });
    },
    runAsync: (sql: string, ...params: SQLQueryBindings[]) =>
      Promise.resolve(sqlite.prepare(sql).run(...params)),
    withTransactionAsync: async (task: () => Promise<void>) => {
      try {
        sqlite.run("BEGIN");
        await task();
        sqlite.run("COMMIT");
      } catch (error) {
        sqlite.run("ROLLBACK");
        throw error;
      }
    },
  } as unknown as SQLiteDatabase;
  await migrate(db);
  return db;
};
