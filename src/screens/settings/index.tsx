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

import { entryTitle, signedCents } from "@/data/entries";
import { currencies, useCurrency } from "@/data/settings";
import { useTransactions } from "@/data/transactions-provider";
import type { Schedule } from "@/data/types";
import { useInk } from "@/hooks/use-ink";
import { useLoadSampleData } from "@/hooks/use-load-sample-data";
import { confirm } from "@/utils/alerts";
import { formatDayOfMonth } from "@/utils/dates";
import { haptics } from "@/utils/haptics";
import { formatMoney } from "@/utils/money";

import { BudgetRow } from "./budget-row";

const isIOS = process.env.EXPO_OS === "ios";

const scheduleSummary = (schedule: Schedule) =>
  `${schedule.type === "income" ? "Vers" : "Avant"} le ${formatDayOfMonth(schedule.dayOfMonth)} de chaque mois`;

export const Settings = () => {
  const ink = useInk();
  const [currency, setCurrency] = useCurrency();
  const { transactions, schedules, removeAll } = useTransactions();
  const loadSamples = useLoadSampleData();

  const confirmReset = () => {
    haptics.warning();
    confirm({
      confirmLabel: "Tout effacer",
      destructive: true,
      failureTitle: "Suppression impossible",
      message: `${transactions.length} opération(s) et ${schedules.length} échéance(s) seront supprimées définitivement de cet appareil.`,
      onConfirm: removeAll,
      title: "Effacer toutes les données ?",
    });
  };

  return (
    <Host style={{ flex: 1 }} seedColor={isIOS ? ink.tint : undefined}>
      <FieldGroup
        modifiers={
          isIOS ? [scrollDismissesKeyboard("interactively")] : undefined
        }
      >
        <FieldGroup.Section title="Préférences">
          <Row alignment="center">
            <Text textStyle={{ color: ink.label }}>Devise</Text>
            <Spacer flexible />
            <Picker selectedValue={currency} onValueChange={setCurrency}>
              {currencies.map((c) => (
                <Picker.Item key={c.code} label={c.label} value={c.code} />
              ))}
            </Picker>
          </Row>
        </FieldGroup.Section>

        <FieldGroup.Section title="Budget mensuel">
          <BudgetRow />
          <FieldGroup.SectionFooter>
            <Text textStyle={ink.footnote}>
              Plafond de dépenses suivi sur l’écran Aperçu. Laissez vide pour le
              désactiver.
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title="Échéances mensuelles">
          {schedules.map((schedule) => (
            <ListItem
              key={schedule.id}
              onPress={() => router.push(`/schedule/${schedule.id}`)}
              supportingText={scheduleSummary(schedule)}
              trailing={
                <Text
                  textStyle={{
                    color: schedule.type === "income" ? ink.income : ink.label,
                  }}
                >
                  {formatMoney(signedCents(schedule), currency, {
                    showPlus: true,
                  })}
                </Text>
              }
            >
              <Text textStyle={{ color: ink.label }}>
                {entryTitle(schedule)}
              </Text>
            </ListItem>
          ))}
          <ListItem onPress={() => router.push("/schedule/new")}>
            <Text textStyle={{ color: ink.tint }}>Ajouter une échéance</Text>
          </ListItem>
          <FieldGroup.SectionFooter>
            <Text textStyle={ink.footnote}>
              Salaire, loyer, factures… Treso vous les rappelle chaque mois sur
              l’Aperçu, et vous confirmez quand c’est payé ou reçu.
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title="Données">
          <Row alignment="center">
            <Text textStyle={{ color: ink.label }}>
              Opérations enregistrées
            </Text>
            <Spacer flexible />
            <Text textStyle={{ color: ink.secondaryLabel }}>
              {String(transactions.length)}
            </Text>
          </Row>
          <ListItem onPress={loadSamples}>
            <Text textStyle={{ color: ink.tint }}>
              Ajouter des données d’exemple
            </Text>
          </ListItem>
          <ListItem onPress={confirmReset}>
            <Text textStyle={{ color: ink.danger }}>
              Effacer toutes les données
            </Text>
          </ListItem>
        </FieldGroup.Section>

        <FieldGroup.Section title="À propos">
          <Row alignment="center">
            <Text textStyle={{ color: ink.label }}>Version</Text>
            <Spacer flexible />
            <Text textStyle={{ color: ink.secondaryLabel }}>
              {Constants.expoConfig?.version ?? "1.0.0"}
            </Text>
          </Row>
          <FieldGroup.SectionFooter>
            <Text textStyle={ink.footnote}>
              Treso garde vos données sur cet appareil : pas de compte, pas de
              serveur.
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
};
