import { useLocalSearchParams } from "expo-router";

import { SheetFallback } from "@/components/sheet-fallback";
import { entryTitle } from "@/data/entries";
import { useTransactions } from "@/data/transactions-provider";
import type { TransactionType } from "@/data/types";
import { useI18n } from "@/i18n/context";
import { EntryForm, toTransactionInput } from "@/screens/entry-form";

/**
 * New transaction. Optional params prefill it:
 * - `categoryId`, `note`, `icon`, `color`: a quick-add shortcut (e.g. Taxi);
 * - `type`: an income to note, from the get-started steps;
 * - `scheduleId`: paying a bill / receiving an expected income from the Upcoming list.
 */
const NewTransactionRoute = () => {
  const params = useLocalSearchParams<{
    categoryId?: string;
    note?: string;
    icon?: string;
    color?: string;
    scheduleId?: string;
    type?: TransactionType;
  }>();
  const { status, schedules, add, settle } = useTransactions();
  const { t, dates } = useI18n();

  if (params.scheduleId) {
    const schedule = schedules.find((s) => s.id === Number(params.scheduleId));
    if (!schedule) {
      return (
        <SheetFallback
          loading={status === "loading"}
          title={t.sheets.payment}
          missingLabel={t.sheets.scheduleMissing}
        />
      );
    }
    const isIncome = schedule.type === "income";
    const intro = isIncome
      ? t.sheets.settleIntro.income
      : t.sheets.settleIntro.expense;
    return (
      <EntryForm
        kind="transaction"
        initial={schedule}
        title={isIncome ? t.sheets.incomeReceived : t.sheets.payment}
        submitLabel={t.actions.confirm}
        essentialsOnly
        intro={intro(
          entryTitle(schedule, t),
          dates.shortDate(schedule.nextDue)
        )}
        footer={t.sheets.settleFooter}
        onSubmit={(draft) => settle(schedule, toTransactionInput(draft))}
      />
    );
  }

  return (
    <EntryForm
      kind="transaction"
      initial={{
        categoryId: params.categoryId,
        color: params.color || null,
        icon: params.icon || null,
        note: params.note,
        type: params.type,
      }}
      title={t.sheets.newTransaction}
      submitLabel={t.actions.add}
      focusAmount
      onSubmit={(draft) => add(toTransactionInput(draft))}
    />
  );
};

export default NewTransactionRoute;
