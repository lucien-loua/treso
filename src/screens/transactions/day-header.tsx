import { View } from "react-native";

import { AmountText } from "@/components/amount-text";
import { ThemedText } from "@/components/ui/themed-text";
import { useI18n } from "@/i18n/context";
import { spacing } from "@/theme";

/** « Aujourd’hui · +1 430 000 F CFA »: a day's title and its net total. */
export const DayHeader = ({
  date,
  netCents,
}: {
  date: string;
  netCents: number;
}) => {
  const { dates } = useI18n();
  return (
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
        {dates.dayTitle(date)}
      </ThemedText>
      <AmountText cents={netCents} showPlus variant="footnote" />
    </View>
  );
};
