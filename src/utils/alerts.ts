import { Alert } from "react-native";

/** Runs `action`; if it fails, shows a native alert titled `title` with the error. */
export const runOrAlert = async (
  action: () => Promise<void>,
  title: string
) => {
  try {
    await action();
  } catch (error) {
    Alert.alert(title, String(error));
  }
};

/** Native "Annuler / <confirmLabel>" alert. `onConfirm` failures are reported with `failureTitle`. */
export const confirm = ({
  title,
  message,
  confirmLabel,
  destructive = false,
  onConfirm,
  failureTitle = "Action impossible",
}: {
  title: string;
  message?: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => Promise<void> | void;
  failureTitle?: string;
}) =>
  Alert.alert(title, message, [
    { style: "cancel", text: "Annuler" },
    {
      onPress: () => runOrAlert(async () => await onConfirm(), failureTitle),
      style: destructive ? "destructive" : "default",
      text: confirmLabel,
    },
  ]);
