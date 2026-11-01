import type { TextStyle } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { useMoney } from "@/hooks/use-money";
import type { TypeVariant } from "@/theme";
import { colors } from "@/theme";

/** A money amount in the chosen currency, with aligned digits, e.g. « 25 000 F CFA ». */
export const AmountText = ({
  cents,
  showPlus = false,
  variant = "body",
  style,
}: {
  cents: number;
  showPlus?: boolean;
  variant?: TypeVariant;
  style?: TextStyle;
}) => {
  const money = useMoney();
  return (
    <ThemedText
      variant={variant}
      selectable
      style={[{ fontVariant: ["tabular-nums"] }, style]}
    >
      {money.format(cents, { sign: showPlus ? "always" : "auto" })}
    </ThemedText>
  );
};

/** Income in green with « + », expenses with « − »: how amounts read in lists. */
export const SignedAmount = ({
  cents,
  variant = "body",
}: {
  cents: number;
  variant?: TypeVariant;
}) => (
  <AmountText
    cents={cents}
    showPlus
    variant={variant}
    style={{
      color: cents > 0 ? colors.income : colors.expense,
      fontWeight: "600",
    }}
  />
);
