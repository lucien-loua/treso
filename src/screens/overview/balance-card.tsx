import { SymbolView } from "expo-symbols";
import type { SymbolViewProps } from "expo-symbols";
import { View } from "react-native";
import type { ColorValue } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { symbols } from "@/constants/symbols";
import { useMoney } from "@/hooks/use-money";
import { useI18n } from "@/i18n/context";
import type { MonthKey } from "@/lib/datetime";
import { colors, glyph, radius, spacing } from "@/theme";
import type { MonthSummary } from "@/utils/stats";

const Flow = ({
  icon,
  color,
  label,
  value,
}: {
  icon: SymbolViewProps["name"];
  color: ColorValue;
  label: string;
  value: string;
}) => (
  <View
    style={{
      alignItems: "center",
      flex: 1,
      flexDirection: "row",
      gap: spacing.sm,
    }}
  >
    <View
      style={{
        alignItems: "center",
        backgroundColor: colors.fill,
        borderRadius: radius.full,
        height: 32,
        justifyContent: "center",
        width: 32,
      }}
    >
      <SymbolView
        name={icon}
        tintColor={color}
        weight="bold"
        resizeMode="scaleAspectFit"
        size={glyph.md}
      />
    </View>
    <View style={{ flex: 1 }}>
      <ThemedText variant="caption">{label}</ThemedText>
      <ThemedText
        variant="headlineFitted"
        selectable
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {value}
      </ThemedText>
    </View>
  </View>
);

export const BalanceCard = ({
  summary,
  month,
  isCurrentMonth,
  forecastCents,
}: {
  summary: MonthSummary;
  month: MonthKey;
  isCurrentMonth: boolean;
  /** Expected end-of-month balance once the remaining schedules are settled; `null` hides the line. */
  forecastCents: number | null;
}) => {
  const { t, dates } = useI18n();
  const money = useMoney();
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderCurve: "continuous",
        borderRadius: radius.xl,
        gap: spacing.md,
        padding: spacing.lg,
      }}
    >
      <View style={{ gap: spacing.xs }}>
        <ThemedText variant="subhead">
          {isCurrentMonth
            ? t.overview.currentBalance
            : t.overview.balanceAtEnd(dates.monthInText(month))}
        </ThemedText>
        <ThemedText
          variant="heroFitted"
          selectable
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{
            color: summary.closingCents < 0 ? colors.danger : colors.label,
          }}
        >
          {money.format(summary.closingCents)}
        </ThemedText>
        <ThemedText variant="footnote" selectable>
          {t.overview.thisMonth(
            money.format(summary.balanceCents, { sign: "always" })
          )}
        </ThemedText>
      </View>
      {forecastCents === null ? null : (
        <View
          accessible
          style={{
            alignItems: "baseline",
            flexDirection: "row",
            gap: spacing.sm,
            justifyContent: "space-between",
          }}
        >
          <ThemedText
            variant="subhead"
            style={{ color: colors.label, flexShrink: 1 }}
          >
            {t.overview.forecast(dates.monthName(month))}
          </ThemedText>
          <ThemedText
            variant="headline"
            selectable
            style={{
              color: forecastCents < 0 ? colors.danger : colors.label,
              fontVariant: ["tabular-nums"],
            }}
          >
            {money.format(forecastCents)}
          </ThemedText>
        </View>
      )}
      <View style={{ backgroundColor: colors.separator, height: 0.5 }} />
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <Flow
          icon={symbols.arrowDown}
          color={colors.income}
          label={t.overview.income}
          value={money.format(summary.incomeCents)}
        />
        <Flow
          icon={symbols.arrowUp}
          color={colors.danger}
          label={t.overview.expenses}
          value={money.format(summary.expenseCents)}
        />
      </View>
    </View>
  );
};
