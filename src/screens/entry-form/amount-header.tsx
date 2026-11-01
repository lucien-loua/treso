import { SegmentedControl } from "@expo/ui/community/segmented-control";
import type { ComponentRef, RefObject } from "react";
import { TextInput, View } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import type { TransactionType } from "@/data/types";
import { useI18n } from "@/i18n/context";
import type { Currency } from "@/lib/currency";
import { colors, spacing, type } from "@/theme";

const TYPES: TransactionType[] = ["expense", "income"];

/** Big amount field, then the expense / income switch. Sits first so focusing it never hides anything. */
export const AmountHeader = ({
  inputRef,
  amountText,
  onAmountChange,
  money,
  kind,
  onKindChange,
  intro,
  hint,
  showKindPicker,
}: {
  inputRef: RefObject<ComponentRef<typeof TextInput> | null>;
  amountText: string;
  onAmountChange: (text: string) => void;
  money: Currency;
  kind: TransactionType;
  onKindChange: (kind: TransactionType) => void;
  /** Context line above the amount, e.g. which due date is being paid. */
  intro?: string;
  /** Explanation under the amount. */
  hint?: string;
  showKindPicker: boolean;
}) => {
  const { t } = useI18n();
  return (
    <View
      style={{ alignItems: "center", gap: spacing.md, paddingTop: spacing.sm }}
    >
      {intro ? (
        <ThemedText variant="subhead" style={{ textAlign: "center" }}>
          {intro}
        </ThemedText>
      ) : null}
      <View
        style={{
          alignItems: "baseline",
          flexDirection: "row",
          gap: spacing.xs,
        }}
      >
        <TextInput
          ref={inputRef}
          value={amountText}
          onChangeText={onAmountChange}
          placeholder="0"
          placeholderTextColor={colors.tertiaryLabel}
          keyboardType={money.decimals > 0 ? "decimal-pad" : "number-pad"}
          accessibilityLabel={t.form.amountIn(money.symbol)}
          selectionColor={colors.tint}
          style={[
            type.hero,
            {
              color: kind === "income" ? colors.income : colors.label,
              minWidth: 60,
              padding: 0,
              textAlign: "center",
            },
          ]}
        />
        <ThemedText variant="title" style={{ color: colors.secondaryLabel }}>
          {money.symbol}
        </ThemedText>
      </View>
      {hint ? (
        <ThemedText variant="footnote" style={{ textAlign: "center" }}>
          {hint}
        </ThemedText>
      ) : null}
      {showKindPicker ? (
        <SegmentedControl
          values={TYPES.map((value) => t.form[value])}
          selectedIndex={TYPES.indexOf(kind)}
          onChange={(event) =>
            onKindChange(TYPES[event.nativeEvent.selectedSegmentIndex])
          }
          accessibilityLabel={t.form.kind}
          style={{ alignSelf: "stretch" }}
        />
      ) : null}
    </View>
  );
};
