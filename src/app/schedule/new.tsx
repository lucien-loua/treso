import { useLocalSearchParams } from "expo-router";

import { useTransactions } from "@/data/transactions-provider";
import type { TransactionType } from "@/data/types";
import { useI18n } from "@/i18n/context";
import { EntryForm, toScheduleInput } from "@/screens/entry-form";

/** New monthly schedule. Params (`type`, `categoryId`, `note`, `day`) prefill presets such as salary or rent. */
const NewScheduleRoute = () => {
  const params = useLocalSearchParams<{
    type?: TransactionType;
    categoryId?: string;
    note?: string;
    day?: string;
  }>();
  const { addSchedule } = useTransactions();
  const { t } = useI18n();

  return (
    <EntryForm
      kind="schedule"
      initial={{
        categoryId: params.categoryId,
        dayOfMonth: params.day ? Number(params.day) : undefined,
        note: params.note,
        type: params.type,
      }}
      title={t.sheets.newSchedule}
      submitLabel={t.actions.add}
      focusAmount
      footer={t.sheets.scheduleFooter}
      onSubmit={(draft) => addSchedule(toScheduleInput(draft))}
    />
  );
};

export default NewScheduleRoute;
