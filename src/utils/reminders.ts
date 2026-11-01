import { entryTitle } from "@/data/entries";
import type { Schedule } from "@/data/types";
import type { Messages } from "@/i18n/messages/fr";
import { parseISODate } from "@/lib/datetime";

const REMINDER_HOUR = 9;

export interface Reminder {
  date: Date;
  title: string;
  body: string;
}

/** 9 AM, `daysBefore` days before the local day `day`. */
const morningOf = (day: string, daysBefore = 0) => {
  const date = parseISODate(day);
  date.setDate(date.getDate() - daysBefore);
  date.setHours(REMINDER_HOUR);
  return date;
};

const reminderFor = (schedule: Schedule, t: Messages, now: Date) => {
  const title = entryTitle(schedule, t);
  const isIncome = schedule.type === "income";
  const dayBefore = morningOf(schedule.nextDue, 1);
  if (!isIncome && dayBefore > now) {
    return { body: t.reminders.dueTomorrow, date: dayBefore, title };
  }
  const onTheDay = morningOf(schedule.nextDue);
  if (onTheDay <= now) {
    return null;
  }
  const body = isIncome ? t.schedules.expectedToday : t.schedules.dueToday;
  return { body, date: onTheDay, title };
};

/**
 * What to notify for each schedule's next due date: a bill the day before (or that morning when
 * it's too late for that), an income on the day. A moment already past is dropped, "Upcoming"
 * shows it. Amounts stay out: notifications can be read on a locked phone.
 */
export const plannedReminders = (
  schedules: Schedule[],
  t: Messages,
  now = new Date()
): Reminder[] =>
  schedules.flatMap((schedule) => reminderFor(schedule, t, now) ?? []);
