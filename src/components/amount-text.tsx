import type { TextStyle } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import type { TypeVariant } from "@/theme";
import { colors } from "@/theme";
import { formatMoney } from "@/utils/money";

/** A money amount with aligned digits, e.g. « 25 000 F CFA ». */
export const AmountText = ({
  cents,
  currency,
  showPlus = false,
  variant = "body",
  style,
}: {
  cents: number;
  currency: string;
  showPlus?: boolean;
  variant?: TypeVariant;
  style?: TextStyle;
}) => (
  <ThemedText
    variant={variant}
    selectable
    style={[{ fontVariant: ["tabular-nums"] }, style]}
  >
    {formatMoney(cents, currency, { showPlus })}
  </ThemedText>
);

/** Income in green with « + », expenses with « − »: how amounts read in lists. */
export const SignedAmount = ({
  cents,
  currency,
  variant = "body",
}: {
  cents: number;
  currency: string;
  variant?: TypeVariant;
}) => (
  <AmountText
    cents={cents}
    currency={currency}
    showPlus
    variant={variant}
    style={{
      color: cents > 0 ? colors.income : colors.expense,
      fontWeight: "600",
    }}
  />
);
