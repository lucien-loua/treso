import { openSettings } from "expo-linking";
import { useEffect, useState } from "react";
import { AppState } from "react-native";

import {
  askRemindersPermission,
  readRemindersPermission,
  useRemindersChoice,
} from "@/data/reminders";
import { useI18n } from "@/i18n/context";
import { haptics } from "@/utils/haptics";

import { SwitchRow } from "./switch-row";

export const RemindersRow = () => {
  const { t } = useI18n();
  const [choice, setChoice] = useRemindersChoice();
  const [denied, setDenied] = useState(false);

  // Read again on return: the user may have just changed it in the system settings.
  useEffect(() => {
    const read = async () => {
      const { status } = await readRemindersPermission();
      setDenied(status === "denied");
    };
    read();
    const subscription = AppState.addEventListener("change", (next) => {
      if (next === "active") {
        read();
      }
    });
    return () => subscription.remove();
  }, []);

  const turnOn = async () => {
    const { canAskAgain, granted } = await readRemindersPermission();
    if (!granted && !canAskAgain) {
      // The system won't ask anymore: only its settings can allow notifications now.
      setChoice("on");
      await openSettings();
      return;
    }
    const answer = await askRemindersPermission(t.reminders.channel);
    setDenied(answer.status === "denied");
    setChoice(answer.granted ? "on" : "off");
  };

  return (
    <SwitchRow
      label={t.settings.reminders.toggle}
      value={choice !== "off" && !denied}
      onValueChange={(on) => {
        haptics.selection();
        if (on) {
          turnOn();
        } else {
          setChoice("off");
        }
      }}
    />
  );
};
