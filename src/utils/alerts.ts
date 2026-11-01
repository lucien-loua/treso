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

/** Native "<cancelLabel> / <confirmLabel>" alert. `onConfirm` failures are reported with `failureTitle`. */
export const confirm = ({
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive = false,
  onConfirm,
  failureTitle,
}: {
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  onConfirm: () => Promise<void> | void;
  failureTitle: string;
}) =>
  Alert.alert(title, message, [
    { style: "cancel", text: cancelLabel },
    {
      onPress: () => runOrAlert(async () => await onConfirm(), failureTitle),
      style: destructive ? "destructive" : "default",
      text: confirmLabel,
    },
  ]);
