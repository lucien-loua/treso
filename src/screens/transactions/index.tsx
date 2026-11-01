import { SegmentedControl } from "@expo/ui/community/segmented-control";
import { Stack } from "expo-router";
import { useState } from "react";
import { SectionList, View } from "react-native";

import {
  ADD_BUTTON_CLEARANCE,
  AddTransactionButton,
} from "@/components/add-transaction-button";
import { TransactionRow } from "@/components/transaction-row";
import { GroupedListItem } from "@/components/ui/grouped-section";
import { rowInset } from "@/components/ui/row-inset";
import { useTransactions } from "@/data/transactions-provider";
import { useMoney } from "@/hooks/use-money";
import { useI18n } from "@/i18n/context";
import { spacing } from "@/theme";
import { groupByDay } from "@/utils/stats";

import { DayHeader } from "./day-header";
import type { TypeFilter } from "./filter";
import { filterTransactions, TYPE_FILTERS } from "./filter";
import { ListEmpty } from "./list-empty";

/** Every transaction, newest first, grouped by day; searchable and filterable by type. */
export const TransactionList = () => {
  const { transactions } = useTransactions();
  const { t } = useI18n();
  const money = useMoney();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const sections = groupByDay(
    filterTransactions(transactions, { money, query, t, type })
  );

  return (
    <>
      <SectionList
        sections={sections}
        keyExtractor={(transaction) => String(transaction.id)}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{
          paddingBottom: spacing.xxl + ADD_BUTTON_CLEARANCE,
          paddingHorizontal: spacing.md,
        }}
        ListHeaderComponent={
          transactions.length > 0 ? (
            <View style={{ paddingTop: spacing.sm }}>
              <SegmentedControl
                values={TYPE_FILTERS.map(
                  (filter) => t.transactions.filters[filter]
                )}
                selectedIndex={TYPE_FILTERS.indexOf(type)}
                onChange={(event) =>
                  setType(TYPE_FILTERS[event.nativeEvent.selectedSegmentIndex])
                }
                accessibilityLabel={t.transactions.filter}
              />
            </View>
          ) : undefined
        }
        ListEmptyComponent={<ListEmpty query={query} />}
        renderSectionHeader={({ section }) => (
          <DayHeader date={section.date} netCents={section.netCents} />
        )}
        renderItem={({ item, index, section }) => (
          <GroupedListItem
            index={index}
            count={section.data.length}
            separatorInset={rowInset()}
          >
            <TransactionRow transaction={item} />
          </GroupedListItem>
        )}
      />
      <Stack.SearchBar
        placeholder={t.transactions.search}
        hideWhenScrolling={false}
        onChangeText={(event) => setQuery(event.nativeEvent.text)}
        onCancelButtonPress={() => setQuery("")}
      />
      <AddTransactionButton />
    </>
  );
};
