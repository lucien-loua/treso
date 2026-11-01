import { useLocalSearchParams } from "expo-router";

import { SheetFallback } from "@/components/sheet-fallback";
import { useTransactions } from "@/data/transactions-provider";
import { useKeepWhileDeleting } from "@/hooks/use-keep-while-deleting";
import {
  EntryForm,
  SCHEDULE_FOOTER,
  toScheduleInput,
} from "@/screens/entry-form";

const EditScheduleRoute = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status, schedules, updateSchedule, removeSchedule } =
    useTransactions();
  const [schedule, onDelete] = useKeepWhileDeleting(
    schedules.find((s) => s.id === Number(id)),
    (deleted) => removeSchedule(deleted.id)
  );

  if (!schedule) {
    return (
      <SheetFallback
        loading={status === "loading"}
        title="Échéance"
        missingLabel="Échéance introuvable"
      />
    );
  }

  return (
    <EntryForm
      key={schedule.id}
      kind="schedule"
      initial={schedule}
      title="Échéance"
      submitLabel="Enregistrer"
      footer={SCHEDULE_FOOTER}
      onSubmit={(draft) => updateSchedule(schedule, toScheduleInput(draft))}
      deleteLabel="Supprimer l’échéance"
      deleteMessage="Elle ne sera plus rappelée. Les paiements déjà enregistrés sont conservés."
      onDelete={onDelete}
    />
  );
};

export default EditScheduleRoute;
