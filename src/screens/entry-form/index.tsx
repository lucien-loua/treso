import { router, useNavigation } from "expo-router";
import type { NativeStackNavigationProp } from "expo-router/native-stack";
import { useEffect, useRef, useState } from "react";
import type { ComponentRef, ReactNode } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import type { TextInput } from "react-native";

import { GroupedSection, RowSeparator } from "@/components/ui/grouped-section";
import { ThemedText } from "@/components/ui/themed-text";
import {
  categoriesFor,
  defaultCategoryId,
  getCategory,
} from "@/data/catalog/categories";
import { suggestCategory } from "@/data/catalog/category-suggestions";
import type { TransactionType } from "@/data/types";
import { useMoney } from "@/hooks/use-money";
import { useI18n } from "@/i18n/context";
import { dateInMonth, monthKeyOf, parseISODate } from "@/lib/datetime";
import { colors, spacing } from "@/theme";
import { sanitizeAmount } from "@/utils/amount-input";
import { haptics } from "@/utils/haptics";

import { AmountHeader } from "./amount-header";
import { CategoryGrid } from "./category-grid";
import { CategoryRow } from "./category-row";
import { DateField } from "./date-field";
import { DayField } from "./day-field";
import { initialValues, toDraft } from "./draft";
import type { EntryDraft, FormValues } from "./draft";
import { FormHeader } from "./form-header";
import { NameRow } from "./name-row";

export { toScheduleInput, toTransactionInput } from "./draft";
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
  deleteLabel,
  deleteMessage,
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
  const { t, currencies } = useI18n();
  const money = useMoney();
  // Amounts are typed in the entry's own currency, so editing never rounds them through a rate
  const entryMoney = currencies.find(initial?.currency) ?? money;
  const [values, setValues] = useState(() =>
    initialValues(initial ?? {}, entryMoney)
  );
  const [busy, setBusy] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const amountInput = useRef<ComponentRef<typeof TextInput>>(null);
  useFocusAfterTransition(focusAmount, amountInput);

  const update = (patch: Partial<FormValues>) =>
    setValues((previous) => ({ ...previous, ...patch }));
  const amountCents = entryMoney.parse(values.amountText);
  const converted =
    amountCents === null || entryMoney.code === money.code
      ? null
      : money.format(
          money.amountOf({ amountCents, currency: entryMoney.code })
        );
  const hint = [
    converted ? t.form.converted(converted) : null,
    kind === "schedule" ? t.form.usualAmount : null,
  ]
    .filter(Boolean)
    .join("\n");
  // Until the user picks one, the name suggests the category (« Taxi » → transport)
  const categoryId =
    (values.categoryChosen
      ? null
      : suggestCategory(values.note, values.type, t.iconKeywords)) ??
    values.categoryId;
  const category = getCategory(categoryId, values.type);
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
      await onSubmit(
        toDraft(
          { ...values, categoryId: category.id },
          { amountCents, currency: entryMoney.code },
          t.iconKeywords
        )
      );
      haptics.success();
      router.back();
    } catch (error) {
      // Keep the sheet open with the draft intact so nothing typed is lost.
      setBusy(false);
      Alert.alert(t.errors.saveFailed, String(error));
    }
  };

  const remove = async (deleteEntry: () => Promise<void>) => {
    setBusy(true);
    try {
      await deleteEntry();
      router.back();
    } catch (error) {
      setBusy(false);
      Alert.alert(t.errors.deleteFailed, String(error));
    }
  };

  const confirmDelete = (deleteEntry: () => Promise<void>) => {
    haptics.warning();
    Alert.alert(
      t.form.deleteConfirm(deleteLabel ?? t.actions.delete),
      deleteMessage ?? t.form.irreversible,
      [
        { style: "cancel", text: t.actions.cancel },
        {
          onPress: () => remove(deleteEntry),
          style: "destructive",
          text: t.actions.delete,
        },
      ]
    );
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
            update({ amountText: sanitizeAmount(text, entryMoney) })
          }
          money={entryMoney}
          kind={values.type}
          onKindChange={changeType}
          intro={intro}
          hint={hint || undefined}
          showKindPicker={!essentialsOnly}
        />

        <GroupedSection footer={footer}>
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
          {essentialsOnly ? null : (
            <>
              <CategoryRow
                category={category}
                open={categoryOpen}
                onToggle={() => setCategoryOpen((open) => !open)}
              />
              {categoryOpen ? (
                <CategoryGrid
                  type={values.type}
                  selectedId={category.id}
                  onSelect={(picked) => {
                    update({ categoryChosen: true, categoryId: picked });
                    setCategoryOpen(false);
                  }}
                />
              ) : null}
              <RowSeparator />
            </>
          )}
          {kind === "transaction" ? (
            <Row label={t.form.date}>
              <DateField
                value={values.date}
                onChange={(date) => update({ date })}
              />
            </Row>
          ) : (
            <>
              <Row label={isIncome ? t.form.expectedAround : t.form.payBefore}>
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
              <Row label={isIncome ? t.form.nextIncome : t.form.nextDue}>
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
            label={deleteLabel ?? t.actions.delete}
            disabled={busy}
            onPress={() => confirmDelete(onDelete)}
          />
        ) : null}
      </ScrollView>

      <FormHeader
        title={title}
        submitLabel={submitLabel}
        canSave={amountCents !== null && !busy}
        onSave={save}
      />
    </>
  );
};
