import { getCategory } from "@/data/catalog/categories";
import type { TransactionType } from "@/data/types";
import type { Messages } from "@/i18n/messages/fr";

/** An amount and the currency it was recorded in: a transaction, a schedule, a budget. */
export interface Recorded {
  amountCents: number;
  currency: string;
}

/** A recorded amount in hundredths of the currency on screen (see `useMoney().amountOf`). */
export type AmountOf = (recorded: Recorded) => number;

/** What transactions and schedules have in common, for naming and signing them the same way. */
interface Entry extends Recorded {
  type: TransactionType;
  categoryId: string;
  note: string;
}

/**
 * Positive for income, negative for expenses, in the currency on screen: amounts recorded in
 * different currencies are only added up once converted.
 */
export const signedAmount = (
  entry: Pick<Entry, "type" | "amountCents" | "currency">,
  amountOf: AmountOf
) => (entry.type === "income" ? amountOf(entry) : -amountOf(entry));

export const entryCategory = ({
  categoryId,
  type,
}: Pick<Entry, "categoryId" | "type">) => getCategory(categoryId, type);

/** The name the user gave, or the category's name when they left it empty. */
export const entryTitle = (
  entry: Pick<Entry, "categoryId" | "type" | "note">,
  t: Messages
) => entry.note || t.categories[entryCategory(entry).id];
