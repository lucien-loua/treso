import { entryCategory } from "@/data/entries";
import type { Transaction, TransactionType } from "@/data/types";
import type { Money } from "@/hooks/use-money";
import type { Messages } from "@/i18n/messages/fr";
import { foldText } from "@/utils/text";

export type TypeFilter = "all" | TransactionType;

export const TYPE_FILTERS: TypeFilter[] = ["all", "expense", "income"];

/**
 * Searchable text of a transaction: name, category, and amount as shown, as typed, and as
 * recorded when that was in another currency.
 */
const searchText = (transaction: Transaction, money: Money, t: Messages) => {
  const amount = money.amountOf(transaction);
  return foldText(
    `${transaction.note} ${t.categories[entryCategory(transaction).id]} ${money.format(amount)} ${money.toInput(amount)} ${money.originalOf(transaction) ?? ""}`
  );
};

/** Transactions of the chosen type whose name, category or amount contains `query`. */
export const filterTransactions = (
  transactions: Transaction[],
  {
    type,
    query,
    money,
    t,
  }: { type: TypeFilter; query: string; money: Money; t: Messages }
) => {
  const folded = foldText(query.trim());
  return transactions.filter(
    (transaction) =>
      (type === "all" || transaction.type === type) &&
      (!folded || searchText(transaction, money, t).includes(folded))
  );
};
