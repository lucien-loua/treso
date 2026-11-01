import { router } from "expo-router";

import { TransactionRow } from "@/components/transaction-row";
import { GroupedSection } from "@/components/ui/grouped-section";
import { SeparatedList } from "@/components/ui/list-row";
import { TextButton } from "@/components/ui/text-button";
import { ThemedText } from "@/components/ui/themed-text";
import type { Transaction } from "@/data/types";
import { spacing } from "@/theme";
import type { MonthKey } from "@/utils/dates";
import { formatMonth } from "@/utils/dates";

const RECENT_COUNT = 5;

/** The month's latest transactions, with « Tout voir » when there are more. */
export const MonthTransactions = ({
  transactions,
  month,
  currency,
}: {
  transactions: Transaction[];
  month: MonthKey;
  currency: string;
}) => (
  <GroupedSection
    title="Opérations du mois"
    accessory={
      transactions.length > RECENT_COUNT ? (
        <TextButton
          label="Tout voir"
          onPress={() => router.navigate("/transactions")}
        />
      ) : null
    }
  >
    {transactions.length === 0 ? (
      <ThemedText variant="subhead" style={{ padding: spacing.md }}>
        Aucune opération en {formatMonth(month).toLowerCase()}.
      </ThemedText>
    ) : (
      <SeparatedList
        data={transactions.slice(0, RECENT_COUNT)}
        keyExtractor={(t) => t.id}
        renderItem={(t) => (
          <TransactionRow transaction={t} currency={currency} showDate />
        )}
      />
    )}
  </GroupedSection>
);
