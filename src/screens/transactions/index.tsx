import { SegmentedControl } from "@expo/ui/community/segmented-control";
import { router, Stack } from "expo-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { ActivityIndicator, SectionList, View } from "react-native";

import { AddTransactionToolbar } from "@/components/add-transaction-toolbar";
import { EmptyState } from "@/components/empty-state";
import { RowSeparator } from "@/components/grouped-section";
import { ThemedText } from "@/components/themed-text";
import { TransactionRow } from "@/components/transaction-row";
import { getCategory } from "@/data/categories";
import { useCurrency } from "@/data/settings";
import { useTransactions } from "@/data/transactions-provider";
import type { Transaction, TransactionType } from "@/data/types";
import { colors, radius, spacing } from "@/theme";
import { formatDayTitle } from "@/utils/dates";
import { formatMoney } from "@/utils/money";
import { groupByDay } from "@/utils/stats";

type Filter = "all" | TransactionType;
const filters: { value: Filter; label: string }[] = [
  { label: "Tout", value: "all" },
  { label: "Dépenses", value: "expense" },
  { label: "Revenus", value: "income" },
];

/** Lowercase and strip accents so « sante » finds « Santé ». */
const normalize = (value: string) =>
  value.normalize("NFD").replaceAll(/\p{M}/gu, "").toLowerCase();

const matches = (t: Transaction, query: string, currency: string) => {
  if (!query) {
    return true;
  }
  const haystack = normalize(
    `${t.note} ${getCategory(t.categoryId, t.type).label} ${formatMoney(t.amountCents, currency)} ${t.amountCents / 100}`
  );
  return haystack.includes(query);
};

export const TransactionList = () => {
  const state = useTransactions();
  const handleRetry = state.reload;
  const [currency] = useCurrency();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const normalizedQuery = normalize(query.trim());
  const visible = state.transactions.filter(
    (t) =>
      (filter === "all" || t.type === filter) &&
      matches(t, normalizedQuery, currency)
  );
  const sections = groupByDay(visible);

  let empty: ReactNode;
  if (state.status === "loading") {
    empty = <ActivityIndicator style={{ marginTop: spacing.xxl }} />;
  } else if (state.status === "error") {
    empty = (
      <EmptyState
        icon={{
          android: "warning",
          ios: "exclamationmark.triangle",
          web: "warning",
        }}
        title="Impossible de charger vos opérations"
        message={state.error.message}
        actionLabel="Réessayer"
        onAction={handleRetry}
      />
    );
  } else if (state.transactions.length === 0) {
    empty = (
      <EmptyState
        icon={{ android: "inbox", ios: "tray", web: "inbox" }}
        title="Aucune opération"
        message="Vos dépenses et revenus apparaîtront ici, regroupés par jour."
        actionLabel="Ajouter une opération"
        onAction={() => router.push("/transaction/new")}
      />
    );
  } else {
    empty = (
      <EmptyState
        icon={{ android: "search", ios: "magnifyingglass", web: "search" }}
        title="Aucun résultat"
        message={
          query.trim()
            ? `Rien ne correspond à « ${query.trim()} ».`
            : "Aucune opération de ce type."
        }
      />
    );
  }

  return (
    <>
      <SectionList
        sections={sections}
        keyExtractor={(t) => String(t.id)}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{
          paddingBottom: spacing.xxl,
          paddingHorizontal: spacing.md,
        }}
        ListHeaderComponent={
          state.transactions.length > 0 ? (
            <View style={{ paddingTop: spacing.sm }}>
              <SegmentedControl
                values={filters.map((f) => f.label)}
                selectedIndex={filters.findIndex((f) => f.value === filter)}
                onChange={(event) =>
                  setFilter(
                    filters[event.nativeEvent.selectedSegmentIndex].value
                  )
                }
                accessibilityLabel="Filtrer par type"
              />
            </View>
          ) : undefined
        }
        ListEmptyComponent={empty}
        renderSectionHeader={({ section }) => (
          <View
            style={{
              alignItems: "baseline",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: spacing.sm,
              paddingHorizontal: spacing.md,
              paddingTop: spacing.lg,
            }}
          >
            <ThemedText variant="sectionHeader" accessibilityRole="header">
              {formatDayTitle(section.date)}
            </ThemedText>
            <ThemedText
              variant="footnote"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {formatMoney(section.netCents, currency, { showPlus: true })}
            </ThemedText>
          </View>
        )}
        renderItem={({ item, index, section }) => {
          const first = index === 0;
          const last = index === section.data.length - 1;
          return (
            <View
              style={{
                backgroundColor: colors.surface,
                borderBottomLeftRadius: last ? radius.lg : 0,
                borderBottomRightRadius: last ? radius.lg : 0,
                borderCurve: "continuous",
                borderTopLeftRadius: first ? radius.lg : 0,
                borderTopRightRadius: first ? radius.lg : 0,
                overflow: "hidden",
              }}
            >
              {first ? null : <RowSeparator inset={64} />}
              <TransactionRow transaction={item} currency={currency} />
            </View>
          );
        }}
      />
      <Stack.SearchBar
        placeholder="Rechercher une opération"
        hideWhenScrolling={false}
        onChangeText={(event) => setQuery(event.nativeEvent.text)}
        onCancelButtonPress={() => setQuery("")}
      />
      <AddTransactionToolbar />
    </>
  );
};
