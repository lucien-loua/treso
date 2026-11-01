import { SegmentedControl } from "@expo/ui/community/segmented-control";
import { Stack } from "expo-router";
import { useState } from "react";
import { SectionList, View } from "react-native";

import { AddTransactionToolbar } from "@/components/add-transaction-toolbar";
import { TransactionRow } from "@/components/transaction-row";
import { GroupedListItem } from "@/components/ui/grouped-section";
import { rowInset } from "@/components/ui/row-inset";
import { useCurrency } from "@/data/settings";
import { useTransactions } from "@/data/transactions-provider";
import { spacing } from "@/theme";
import { groupByDay } from "@/utils/stats";

import { DayHeader } from "./day-header";
import type { TypeFilter } from "./filter";
import { filterTransactions, typeFilters } from "./filter";
import { ListEmpty } from "./list-empty";

/** Every transaction, newest first, grouped by day; searchable and filterable by type. */
export const TransactionList = () => {
  const { transactions } = useTransactions();
  const [currency] = useCurrency();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const sections = groupByDay(
    filterTransactions(transactions, { currency, query, type })
  );

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
          transactions.length > 0 ? (
            <View style={{ paddingTop: spacing.sm }}>
              <SegmentedControl
                values={typeFilters.map((f) => f.label)}
                selectedIndex={typeFilters.findIndex((f) => f.value === type)}
                onChange={(event) =>
                  setType(
                    typeFilters[event.nativeEvent.selectedSegmentIndex].value
                  )
                }
                accessibilityLabel="Filtrer par type"
              />
            </View>
          ) : undefined
        }
        ListEmptyComponent={<ListEmpty query={query} />}
        renderSectionHeader={({ section }) => (
          <DayHeader
            date={section.date}
            netCents={section.netCents}
            currency={currency}
          />
        )}
        renderItem={({ item, index, section }) => (
          <GroupedListItem
            index={index}
            count={section.data.length}
            separatorInset={rowInset()}
          >
            <TransactionRow transaction={item} currency={currency} />
          </GroupedListItem>
        )}
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
