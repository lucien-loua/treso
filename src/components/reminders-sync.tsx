import { useEffect } from "react";

import { syncReminders, useRemindersChoice } from "@/data/reminders";
import { useTransactions } from "@/data/transactions-provider";
import { useI18n } from "@/i18n/context";
import { plannedReminders } from "@/utils/reminders";

/**
 * Keeps the phone's notifications in step with the schedules. They reload on every change and
 * each time the app comes back, which also picks up a permission granted in the system settings.
 */
export const RemindersSync = () => {
  const { t } = useI18n();
  const { schedules, status } = useTransactions();
  const [choice] = useRemindersChoice();

  useEffect(() => {
    if (status === "ready") {
      syncReminders(
        plannedReminders(schedules, t),
        t.reminders.channel,
        choice
      );
    }
  }, [choice, schedules, status, t]);

  return null;
};
