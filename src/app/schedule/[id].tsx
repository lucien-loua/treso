import { useLocalSearchParams } from "expo-router";

import { SheetFallback } from "@/components/sheet-fallback";
import { useTransactions } from "@/data/transactions-provider";
import { useKeepWhileDeleting } from "@/hooks/use-keep-while-deleting";
import { useI18n } from "@/i18n/context";
import { EntryForm, toScheduleInput } from "@/screens/entry-form";

const EditScheduleRoute = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status, schedules, updateSchedule, removeSchedule } =
    useTransactions();
  const { t } = useI18n();
  const [schedule, onDelete] = useKeepWhileDeleting(
    schedules.find((s) => s.id === Number(id)),
    (deleted) => removeSchedule(deleted.id)
  );

  if (!schedule) {
    return (
      <SheetFallback
        loading={status === "loading"}
        title={t.sheets.schedule}
        missingLabel={t.sheets.scheduleMissing}
      />
    );
  }

  return (
    <EntryForm
      key={schedule.id}
      kind="schedule"
      initial={schedule}
      title={t.sheets.schedule}
      submitLabel={t.actions.save}
      footer={t.sheets.scheduleFooter}
      onSubmit={(draft) => updateSchedule(schedule, toScheduleInput(draft))}
      deleteLabel={t.sheets.deleteSchedule}
      deleteMessage={t.sheets.deleteScheduleMessage}
      onDelete={onDelete}
    />
  );
};

export default EditScheduleRoute;
