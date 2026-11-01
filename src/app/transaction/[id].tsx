import { useLocalSearchParams } from "expo-router";

import { SheetFallback } from "@/components/sheet-fallback";
import { useTransactions } from "@/data/transactions-provider";
import { useKeepWhileDeleting } from "@/hooks/use-keep-while-deleting";
import { EntryForm, toTransactionInput } from "@/screens/entry-form";

const EditTransactionRoute = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status, transactions, update, remove } = useTransactions();
  const [transaction, onDelete] = useKeepWhileDeleting(
    transactions.find((t) => t.id === Number(id)),
    (deleted) => remove(deleted.id)
  );

  if (!transaction) {
    return (
      <SheetFallback
        loading={status === "loading"}
        title="Opération"
        missingLabel="Opération introuvable"
        message="Elle a peut-être été supprimée."
      />
    );
  }

  return (
    <EntryForm
      key={transaction.id}
      kind="transaction"
      initial={transaction}
      title="Modifier"
      submitLabel="Enregistrer"
      footer={
        transaction.scheduleId === null
          ? undefined
          : "Paiement d’une échéance mensuelle. Le supprimer remet l’échéance à payer."
      }
      onSubmit={(draft) => update(transaction.id, toTransactionInput(draft))}
      deleteLabel="Supprimer l’opération"
      onDelete={onDelete}
    />
  );
};

export default EditTransactionRoute;
