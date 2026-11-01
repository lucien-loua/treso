import { SymbolView } from "expo-symbols";
import type { SymbolViewProps } from "expo-symbols";
import { View } from "react-native";
import type { ColorValue } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { colors, radius, spacing } from "@/theme";
import { formatMonth, shiftMonth } from "@/utils/dates";
import type { MonthKey } from "@/utils/dates";
import { formatMoney } from "@/utils/money";
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
        style={{ height: 14, width: 14 }}
      />
    </View>
    <View style={{ flex: 1 }}>
      <ThemedText variant="caption">{label}</ThemedText>
      <ThemedText
        variant="headline"
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
  currency,
}: {
  summary: MonthSummary;
  month: MonthKey;
  isCurrentMonth: boolean;
  /** Expected end-of-month balance once the remaining schedules are settled; `null` hides the line. */
  forecastCents: number | null;
  currency: string;
}) => {
  const previousMonth = formatMonth(shiftMonth(month, -1)).toLowerCase();
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderCurve: "continuous",
        borderRadius: radius.xl,
        gap: spacing.md,
        padding: spacing.lg - 4,
      }}
    >
      <View style={{ gap: spacing.xs }}>
        <ThemedText variant="subhead">
          {isCurrentMonth
            ? "Solde actuel"
            : `Solde fin ${formatMonth(month).toLowerCase()}`}
        </ThemedText>
        <ThemedText
          variant="hero"
          selectable
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{
            color: summary.closingCents < 0 ? colors.danger : colors.label,
          }}
        >
          {formatMoney(summary.closingCents, currency)}
        </ThemedText>
        <ThemedText variant="footnote" selectable>
          Report de {previousMonth} :{" "}
          {formatMoney(summary.openingCents, currency)} · Ce mois :{" "}
          {formatMoney(summary.balanceCents, currency, { showPlus: true })}
        </ThemedText>
      </View>
      {forecastCents === null ? null : (
        <View
          accessible
          style={{
            alignItems: "center",
            backgroundColor: colors.fill,
            borderCurve: "continuous",
            borderRadius: radius.md,
            flexDirection: "row",
            gap: spacing.sm,
            justifyContent: "space-between",
            paddingHorizontal: spacing.sm + 4,
            paddingVertical: spacing.sm,
          }}
        >
          <View style={{ flexShrink: 1 }}>
            <ThemedText variant="subhead" style={{ color: colors.label }}>
              Prévu fin {formatMonth(month).toLowerCase().split(" ")[0]}
            </ThemedText>
            <ThemedText variant="caption">
              Après les échéances à venir
            </ThemedText>
          </View>
          <ThemedText
            variant="headline"
            selectable
            style={{
              color: forecastCents < 0 ? colors.danger : colors.label,
              fontVariant: ["tabular-nums"],
            }}
          >
            {formatMoney(forecastCents, currency)}
          </ThemedText>
        </View>
      )}
      <View style={{ backgroundColor: colors.separator, height: 0.5 }} />
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <Flow
          icon={{
            android: "arrow_downward",
            ios: "arrow.down",
            web: "arrow_downward",
          }}
          color={colors.income}
          label="Revenus"
          value={formatMoney(summary.incomeCents, currency)}
        />
        <Flow
          icon={{
            android: "arrow_upward",
            ios: "arrow.up",
            web: "arrow_upward",
          }}
          color={colors.danger}
          label="Dépenses"
          value={formatMoney(summary.expenseCents, currency)}
        />
      </View>
    </View>
  );
};
