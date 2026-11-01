import { router, Stack, useNavigation } from "expo-router";
import type { NativeStackNavigationProp } from "expo-router/native-stack";
import { useEffect, useRef, useState } from "react";
import type { ComponentRef, ReactNode } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import type { TextInput } from "react-native";

import { GroupedSection, RowSeparator } from "@/components/grouped-section";
import { ThemedText } from "@/components/themed-text";
import {
  categoriesFor,
  defaultCategoryId,
  getCategory,
} from "@/data/categories";
import { useCurrency } from "@/data/settings";
import type { TransactionType } from "@/data/types";
import { colors, spacing } from "@/theme";
import { dateInMonth, monthKeyOf, parseISODate } from "@/utils/dates";
import { haptics } from "@/utils/haptics";
import { currencyDecimals, parseAmount } from "@/utils/money";

import { AmountHeader } from "./amount-header";
import { CategoryGrid } from "./category-grid";
import { DateField } from "./date-field";
import { DayField } from "./day-field";
import { initialValues, sanitizeAmount, toDraft } from "./draft";
import type { EntryDraft, FormValues } from "./draft";
import { NameRow } from "./name-row";

export { SCHEDULE_FOOTER, toScheduleInput, toTransactionInput } from "./draft";
export type { EntryDraft } from "./draft";

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <View
    style={{
      alignItems: "center",
      flexDirection: "row",
      gap: spacing.md,
      justifyContent: "space-between",
      minHeight: 50,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    }}
  >
    <ThemedText variant="body">{label}</ThemedText>
    {children}
  </View>
);

const DeleteButton = ({
  label,
  disabled,
  onPress,
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
}) => (
  <GroupedSection>
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: "center",
        backgroundColor: pressed ? colors.fill : "transparent",
        justifyContent: "center",
        minHeight: 50,
      })}
    >
      <ThemedText variant="body" style={{ color: colors.danger }}>
        {label}
      </ThemedText>
    </Pressable>
  </GroupedSection>
);

const Header = ({
  title,
  submitLabel,
  canSave,
  onSave,
}: {
  title: string;
  submitLabel: string;
  canSave: boolean;
  onSave: () => void;
}) => (
  <>
    <Stack.Screen.Title>{title}</Stack.Screen.Title>
    {process.env.EXPO_OS === "ios" ? (
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button onPress={() => router.back()}>
          Annuler
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
    ) : null}
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Button variant="done" disabled={!canSave} onPress={onSave}>
        {submitLabel}
      </Stack.Toolbar.Button>
    </Stack.Toolbar>
  </>
);

/** Focuses `input` once the sheet has settled; focusing mid-animation scrolls the content under the header. */
const useFocusAfterTransition = (
  enabled: boolean,
  input: { current: ComponentRef<typeof TextInput> | null }
) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<Record<string, undefined>>>();
  useEffect(() => {
    if (!enabled) {
      return;
    }
    return navigation.addListener("transitionEnd", (event) => {
      if (!event.data.closing) {
        input.current?.focus();
      }
    });
  }, [navigation, enabled, input]);
};

