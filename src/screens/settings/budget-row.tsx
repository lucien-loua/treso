import { Alert } from "react-native";

import { useMonthlyBudget } from "@/data/settings";
import { useMoney } from "@/hooks/use-money";
import { useI18n } from "@/i18n/context";
import { haptics } from "@/utils/haptics";

import { NumberRow } from "./number-row";

/** Monthly budget, shown in the currency on screen even when it was set in another one. */
export const BudgetRow = () => {
  const { t } = useI18n();
  const money = useMoney();
  const [budget, setBudget] = useMonthlyBudget();

  const save = (text: string) => {
    if (text === "") {
      setBudget(null);
      return;
    }
    const amountCents = money.parse(text);
    if (amountCents === null) {
      Alert.alert(t.settings.invalidAmount, t.settings.invalidAmountHint);
      return;
    }
    setBudget({ amountCents, currency: money.code });
    haptics.success();
  };

  return (
    <NumberRow
      label={t.settings.amount}
      value={budget ? money.toInput(money.amountOf(budget)) : ""}
      unit={money.symbol}
      placeholder={t.settings.none}
      accessibilityLabel={t.settings.budgetIn(money.symbol)}
      decimals={money.decimals > 0}
      onSave={save}
    />
  );
};
