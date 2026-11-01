import { router } from "expo-router";

import { TransactionRow } from "@/components/transaction-row";
import { GroupedSection } from "@/components/ui/grouped-section";
import { SeparatedList } from "@/components/ui/list-row";
import { TextButton } from "@/components/ui/text-button";
import { ThemedText } from "@/components/ui/themed-text";
import type { Transaction } from "@/data/types";
import { useI18n } from "@/i18n/context";
import type { MonthKey } from "@/lib/datetime";
import { spacing } from "@/theme";

const RECENT_COUNT = 5;

/** The month's latest transactions, with "See all" when there are more. */
export const MonthTransactions = ({
  transactions,
  month,
}: {
  transactions: Transaction[];
  month: MonthKey;
}) => {
  const { t, dates } = useI18n();
  return (
    <GroupedSection
      title={t.overview.monthTransactions.title}
      accessory={
        transactions.length > RECENT_COUNT ? (
          <TextButton
            label={t.actions.seeAll}
            onPress={() => router.navigate("/transactions")}
          />
        ) : null
      }
    >
      {transactions.length === 0 ? (
        <ThemedText variant="subhead" style={{ padding: spacing.md }}>
          {t.overview.monthTransactions.none(dates.monthInText(month))}
        </ThemedText>
      ) : (
        <SeparatedList
          data={transactions.slice(0, RECENT_COUNT)}
          keyExtractor={(transaction) => transaction.id}
          renderItem={(transaction) => (
            <TransactionRow transaction={transaction} showDate />
          )}
        />
      )}
    </GroupedSection>
  );
};
