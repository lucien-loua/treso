import {
  FieldGroup,
  Host,
  Icon,
  ListItem,
  Picker,
  Row,
  Spacer,
  Text,
} from "@expo/ui";
import { scrollDismissesKeyboard } from "@expo/ui/swift-ui/modifiers";
import Constants from "expo-constants";
import { router } from "expo-router";

import { useExchangeRates } from "@/data/exchange-rates";
import { useCurrencyCode } from "@/data/settings";
import { useTransactions } from "@/data/transactions-provider";
import { useDataTransfer } from "@/hooks/use-data-transfer";
import { useInk } from "@/hooks/use-ink";
import { useMoney } from "@/hooks/use-money";
import { useI18n } from "@/i18n/context";
import { parseISODate } from "@/lib/datetime";
import { confirm } from "@/utils/alerts";
import { haptics } from "@/utils/haptics";

import { BudgetRow } from "./budget-row";
import { RemindersRow } from "./reminders-row";

const isIOS = process.env.EXPO_OS === "ios";
/** iOS draws a disclosure chevron on rows that open a screen; Android settings don't. */
const CHEVRON_SIZE = 13;

export const Settings = () => {
  const ink = useInk();
  const { t, currencies, dates } = useI18n();
  const money = useMoney();
  const [, setCurrencyCode] = useCurrencyCode();
  const rates = useExchangeRates();
  const ratesSummary = rates.manual
    ? t.settings.rates.own
    : t.settings.rates.suggested(
        dates.longDate(parseISODate(rates.active.date))
      );
  const { transactions, schedules, removeAll } = useTransactions();
  const { exportBackup, exportCsv, importBackup } = useDataTransfer();
  const chevron = isIOS ? (
    <Icon name="chevron.right" size={CHEVRON_SIZE} color={ink.tertiaryLabel} />
  ) : undefined;

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
          <ListItem
            onPress={() => router.push("/personalize")}
            supportingText={t.settings.personalizeHint}
            trailing={chevron}
          >
            <Text textStyle={{ color: ink.label }}>
              {t.settings.personalize}
            </Text>
          </ListItem>
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
          <ListItem
            onPress={() => router.push("/settings/rates")}
            supportingText={ratesSummary}
            trailing={chevron}
          >
            <Text textStyle={{ color: ink.label }}>
              {t.settings.rates.title}
            </Text>
          </ListItem>
          <FieldGroup.SectionFooter>
            <Text textStyle={ink.footnote}>{t.settings.currencyFooter}</Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title={t.settings.budget}>
          <BudgetRow />
          <FieldGroup.SectionFooter>
            <Text textStyle={ink.footnote}>{t.settings.budgetFooter}</Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title={t.settings.reminders.title}>
          <RemindersRow />
          <FieldGroup.SectionFooter>
            <Text textStyle={ink.footnote}>{t.settings.reminders.footer}</Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title={t.settings.data}>
          <ListItem onPress={exportBackup}>
            <Text textStyle={{ color: ink.tint }}>
              {t.transfer.exportBackup}
            </Text>
          </ListItem>
          <ListItem onPress={importBackup}>
            <Text textStyle={{ color: ink.tint }}>
              {t.transfer.importBackup}
            </Text>
          </ListItem>
          <ListItem onPress={exportCsv}>
            <Text textStyle={{ color: ink.tint }}>{t.transfer.exportCsv}</Text>
          </ListItem>
          <ListItem onPress={confirmReset}>
            <Text textStyle={{ color: ink.danger }}>{t.settings.eraseAll}</Text>
          </ListItem>
          <FieldGroup.SectionFooter>
            <Text textStyle={ink.footnote}>{t.transfer.footer}</Text>
          </FieldGroup.SectionFooter>
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
