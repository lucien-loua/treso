import { router } from "expo-router";
import { View } from "react-native";

import { GroupedSection } from "@/components/ui/grouped-section";
import { ListRow, ListRowChevron, ListRowText } from "@/components/ui/list-row";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ThemedText } from "@/components/ui/themed-text";
import { colors, spacing } from "@/theme";
import { daysLeftInMonth } from "@/utils/dates";
import type { MonthKey } from "@/utils/dates";
import { formatMoney } from "@/utils/money";

/** Share of the budget spent from which the bar turns orange. */
const WARNING_RATIO = 0.8;

export const BudgetCard = ({
  budgetCents,
  spentCents,
  month,
  currency,
}: {
  budgetCents: number | null;
  spentCents: number;
  month: MonthKey;
  currency: string;
}) => {
  if (budgetCents === null) {
    return (
      <GroupedSection title="Budget">
        <ListRow onPress={() => router.navigate("/settings")}>
          <ListRowText
            title="Définir un budget mensuel"
            subtitle="Suivez ce qu’il vous reste à dépenser chaque mois."
          />
          <ListRowChevron />
        </ListRow>
      </GroupedSection>
    );
  }

  const ratio = spentCents / budgetCents;
  const remaining = budgetCents - spentCents;
  const daysLeft = daysLeftInMonth(month);
  let barColor = colors.tint;
  if (ratio >= 1) {
    barColor = colors.danger;
  } else if (ratio >= WARNING_RATIO) {
    barColor = colors.warning;
  }

  let hint = `${formatMoney(spentCents, currency)} dépensés sur ${formatMoney(budgetCents, currency)}`;
  if (remaining > 0 && daysLeft > 0) {
    hint += ` · ${formatMoney(Math.floor(remaining / daysLeft), currency)} par jour sur ${daysLeft} j`;
  }

  return (
    <GroupedSection
      title="Budget"
      accessory={
        <ThemedText variant="footnote">
          {Math.round(ratio * 100)} % utilisé
        </ThemedText>
      }
    >
      <View style={{ gap: spacing.smd, padding: spacing.md }}>
        <ThemedText
          variant="title"
          selectable
          style={{
            color: remaining < 0 ? colors.danger : colors.label,
            fontVariant: ["tabular-nums"],
          }}
        >
          {remaining >= 0
            ? `Reste ${formatMoney(remaining, currency)}`
            : `Dépassé de ${formatMoney(-remaining, currency)}`}
        </ThemedText>
        <ProgressBar value={ratio} color={barColor} height={8} />
        <ThemedText variant="footnote">{hint}</ThemedText>
      </View>
    </GroupedSection>
  );
};
