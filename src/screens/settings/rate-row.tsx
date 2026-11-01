import { Row, Spacer, Text } from "@expo/ui";
import { Alert } from "react-native";

import { useInk } from "@/hooks/use-ink";
import { useI18n } from "@/i18n/context";
import type { Currency } from "@/lib/currency";
import { haptics } from "@/utils/haptics";

import { NumberRow } from "./number-row";

/** One dollar, the unit every rate is quoted for. */
const ONE_DOLLAR = 100;

/**
 * "1,00 $US = 585,46 F CFA": how many units of `currency` one dollar buys. Shown as text while
 * the suggested rates are used, as a field when the user enters their own.
 */
export const RateRow = ({
  currency,
  dollar,
  rate,
  editable,
  onSave,
}: {
  currency: Currency;
  dollar: Currency;
  rate: number;
  editable: boolean;
  onSave: (rate: number) => void;
}) => {
  const ink = useInk();
  const { t, numbers } = useI18n();
  const label = t.settings.rates.per(dollar.format(ONE_DOLLAR));

  if (!editable) {
    return (
      <Row alignment="center">
        <Text textStyle={{ color: ink.label }}>{label}</Text>
        <Spacer flexible />
        <Text textStyle={{ color: ink.secondaryLabel }}>
          {`${numbers.format(rate)} ${currency.symbol}`}
        </Text>
      </Row>
    );
  }

  return (
    <NumberRow
      label={label}
      value={numbers.toInput(rate)}
      unit={currency.symbol}
      accessibilityLabel={t.settings.rates.rateOf(
        currency.symbol,
        dollar.format(ONE_DOLLAR)
      )}
      decimals
      onSave={(text) => {
        const typed = numbers.parse(text);
        if (typed === null) {
          Alert.alert(t.settings.rates.invalid, t.settings.rates.invalidHint);
          return;
        }
        onSave(typed);
        haptics.success();
      }}
    />
  );
};
