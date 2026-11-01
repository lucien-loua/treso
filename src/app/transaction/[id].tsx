import { useLocalSearchParams } from "expo-router";

import { SheetFallback } from "@/components/sheet-fallback";
import { useTransactions } from "@/data/transactions-provider";
import { useKeepWhileDeleting } from "@/hooks/use-keep-while-deleting";
import { useI18n } from "@/i18n/context";
import { EntryForm, toTransactionInput } from "@/screens/entry-form";

const EditTransactionRoute = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status, transactions, update, remove } = useTransactions();
  const { t } = useI18n();
  const [transaction, onDelete] = useKeepWhileDeleting(
    transactions.find((item) => item.id === Number(id)),
    (deleted) => remove(deleted.id)
  );

  if (!transaction) {
    return (
      <SheetFallback
        loading={status === "loading"}
        title={t.sheets.transaction}
        missingLabel={t.sheets.transactionMissing}
        message={t.sheets.transactionMissingHint}
      />
    );
  }

  return (
    <EntryForm
      key={transaction.id}
      kind="transaction"
      initial={transaction}
      title={t.sheets.edit}
      submitLabel={t.actions.save}
      footer={
        transaction.scheduleId === null ? undefined : t.sheets.scheduledPayment
      }
      onSubmit={(draft) => update(transaction.id, toTransactionInput(draft))}
      deleteLabel={t.sheets.deleteTransaction}
      onDelete={onDelete}
    />
  );
};

export default EditTransactionRoute;
