import { entryCategory } from "@/data/entries";
import type { Transaction, TransactionType } from "@/data/types";
import { formatMoney } from "@/utils/money";
import { foldText } from "@/utils/text";

export type TypeFilter = "all" | TransactionType;

export const typeFilters: { value: TypeFilter; label: string }[] = [
  { label: "Tout", value: "all" },
  { label: "Dépenses", value: "expense" },
  { label: "Revenus", value: "income" },
];

/** Searchable text of a transaction: name, category and amount (as shown and as typed). */
const searchText = (t: Transaction, currency: string) =>
  foldText(
    `${t.note} ${entryCategory(t).label} ${formatMoney(t.amountCents, currency)} ${t.amountCents / 100}`
  );

/** Transactions of the chosen type whose name, category or amount contains `query`. */
export const filterTransactions = (
  transactions: Transaction[],
  {
    type,
    query,
    currency,
  }: { type: TypeFilter; query: string; currency: string }
) => {
  const folded = foldText(query.trim());
  return transactions.filter(
    (t) =>
      (type === "all" || t.type === type) &&
      (!folded || searchText(t, currency).includes(folded))
  );
};
