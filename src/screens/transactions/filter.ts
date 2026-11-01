import { entryCategory } from "@/data/entries";
import type { Transaction, TransactionType } from "@/data/types";
import type { Messages } from "@/i18n/messages/fr";
import type { Currency } from "@/lib/currency";
import { foldText } from "@/utils/text";

export type TypeFilter = "all" | TransactionType;

export const TYPE_FILTERS: TypeFilter[] = ["all", "expense", "income"];

/** Searchable text of a transaction: name, category and amount (as shown and as typed). */
const searchText = (transaction: Transaction, money: Currency, t: Messages) =>
  foldText(
    `${transaction.note} ${t.categories[entryCategory(transaction).id]} ${money.format(transaction.amountCents)} ${money.toInput(transaction.amountCents)}`
  );

/** Transactions of the chosen type whose name, category or amount contains `query`. */
export const filterTransactions = (
  transactions: Transaction[],
  {
    type,
    query,
    money,
    t,
  }: { type: TypeFilter; query: string; money: Currency; t: Messages }
) => {
  const folded = foldText(query.trim());
  return transactions.filter(
    (transaction) =>
      (type === "all" || transaction.type === type) &&
      (!folded || searchText(transaction, money, t).includes(folded))
  );
};