export const EntryForm = ({
  kind,
  initial,
  title,
  submitLabel,
  focusAmount = false,
  essentialsOnly = false,
  intro,
  footer,
  onSubmit,
  onDelete,
  deleteLabel = "Supprimer",
  deleteMessage = "Cette action est définitive.",
}: {
  /** A transaction has a date; a schedule has a day of the month. */
  kind: "transaction" | "schedule";
  initial?: Partial<EntryDraft>;
  title: string;
  submitLabel: string;
  focusAmount?: boolean;
  /** Only amount, name and date: for confirming a schedule, where type and category are already known. */
  essentialsOnly?: boolean;
  /** Short context line shown above the amount, e.g. which due date is being paid. */
  intro?: string;
  footer?: string;
  onSubmit: (draft: EntryDraft) => Promise<void>;
  onDelete?: () => Promise<void>;
  deleteLabel?: string;
  deleteMessage?: string;
}) => {
  const [currency] = useCurrency();
  const [values, setValues] = useState(() => initialValues(initial));
  const [busy, setBusy] = useState(false);
  const amountInput = useRef<ComponentRef<typeof TextInput>>(null);
  useFocusAfterTransition(focusAmount, amountInput);

  const update = (patch: Partial<FormValues>) =>
    setValues((previous) => ({ ...previous, ...patch }));
  const decimals = currencyDecimals(currency);
  const amountCents = parseAmount(values.amountText, decimals);
  const category = getCategory(values.categoryId, values.type);
  const isIncome = values.type === "income";

  const changeType = (next: TransactionType) => {
    const keepsCategory = categoriesFor(next).some(
      (c) => c.id === values.categoryId
    );
    update({
      categoryId: keepsCategory ? values.categoryId : defaultCategoryId[next],
      type: next,
    });
  };

  const save = async () => {
    if (amountCents === null) {
      return;
    }
    setBusy(true);
    try {
      await onSubmit(toDraft(values, amountCents));
      haptics.success();
      router.back();
    } catch (error) {
      // Keep the sheet open with the draft intact so nothing typed is lost.
      setBusy(false);
      Alert.alert("Enregistrement impossible", String(error));
    }
  };

  const remove = async (deleteEntry: () => Promise<void>) => {
    setBusy(true);
    try {
      await deleteEntry();
      router.back();
    } catch (error) {
      setBusy(false);
      Alert.alert("Suppression impossible", String(error));
    }
  };

  const confirmDelete = (deleteEntry: () => Promise<void>) => {
    haptics.warning();
    Alert.alert(`${deleteLabel} ?`, deleteMessage, [
      { style: "cancel", text: "Annuler" },
      {
        onPress: () => remove(deleteEntry),
        style: "destructive",
        text: "Supprimer",
      },
    ]);
  };

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{
          gap: spacing.lg,
          padding: spacing.md,
          paddingBottom: spacing.xxl,
        }}
      >
        <AmountHeader
          inputRef={amountInput}
          amountText={values.amountText}
          onAmountChange={(text) =>
            update({ amountText: sanitizeAmount(text, decimals) })
          }
          decimals={decimals}
          currency={currency}
          kind={values.type}
          onKindChange={changeType}
          intro={intro}
          hint={
            kind === "schedule"
              ? "Montant habituel : vous pourrez l’ajuster au moment de payer."
              : undefined
          }
          showKindPicker={!essentialsOnly}
        />

        {essentialsOnly ? null : (
          <GroupedSection title="Catégorie">
            <CategoryGrid
              type={values.type}
              selectedId={values.categoryId}
              onSelect={(categoryId) => update({ categoryId })}
            />
          </GroupedSection>
        )}

        <GroupedSection title="Détails" footer={footer}>
          <NameRow
            category={category}
            note={values.note}
            iconId={values.iconId}
            colorId={values.colorId}
            onNoteChange={(note) => update({ note })}
            onIconChange={(iconId) => update({ iconId })}
            onColorChange={(colorId) => update({ colorId })}
          />
          <RowSeparator />
          {kind === "transaction" ? (
            <Row label="Date">
              <DateField
                value={values.date}
                onChange={(date) => update({ date })}
              />
            </Row>
          ) : (
            <>
              <Row label={isIncome ? "Attendu vers le" : "À payer avant le"}>
                <DayField
                  value={values.dayOfMonth}
                  onChange={(day) =>
                    update({
                      dayOfMonth: day,
                      nextDue: parseISODate(
                        dateInMonth(monthKeyOf(values.nextDue), day)
                      ),
                    })
                  }
                />
              </Row>
              <RowSeparator />
              <Row
                label={isIncome ? "Prochain versement" : "Prochaine échéance"}
              >
                <DateField
                  value={values.nextDue}
                  onChange={(nextDue) => update({ nextDue })}
                />
              </Row>
            </>
          )}
        </GroupedSection>

        {onDelete ? (
          <DeleteButton
            label={deleteLabel}
            disabled={busy}
            onPress={() => confirmDelete(onDelete)}
          />
        ) : null}
      </ScrollView>

      <Header
        title={title}
        submitLabel={submitLabel}
        canSave={amountCents !== null && !busy}
        onSave={save}
      />
    </>
  );
};
