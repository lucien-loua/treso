import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { useTransactions } from "@/data/transactions-provider";
import type { Transaction } from "@/data/types";
import { EntryForm, toTransactionInput } from "@/screens/entry-form";
import { spacing } from "@/theme";

const EditTransactionRoute = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status, transactions, update, remove } = useTransactions();
  // Keeps the form on screen while the sheet dismisses after a delete.
  const [deleted, setDeleted] = useState<Transaction | null>(null);
  const transaction = transactions.find((t) => t.id === Number(id)) ?? deleted;

  if (!transaction) {
    return status === "loading" ? (
      <ActivityIndicator style={{ marginTop: spacing.xxl }} />
    ) : (
      <>
        <Stack.Screen.Title>Opération</Stack.Screen.Title>
        <EmptyState
          icon={{ android: "help", ios: "questionmark.circle", web: "help" }}
          title="Opération introuvable"
          message="Elle a peut-être été supprimée."
          actionLabel="Fermer"
          onAction={() => router.back()}
        />
      </>
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
      onDelete={async () => {
        setDeleted(transaction);
        await remove(transaction.id);
      }}
    />
  );
};

export default EditTransactionRoute;
