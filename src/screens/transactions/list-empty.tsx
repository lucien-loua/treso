import { router } from "expo-router";
import { ActivityIndicator } from "react-native";

import { LoadError } from "@/components/load-error";
import { EmptyState } from "@/components/ui/empty-state";
import { symbols } from "@/constants/symbols";
import { useTransactions } from "@/data/transactions-provider";
import { useI18n } from "@/i18n/context";
import { spacing } from "@/theme";

/** What the list shows when it has no rows: loading, error, no data yet, or no match for the search. */
export const ListEmpty = ({ query }: { query: string }) => {
  const state = useTransactions();
  const { t } = useI18n();
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
        title={t.transactions.empty}
        message={t.transactions.emptyHint}
        actionLabel={t.addTransaction}
        onAction={() => router.push("/transaction/new")}
      />
    );
  }
  return (
    <EmptyState
      icon={symbols.search}
      title={t.transactions.noResults}
      message={
        query.trim()
          ? t.transactions.noResultsForQuery(query.trim())
          : t.transactions.noResultsForType
      }
    />
  );
};
