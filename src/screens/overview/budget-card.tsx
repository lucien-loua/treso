import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { GroupedSection } from "@/components/grouped-section";
import { ProgressBar } from "@/components/progress-bar";
import { ThemedText } from "@/components/themed-text";
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
        <Pressable
          accessibilityRole="button"
          onPress={() => router.navigate("/settings")}
          style={({ pressed }) => ({
            alignItems: "center",
            backgroundColor: pressed ? colors.fill : "transparent",
            flexDirection: "row",
            gap: spacing.sm,
            padding: spacing.md,
          })}
        >
          <View style={{ flex: 1, gap: 2 }}>
            <ThemedText variant="body">Définir un budget mensuel</ThemedText>
            <ThemedText variant="footnote">
              Suivez ce qu’il vous reste à dépenser chaque mois.
            </ThemedText>
          </View>
          <SymbolView
            name={{
              android: "chevron_right",
              ios: "chevron.right",
              web: "chevron_right",
            }}
            tintColor={colors.tertiaryLabel}
            weight="semibold"
            resizeMode="scaleAspectFit"
            style={{ height: 12, width: 12 }}
          />
        </Pressable>
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
      <View style={{ gap: spacing.sm + 4, padding: spacing.md }}>
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
