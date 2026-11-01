import { Link } from "expo-router";

import { SignedAmount } from "@/components/amount-text";
import { CategoryIcon } from "@/components/category-icon";
import { ListRow, ListRowText } from "@/components/ui/list-row";
import { entryCategory, entryTitle, signedCents } from "@/data/entries";
import { useTransactions } from "@/data/transactions-provider";
import type { Transaction } from "@/data/types";
import { useMoney } from "@/hooks/use-money";
import { useI18n } from "@/i18n/context";
import { toISODate } from "@/lib/datetime";
import { confirm, runOrAlert } from "@/utils/alerts";
import { haptics } from "@/utils/haptics";

/** A transaction in a list. Tap to edit; long press to duplicate or delete. */
export const TransactionRow = ({
  transaction,
  showDate = false,
}: {
  transaction: Transaction;
  showDate?: boolean;
}) => {
  const { add, remove } = useTransactions();
  const { t, dates } = useI18n();
  const money = useMoney();
  const category = entryCategory(transaction);
  const title = entryTitle(transaction, t);
  const subtitle = [
    transaction.note ? t.categories[category.id] : null,
    showDate ? dates.shortDate(transaction.date) : null,
    transaction.scheduleId === null ? null : t.transactions.scheduled,
  ]
    .filter(Boolean)
    .join(" · ");

  const duplicate = () =>
    runOrAlert(async () => {
      await add({ ...transaction, date: toISODate(new Date()) });
      haptics.success();
    }, t.errors.duplicateFailed);

  const confirmDelete = () => {
    haptics.warning();
    confirm({
      cancelLabel: t.actions.cancel,
      confirmLabel: t.actions.delete,
      destructive: true,
      failureTitle: t.errors.deleteFailed,
      message: `${title} · ${money.format(signedCents(transaction))}`,
      onConfirm: () => remove(transaction.id),
      title: t.transactions.deleteTitle,
    });
  };

  return (
    <Link href={`/transaction/${transaction.id}`} asChild>
      <Link.Trigger>
        <ListRow accessibilityHint={t.transactions.openHint}>
          <CategoryIcon
            category={category}
            iconId={transaction.icon}
            colorId={transaction.color}
          />
          <ListRowText title={title} subtitle={subtitle} subtitleLines={1} />
          <SignedAmount cents={signedCents(transaction)} />
        </ListRow>
      </Link.Trigger>
      <Link.Menu>
        <Link.MenuAction icon="plus.square.on.square" onPress={duplicate}>
          {t.transactions.duplicate}
        </Link.MenuAction>
        <Link.MenuAction icon="trash" destructive onPress={confirmDelete}>
          {t.actions.delete}
        </Link.MenuAction>
      </Link.Menu>
    </Link>
  );
};
