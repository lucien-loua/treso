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
