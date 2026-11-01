import { initial } from "./001-initial";
import type { Migration } from "./types";

/**
 * Every schema change, oldest first. To change the schema, add `00N-what-changes.ts`
 * next to this file (version N) and append it here; never edit a migration that shipped.
 */
export const migrations: Migration[] = [initial];
