import type { TextInputRef } from "@expo/ui";
import { Button, Row, Text, TextInput } from "@expo/ui";
import { useRef, useState } from "react";
import { Alert } from "react-native";

import { useCurrency, useMonthlyBudget } from "@/data/settings";
import { useInk } from "@/hooks/use-ink";
import { spacing } from "@/theme";
import { haptics } from "@/utils/haptics";
import {
  centsToInput,
  currencyDecimals,
  currencySymbol,
  parseAmount,
} from "@/utils/money";

/**
 * Monthly budget field. Saves when it loses focus. The iOS number pad has no return key,
 * so an « OK » button shows while typing.
 */
export const BudgetRow = () => {
  const ink = useInk();
  const [currency] = useCurrency();
  const [budget, setBudget] = useMonthlyBudget();
  const draft = useRef(budget ? centsToInput(budget) : "");
  const input = useRef<TextInputRef>(null);
  const [editing, setEditing] = useState(false);
  const decimals = currencyDecimals(currency);

  const save = () => {
    const text = draft.current.trim();
    if (text === "") {
      setBudget(null);
      return;
    }
    const cents = parseAmount(text, decimals);
    if (cents === null) {
      Alert.alert(
        "Montant invalide",
        "Saisissez un nombre positif, par exemple 150000."
      );
      return;
    }
    setBudget(cents);
    haptics.success();
  };

  return (
    <Row alignment="center" spacing={spacing.smd}>
      <Text textStyle={{ color: ink.label }}>Montant</Text>
      <TextInput
        ref={input}
        defaultValue={budget ? centsToInput(budget) : ""}
        placeholder="Aucun"
        accessibilityLabel={`Budget mensuel en ${currencySymbol(currency)}`}
        keyboardType={decimals > 0 ? "decimal-pad" : "number-pad"}
        returnKeyType="done"
        textAlign="right"
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
      <Text textStyle={{ color: ink.secondaryLabel }}>
        {currencySymbol(currency)}
      </Text>
      {editing ? (
        <Button
          variant="text"
          label="OK"
          onPress={() => input.current?.blur()}
        />
      ) : null}
    </Row>
  );
};
