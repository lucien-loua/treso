import { useState } from "react";
import { TextInput, View } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { useExchange } from "@/data/exchange-rates";
import { useI18n } from "@/i18n/context";
import { colors, spacing, type } from "@/theme";
import { sanitizeAmount } from "@/utils/amount-input";

import { useOnboarding } from "./context";
import { StepScreen } from "./step-screen";

const MIN_FIELD_WIDTH = 60;

/** Last step: an optional monthly budget, in the currency picked first. Empty means none. */
export const BudgetStep = () => {
  const { t, currencies } = useI18n();
  const { mode, draft, finish } = useOnboarding();
  const exchange = useExchange();
  const money = currencies.find(draft.currency) ?? currencies.default;
  const [text, setText] = useState(() =>
    draft.budget
      ? money.toInput(
          exchange.convert(
            draft.budget.amountCents,
            draft.budget.currency,
            money.code
          )
        )
      : ""
  );

  return (
    <StepScreen
      title={t.onboarding.budget.title}
      subtitle={t.onboarding.budget.subtitle}
      actionLabel={mode === "first" ? t.onboarding.finish : t.actions.save}
      onAction={() => {
        const amountCents = money.parse(text);
        finish(
          amountCents === null ? null : { amountCents, currency: money.code }
        );
      }}
    >
      <View
        style={{
          alignItems: "baseline",
          flexDirection: "row",
          gap: spacing.xs,
          justifyContent: "center",
          paddingVertical: spacing.lg,
        }}
      >
        <TextInput
          value={text}
          onChangeText={(next) => setText(sanitizeAmount(next, money))}
          placeholder="0"
          placeholderTextColor={colors.tertiaryLabel}
          keyboardType={money.decimals > 0 ? "decimal-pad" : "number-pad"}
          accessibilityLabel={t.settings.budgetIn(money.symbol)}
          selectionColor={colors.tint}
          style={[
            type.hero,
            {
              color: colors.label,
              minWidth: MIN_FIELD_WIDTH,
              padding: 0,
              textAlign: "center",
            },
          ]}
        />
        <ThemedText variant="title" style={{ color: colors.secondaryLabel }}>
          {money.symbol}
        </ThemedText>
      </View>
    </StepScreen>
  );
};
