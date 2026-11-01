import { router } from "expo-router";
import { ActivityIndicator } from "react-native";

import { LoadError } from "@/components/load-error";
import { EmptyState } from "@/components/ui/empty-state";
import { symbols } from "@/constants/symbols";
import { useTransactions } from "@/data/transactions-provider";
import { spacing } from "@/theme";

/** What the list shows when it has no rows: loading, error, no data yet, or no match for the search. */
export const ListEmpty = ({ query }: { query: string }) => {
  const state = useTransactions();
  const handleRetry = state.reload;

  if (state.status === "loading") {
    return <ActivityIndicator style={{ marginTop: spacing.xxl }} />;
  }
  if (state.status === "error") {
    return <LoadError error={state.error} onRetry={handleRetry} />;
  }
  if (state.transactions.length === 0) {
    return (
      <EmptyState
        icon={symbols.empty}
        title="Aucune opération"
        message="Vos dépenses et revenus apparaîtront ici, regroupés par jour."
        actionLabel="Ajouter une opération"
        onAction={() => router.push("/transaction/new")}
      />
    );
  }
  return (
    <EmptyState
      icon={symbols.search}
      title="Aucun résultat"
      message={
        query.trim()
          ? `Rien ne correspond à « ${query.trim()} ».`
          : "Aucune opération de ce type."
      }
    />
  );
};
