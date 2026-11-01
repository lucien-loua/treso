import { View } from "react-native";

import { AmountText } from "@/components/amount-text";
import { ThemedText } from "@/components/ui/themed-text";
import { spacing } from "@/theme";
import { formatDayTitle } from "@/utils/dates";

/** « Aujourd’hui · +1 430 000 F CFA »: a day's title and its net total. */
export const DayHeader = ({
  date,
  netCents,
  currency,
}: {
  date: string;
  netCents: number;
  currency: string;
}) => (
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
      {formatDayTitle(date)}
    </ThemedText>
    <AmountText
      cents={netCents}
      currency={currency}
      showPlus
      variant="footnote"
    />
  </View>
);
