import * as Haptics from "expo-haptics";

const isIOS = process.env.EXPO_OS === "ios";

// iOS only: Android controls already give their own touch feedback.
export const haptics = {
  selection() {
    if (isIOS) {
      Haptics.selectionAsync();
    }
  },
  success() {
    if (isIOS) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },
  warning() {
    if (isIOS) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  },
};
