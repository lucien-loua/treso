import { View } from "react-native";

import { GroupedSection } from "@/components/ui/grouped-section";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ThemedText } from "@/components/ui/themed-text";
import { useMoney } from "@/hooks/use-money";
import { useI18n } from "@/i18n/context";
import { daysLeftInMonth } from "@/lib/datetime";
import type { MonthKey } from "@/lib/datetime";
import { colors, spacing } from "@/theme";

/** Share of the budget spent from which the bar turns orange. */
const WARNING_RATIO = 0.8;

/** The month's spending against the budget set in Settings. */
export const BudgetCard = ({
  budgetCents,
  spentCents,
  month,
}: {
  budgetCents: number;
  spentCents: number;
  month: MonthKey;
}) => {
  const { t, percent } = useI18n();
  const money = useMoney();
  const texts = t.overview.budget;

  const ratio = spentCents / budgetCents;
  const remaining = budgetCents - spentCents;
  const daysLeft = daysLeftInMonth(month);
  let barColor = colors.tint;
  if (ratio >= 1) {
    barColor = colors.danger;
  } else if (ratio >= WARNING_RATIO) {
    barColor = colors.warning;
  }

  let hint = texts.spentOf(money.format(spentCents), money.format(budgetCents));
  if (remaining > 0 && daysLeft > 0) {
    hint += ` · ${texts.perDay(money.format(Math.floor(remaining / daysLeft)), daysLeft)}`;
  }

  return (
    <GroupedSection
      title={texts.title}
      accessory={
        <ThemedText variant="footnote">{texts.used(percent(ratio))}</ThemedText>
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
            ? texts.left(money.format(remaining))
            : texts.over(money.format(-remaining))}
        </ThemedText>
        <ProgressBar value={ratio} color={barColor} height={8} />
        <ThemedText variant="footnote">{hint}</ThemedText>
      </View>
    </GroupedSection>
  );
};
