import {
  AndroidImportance,
  cancelAllScheduledNotificationsAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  SchedulableTriggerInputTypes,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from "expo-notifications";

import type { Reminder } from "@/utils/reminders";

import { useStored, writeStored } from "./storage";

const CHOICE_KEY = "treso.reminders";
const CHANNEL_ID = "reminders";

export type RemindersChoice = "on" | "off";

const toChoice = (stored: string | null): RemindersChoice | null =>
  stored === "on" || stored === "off" ? stored : null;

/** Whether the user wants reminders, `null` until they've had to say. Device-only: not in backups. */
export const useRemindersChoice = (): [
  RemindersChoice | null,
  (choice: RemindersChoice) => void,
] => [
  toChoice(useStored(CHOICE_KEY)),
  (choice) => writeStored(CHOICE_KEY, choice),
];

// Also shows a reminder that comes while the app is open: it would be lost otherwise.
setNotificationHandler({
  handleNotification: () =>
    Promise.resolve({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
});

export const readRemindersPermission = () => getPermissionsAsync();

const prepareChannel = (name: string) =>
  setNotificationChannelAsync(CHANNEL_ID, {
    importance: AndroidImportance.DEFAULT,
    name,
  });

/** The system's prompt. Android only shows it once a channel exists; iOS has no channels. */
export const askRemindersPermission = async (channelName: string) => {
  await prepareChannel(channelName);
  return requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: false, allowSound: true },
  });
};

const replaceReminders = async (
  reminders: Reminder[],
  channelName: string,
  choice: RemindersChoice | null
) => {
  await cancelAllScheduledNotificationsAsync();
  if (reminders.length === 0 || choice === "off") {
    return;
  }
  if (choice === null) {
    // Asked once, the first time there is something to remind. Saving the answer syncs again.
    const { granted } = await askRemindersPermission(channelName);
    writeStored(CHOICE_KEY, granted ? "on" : "off");
    return;
  }

  const { granted } = await readRemindersPermission();
  if (!granted) {
    return;
  }
  await prepareChannel(channelName);
  await Promise.all(
    reminders.map(({ body, date, title }) =>
      scheduleNotificationAsync({
        content: { body, title },
        trigger: {
          channelId: CHANNEL_ID,
          date,
          type: SchedulableTriggerInputTypes.DATE,
        },
      })
    )
  );
};

let lastSync = Promise.resolve();

/**
 * Makes the phone's scheduled notifications match `reminders`. One sync at a time, in order, so
 * two quick changes can't leave a reminder from the older one behind.
 */
export const syncReminders = (
  reminders: Reminder[],
  channelName: string,
  choice: RemindersChoice | null
) => {
  lastSync = lastSync
    .then(() => replaceReminders(reminders, channelName, choice))
    .catch(() => {
      // A reminder that can't be scheduled mustn't disturb the app: the next sync tries again.
    });
};
