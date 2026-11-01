import {
  FieldGroup,
  Host,
  ListItem,
  Picker,
  Row,
  Spacer,
  Text,
} from "@expo/ui";
import { scrollDismissesKeyboard } from "@expo/ui/swift-ui/modifiers";
import Constants from "expo-constants";
import { router } from "expo-router";

import { entryTitle, signedAmount } from "@/data/entries";
import { useExchangeRates } from "@/data/exchange-rates";
import { useCurrencyCode } from "@/data/settings";
import { useTransactions } from "@/data/transactions-provider";
import type { Schedule } from "@/data/types";
import { useInk } from "@/hooks/use-ink";
import { useLoadSampleData } from "@/hooks/use-load-sample-data";
import { useMoney } from "@/hooks/use-money";
import { useI18n } from "@/i18n/context";
import type { Messages } from "@/i18n/messages/fr";
import { parseISODate } from "@/lib/datetime";
import { confirm } from "@/utils/alerts";
import { haptics } from "@/utils/haptics";

import { BudgetRow } from "./budget-row";
import { RateRow } from "./rate-row";
import { SwitchRow } from "./switch-row";

const isIOS = process.env.EXPO_OS === "ios";

const scheduleSummary = (schedule: Schedule, t: Messages) =>
  t.schedules.eachMonth[schedule.type](t.dayOfMonth(schedule.dayOfMonth));

export const Settings = () => {
  const ink = useInk();
  const { t, currencies, dates } = useI18n();
  const money = useMoney();
  const [, setCurrencyCode] = useCurrencyCode();
  const rates = useExchangeRates();
  // Every rate is quoted against the dollar: one row per other currency
  const dollar = currencies.find(rates.active.base) ?? currencies.default;
  const quotedCurrencies = currencies.all.filter(
    ({ code }) => code !== dollar.code
  );
  const ratesDate = dates.longDate(parseISODate(rates.active.date));
  const { transactions, schedules, removeAll } = useTransactions();
  const loadSamples = useLoadSampleData();

  const confirmReset = () => {
    haptics.warning();
    confirm({
      cancelLabel: t.actions.cancel,
      confirmLabel: t.settings.eraseConfirm,
      destructive: true,
      failureTitle: t.errors.deleteFailed,
      message: t.settings.eraseMessage(transactions.length, schedules.length),
      onConfirm: removeAll,
      title: t.settings.eraseTitle,
    });
  };

  return (
    <Host style={{ flex: 1 }} seedColor={isIOS ? ink.tint : undefined}>
      <FieldGroup
        modifiers={
          isIOS ? [scrollDismissesKeyboard("interactively")] : undefined
        }
      >
        <FieldGroup.Section title={t.settings.preferences}>
          <Row alignment="center">
            <Text textStyle={{ color: ink.label }}>{t.settings.currency}</Text>
            <Spacer flexible />
            <Picker selectedValue={money.code} onValueChange={setCurrencyCode}>
              {currencies.all.map((currency) => (
                <Picker.Item
                  key={currency.code}
                  label={`${t.currencies[currency.code] ?? currency.code} (${currency.symbol})`}
                  value={currency.code}
                />
              ))}
            </Picker>
          </Row>
          <FieldGroup.SectionFooter>
            <Text textStyle={ink.footnote}>{t.settings.currencyFooter}</Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title={t.settings.rates.title}>
          <SwitchRow
            label={t.settings.rates.useSuggested}
            value={!rates.manual}
            onValueChange={(suggested) => {
              haptics.selection();
              rates.setManual(!suggested);
            }}
          />
          {quotedCurrencies.map((currency) => (
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
                ? t.settings.rates.manualFooter(ratesDate)
                : t.settings.rates.suggestedFooter(ratesDate)}
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title={t.settings.budget}>
          <BudgetRow />
          <FieldGroup.SectionFooter>
            <Text textStyle={ink.footnote}>{t.settings.budgetFooter}</Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title={t.settings.schedules}>
          {schedules.map((schedule) => (
            <ListItem
              key={schedule.id}
              onPress={() => router.push(`/schedule/${schedule.id}`)}
              supportingText={scheduleSummary(schedule, t)}
              trailing={
                <Text
                  textStyle={{
                    color: schedule.type === "income" ? ink.income : ink.label,
                  }}
                >
                  {money.format(signedAmount(schedule, money.amountOf), {
                    sign: "always",
                  })}
                </Text>
              }
            >
              <Text textStyle={{ color: ink.label }}>
                {entryTitle(schedule, t)}
              </Text>
            </ListItem>
          ))}
          <ListItem onPress={() => router.push("/schedule/new")}>
            <Text textStyle={{ color: ink.tint }}>
              {t.settings.addSchedule}
            </Text>
          </ListItem>
          <FieldGroup.SectionFooter>
            <Text textStyle={ink.footnote}>{t.settings.schedulesFooter}</Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title={t.settings.data}>
          <Row alignment="center">
            <Text textStyle={{ color: ink.label }}>{t.settings.recorded}</Text>
            <Spacer flexible />
            <Text textStyle={{ color: ink.secondaryLabel }}>
              {String(transactions.length)}
            </Text>
          </Row>
          <ListItem onPress={loadSamples}>
            <Text textStyle={{ color: ink.tint }}>{t.settings.addSamples}</Text>
          </ListItem>
          <ListItem onPress={confirmReset}>
            <Text textStyle={{ color: ink.danger }}>{t.settings.eraseAll}</Text>
          </ListItem>
        </FieldGroup.Section>

        <FieldGroup.Section title={t.settings.about}>
          <Row alignment="center">
            <Text textStyle={{ color: ink.label }}>{t.settings.version}</Text>
            <Spacer flexible />
            <Text textStyle={{ color: ink.secondaryLabel }}>
              {Constants.expoConfig?.version ?? "1.0.0"}
            </Text>
          </Row>
          <FieldGroup.SectionFooter>
            <Text textStyle={ink.footnote}>{t.settings.privacy}</Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
};
