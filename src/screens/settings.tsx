import {
  Button,
  FieldGroup,
  Host,
  ListItem,
  Picker,
  Row,
  Spacer,
  Text,
  TextInput,
} from "@expo/ui";
import type { TextInputRef } from "@expo/ui";
import { scrollDismissesKeyboard } from "@expo/ui/swift-ui/modifiers";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert } from "react-native";

import { getCategory } from "@/data/categories";
import { buildSampleTransactions } from "@/data/sample-data";
import { currencies, useCurrency, useMonthlyBudget } from "@/data/settings";
import { useTransactions } from "@/data/transactions-provider";
import { useInk } from "@/hooks/use-ink";
import { haptics } from "@/utils/haptics";
import {
  centsToInput,
  currencyDecimals,
  currencySymbol,
  formatMoney,
  parseAmount,
} from "@/utils/money";
import { runOrAlert } from "@/utils/run-or-alert";

export const Settings = () => {
  const ink = useInk();
  const [currency, setCurrency] = useCurrency();
  const [budget, setBudget] = useMonthlyBudget();
  const { transactions, schedules, addMany, removeAll } = useTransactions();
  const budgetDraft = useRef(budget ? centsToInput(budget) : "");
  const budgetInput = useRef<TextInputRef>(null);
  // The number pad has no return key on iOS, so an explicit "OK" shows while typing.
  const [editingBudget, setEditingBudget] = useState(false);

  const saveBudget = () => {
    const text = budgetDraft.current.trim();
    if (text === "") {
      setBudget(null);
      return;
    }
    const cents = parseAmount(text, currencyDecimals(currency));
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

  const loadSamples = () => {
    Alert.alert(
      "Ajouter des exemples ?",
      "Trois mois d’opérations fictives seront ajoutés à vos données. Vous pourrez les effacer ensuite.",
      [
        { style: "cancel", text: "Annuler" },
        {
          onPress: () =>
            runOrAlert(async () => {
              await addMany(buildSampleTransactions(currency));
              haptics.success();
            }, "Import impossible"),
          text: "Ajouter",
        },
      ]
    );
  };

  const confirmReset = () => {
    haptics.warning();
    Alert.alert(
      "Effacer toutes les données ?",
      `${transactions.length} opération(s) et ${schedules.length} échéance(s) seront supprimées définitivement de cet appareil.`,
      [
        { style: "cancel", text: "Annuler" },
        {
          onPress: () => runOrAlert(removeAll, "Suppression impossible"),
          style: "destructive",
          text: "Tout effacer",
        },
      ]
    );
  };

  return (
    <Host
      style={{ flex: 1 }}
      seedColor={process.env.EXPO_OS === "ios" ? ink.tint : undefined}
    >
      <FieldGroup
        modifiers={
          process.env.EXPO_OS === "ios"
            ? [scrollDismissesKeyboard("interactively")]
            : undefined
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
          <Row alignment="center" spacing={12}>
            <Text textStyle={{ color: ink.label }}>Montant</Text>
            <TextInput
              ref={budgetInput}
              defaultValue={budget ? centsToInput(budget) : ""}
              placeholder="Aucun"
              accessibilityLabel={`Budget mensuel en ${currencySymbol(currency)}`}
              keyboardType={
                currencyDecimals(currency) > 0 ? "decimal-pad" : "number-pad"
              }
              returnKeyType="done"
              textAlign="right"
              maxLength={12}
              onChangeText={(text) => {
                budgetDraft.current = text;
              }}
              onFocus={() => setEditingBudget(true)}
              onSubmitEditing={() => budgetInput.current?.blur()}
              onBlur={() => {
                setEditingBudget(false);
                saveBudget();
              }}
            />
            <Text textStyle={{ color: ink.secondaryLabel }}>
              {currencySymbol(currency)}
            </Text>
            {editingBudget ? (
              <Button
                variant="text"
                label="OK"
                onPress={() => budgetInput.current?.blur()}
              />
            ) : null}
          </Row>
          <FieldGroup.SectionFooter>
            <Text textStyle={{ color: ink.secondaryLabel, fontSize: 13 }}>
              Plafond de dépenses suivi sur l’écran Aperçu. Laissez vide pour le
              désactiver.
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title="Échéances mensuelles">
          {schedules.map((schedule) => {
            const title =
              schedule.note ||
              getCategory(schedule.categoryId, schedule.type).label;
            const isIncome = schedule.type === "income";
            return (
              <ListItem
                key={schedule.id}
                onPress={() => router.push(`/schedule/${schedule.id}`)}
                supportingText={`${isIncome ? "Vers" : "Avant"} le ${schedule.dayOfMonth === 1 ? "1er" : schedule.dayOfMonth} de chaque mois`}
                trailing={
                  <Text
                    textStyle={{ color: isIncome ? ink.income : ink.label }}
                  >
                    {formatMoney(
                      isIncome ? schedule.amountCents : -schedule.amountCents,
                      currency,
                      {
                        showPlus: true,
                      }
                    )}
                  </Text>
                }
              >
                <Text textStyle={{ color: ink.label }}>{title}</Text>
              </ListItem>
            );
          })}
          <ListItem onPress={() => router.push("/schedule/new")}>
            <Text textStyle={{ color: ink.tint }}>Ajouter une échéance</Text>
          </ListItem>
          <FieldGroup.SectionFooter>
            <Text textStyle={{ color: ink.secondaryLabel, fontSize: 13 }}>
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
            <Text textStyle={{ color: ink.secondaryLabel, fontSize: 13 }}>
              Treso garde vos données sur cet appareil : pas de compte, pas de
              serveur.
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
};
