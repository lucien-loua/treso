import { SegmentedControl } from "@expo/ui/community/segmented-control";
import type { ComponentRef, RefObject } from "react";
import { TextInput, View } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import type { TransactionType } from "@/data/types";
import { colors, spacing, type } from "@/theme";
import { currencySymbol } from "@/utils/money";

const types: { value: TransactionType; label: string }[] = [
  { label: "Dépense", value: "expense" },
  { label: "Revenu", value: "income" },
];

/** Big amount field, then the expense / income switch. Sits first so focusing it never hides anything. */
export const AmountHeader = ({
  inputRef,
  amountText,
  onAmountChange,
  decimals,
  currency,
  kind,
  onKindChange,
  intro,
  hint,
  showKindPicker,
}: {
  inputRef: RefObject<ComponentRef<typeof TextInput> | null>;
  amountText: string;
  onAmountChange: (text: string) => void;
  decimals: number;
  currency: string;
  kind: TransactionType;
  onKindChange: (kind: TransactionType) => void;
  /** Context line above the amount, e.g. which due date is being paid. */
  intro?: string;
  /** Explanation under the amount. */
  hint?: string;
  showKindPicker: boolean;
}) => (
  <View
    style={{ alignItems: "center", gap: spacing.md, paddingTop: spacing.sm }}
  >
    {intro ? (
      <ThemedText variant="subhead" style={{ textAlign: "center" }}>
        {intro}
      </ThemedText>
    ) : null}
    <View
      style={{ alignItems: "baseline", flexDirection: "row", gap: spacing.xs }}
    >
      <TextInput
        ref={inputRef}
        value={amountText}
        onChangeText={onAmountChange}
        placeholder="0"
        placeholderTextColor={colors.tertiaryLabel}
        keyboardType={decimals > 0 ? "decimal-pad" : "number-pad"}
        accessibilityLabel={`Montant en ${currencySymbol(currency)}`}
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
        {currencySymbol(currency)}
      </ThemedText>
    </View>
    {hint ? (
      <ThemedText variant="footnote" style={{ textAlign: "center" }}>
        {hint}
      </ThemedText>
    ) : null}
    {showKindPicker ? (
      <SegmentedControl
        values={types.map((t) => t.label)}
        selectedIndex={types.findIndex((t) => t.value === kind)}
        onChange={(event) =>
          onKindChange(types[event.nativeEvent.selectedSegmentIndex].value)
        }
        accessibilityLabel="Dépense ou revenu"
        style={{ alignSelf: "stretch" }}
      />
    ) : null}
  </View>
);
