import { FieldGroup, Host, Text } from "@expo/ui";
import { scrollDismissesKeyboard } from "@expo/ui/swift-ui/modifiers";

import { useExchangeRates } from "@/data/exchange-rates";
import { useInk } from "@/hooks/use-ink";
import { useI18n } from "@/i18n/context";
import { parseISODate } from "@/lib/datetime";
import { haptics } from "@/utils/haptics";

import { RateRow } from "./rate-row";
import { SwitchRow } from "./switch-row";

const isIOS = process.env.EXPO_OS === "ios";

/**
 * Settings › Exchange rates: the suggested ones, downloaded daily, or the user's own, one row
 * per currency against the dollar.
 */
export const ExchangeRates = () => {
  const ink = useInk();
  const { t, currencies, dates } = useI18n();
  const rates = useExchangeRates();
  const dollar = currencies.find(rates.active.base) ?? currencies.default;
  const quoted = currencies.all.filter(({ code }) => code !== dollar.code);
  const date = dates.longDate(parseISODate(rates.active.date));

  return (
    <Host style={{ flex: 1 }} seedColor={isIOS ? ink.tint : undefined}>
      <FieldGroup
        modifiers={
          isIOS ? [scrollDismissesKeyboard("interactively")] : undefined
        }
      >
        <FieldGroup.Section>
          <SwitchRow
            label={t.settings.rates.useSuggested}
            value={!rates.manual}
            onValueChange={(suggested) => {
              haptics.selection();
              rates.setManual(!suggested);
            }}
          />
          {quoted.map((currency) => (
            <RateRow
              key={currency.code}
              currency={currency}
              dollar={dollar}
              rate={rates.active.rates[currency.code] ?? 0}
              editable={rates.manual}
              onSave={(rate) => rates.setRate(currency.code, rate)}
            />
          ))}
          <FieldGroup.SectionFooter>
            <Text textStyle={ink.footnote}>
              {rates.manual
                ? t.settings.rates.manualFooter(date)
                : t.settings.rates.suggestedFooter(date)}
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
};
