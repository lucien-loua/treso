import type { TextInputRef } from "@expo/ui";
import { Button, Row, Spacer, Text, TextInput } from "@expo/ui";
import { useRef, useState } from "react";
import { Alert } from "react-native";

import { useMonthlyBudget } from "@/data/settings";
import { useInk } from "@/hooks/use-ink";
import { useMoney } from "@/hooks/use-money";
import { useI18n } from "@/i18n/context";
import { spacing } from "@/theme";
import { haptics } from "@/utils/haptics";

/** Room for an amount such as « 1 500 000 »: without it, Compose shrinks the field to nothing. */
const BUDGET_FIELD_WIDTH = 140;

/**
 * Monthly budget field. Saves when it loses focus. The iOS number pad has no return key,
 * so an "OK" button shows while typing.
 */
export const BudgetRow = () => {
  const ink = useInk();
  const { t } = useI18n();
  const money = useMoney();
  const [budget, setBudget] = useMonthlyBudget();
  const draft = useRef(budget ? money.toInput(budget) : "");
  const input = useRef<TextInputRef>(null);
  const [editing, setEditing] = useState(false);

  const save = () => {
    const text = draft.current.trim();
    if (text === "") {
      setBudget(null);
      return;
    }
    const cents = money.parse(text);
    if (cents === null) {
      Alert.alert(t.settings.invalidAmount, t.settings.invalidAmountHint);
      return;
    }
    setBudget(cents);
    haptics.success();
  };

  return (
    <Row alignment="center" spacing={spacing.smd}>
      <Text textStyle={{ color: ink.label }}>{t.settings.amount}</Text>
      <Spacer flexible />
      <TextInput
        ref={input}
        defaultValue={budget ? money.toInput(budget) : ""}
        placeholder={t.settings.none}
        accessibilityLabel={t.settings.budgetIn(money.symbol)}
        keyboardType={money.decimals > 0 ? "decimal-pad" : "number-pad"}
        returnKeyType="done"
        textAlign="right"
        style={{ width: BUDGET_FIELD_WIDTH }}
        maxLength={12}
        onChangeText={(text) => {
          draft.current = text;
        }}
        onFocus={() => setEditing(true)}
        onSubmitEditing={() => input.current?.blur()}
        onBlur={() => {
          setEditing(false);
          save();
        }}
      />
      <Text textStyle={{ color: ink.secondaryLabel }}>{money.symbol}</Text>
      {editing ? (
        <Button
          variant="text"
          label={t.actions.ok}
          onPress={() => input.current?.blur()}
        />
      ) : null}
    </Row>
  );
};
