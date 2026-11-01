import { useLocalSearchParams } from "expo-router";

import { SheetFallback } from "@/components/sheet-fallback";
import { entryTitle } from "@/data/entries";
import { useTransactions } from "@/data/transactions-provider";
import { EntryForm, toTransactionInput } from "@/screens/entry-form";
import { formatShortDate } from "@/utils/dates";

/**
 * New transaction. Optional params prefill it:
 * - `categoryId`, `note`, `icon`, `color`: a quick-add shortcut (e.g. Taxi);
 * - `scheduleId`: paying a bill / receiving an expected income from « À venir ».
 */
const NewTransactionRoute = () => {
  const params = useLocalSearchParams<{
    categoryId?: string;
    note?: string;
    icon?: string;
    color?: string;
    scheduleId?: string;
  }>();
  const { status, schedules, add, settle } = useTransactions();

  if (params.scheduleId) {
    const schedule = schedules.find((s) => s.id === Number(params.scheduleId));
    if (!schedule) {
      return (
        <SheetFallback
          loading={status === "loading"}
          title="Paiement"
          missingLabel="Échéance introuvable"
        />
      );
    }
    const isIncome = schedule.type === "income";
    return (
      <EntryForm
        kind="transaction"
        initial={schedule}
        title={isIncome ? "Revenu reçu" : "Paiement"}
        submitLabel="Confirmer"
        essentialsOnly
        intro={`${entryTitle(schedule)} · ${isIncome ? "attendu vers le" : "échéance le"} ${formatShortDate(schedule.nextDue)}`}
        footer="Ajustez le montant ou la date s’ils diffèrent de d’habitude. L’échéance passera ensuite au mois suivant."
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
      }}
      title="Nouvelle opération"
      submitLabel="Ajouter"
      focusAmount
      onSubmit={(draft) => add(toTransactionInput(draft))}
    />
  );
};

export default NewTransactionRoute;
