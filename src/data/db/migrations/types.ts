import type { SQLiteDatabase } from "expo-sqlite";

/** One schema change. `version` is what `PRAGMA user_version` holds once `up` has run. */
export interface Migration {
  version: number;
  name: string;
  up: (db: SQLiteDatabase) => Promise<void>;
}
