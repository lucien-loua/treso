import { Link } from "expo-router";

import { SignedAmount } from "@/components/amount-text";
import { CategoryIcon } from "@/components/category-icon";
import { ListRow, ListRowText } from "@/components/ui/list-row";
import { entryCategory, entryTitle, signedCents } from "@/data/entries";
import { useTransactions } from "@/data/transactions-provider";
import type { Transaction } from "@/data/types";
import { confirm, runOrAlert } from "@/utils/alerts";
import { formatShortDate, toISODate } from "@/utils/dates";
import { haptics } from "@/utils/haptics";
import { formatMoney } from "@/utils/money";

/** A transaction in a list. Tap to edit; long press to duplicate or delete. */
export const TransactionRow = ({
  transaction,
  currency,
  showDate = false,
}: {
  transaction: Transaction;
  currency: string;
  showDate?: boolean;
}) => {
  const { add, remove } = useTransactions();
  const category = entryCategory(transaction);
  const title = entryTitle(transaction);
  const subtitle = [
    transaction.note ? category.label : null,
    showDate ? formatShortDate(transaction.date) : null,
    transaction.scheduleId === null ? null : "Échéance",
  ]
    .filter(Boolean)
    .join(" · ");

  const duplicate = () =>
    runOrAlert(async () => {
      await add({ ...transaction, date: toISODate(new Date()) });
      haptics.success();
    }, "Impossible de dupliquer");

  const confirmDelete = () => {
    haptics.warning();
    confirm({
      confirmLabel: "Supprimer",
      destructive: true,
      failureTitle: "Suppression impossible",
      message: `${title} · ${formatMoney(signedCents(transaction), currency)}`,
      onConfirm: () => remove(transaction.id),
      title: "Supprimer cette opération ?",
    });
  };

  return (
    <Link href={`/transaction/${transaction.id}`} asChild>
      <Link.Trigger>
        <ListRow accessibilityHint="Ouvre l’opération pour la modifier">
          <CategoryIcon
            category={category}
            iconId={transaction.icon}
            colorId={transaction.color}
          />
          <ListRowText title={title} subtitle={subtitle} subtitleLines={1} />
          <SignedAmount cents={signedCents(transaction)} currency={currency} />
        </ListRow>
      </Link.Trigger>
      <Link.Menu>
        <Link.MenuAction icon="plus.square.on.square" onPress={duplicate}>
          Dupliquer aujourd’hui
        </Link.MenuAction>
        <Link.MenuAction icon="trash" destructive onPress={confirmDelete}>
          Supprimer
        </Link.MenuAction>
      </Link.Menu>
    </Link>
  );
};
