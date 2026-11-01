import { getCategory } from "@/data/catalog/categories";
import type { TransactionType } from "@/data/types";

/** What transactions and schedules have in common, for naming and signing them the same way. */
interface Entry {
  type: TransactionType;
  amountCents: number;
  categoryId: string;
  note: string;
}

/** Positive for income, negative for expenses. */
export const signedCents = ({
  type,
  amountCents,
}: Pick<Entry, "type" | "amountCents">) =>
  type === "income" ? amountCents : -amountCents;

export const entryCategory = ({
  categoryId,
  type,
}: Pick<Entry, "categoryId" | "type">) => getCategory(categoryId, type);

/** The name the user gave, or the category's label when they left it empty. */
export const entryTitle = (
  entry: Pick<Entry, "categoryId" | "type" | "note">
) => entry.note || entryCategory(entry).label;
