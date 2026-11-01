import { View } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { useI18n } from "@/i18n/context";
import { spacing } from "@/theme";

import { GetStarted } from "./get-started";

/** First launch: what Treso does in one line, then the guided setup. */
export const Welcome = () => {
  const { t } = useI18n();
  return (
    <>
      <View style={{ gap: spacing.xs, paddingHorizontal: spacing.xs }}>
        <ThemedText variant="title">{t.overview.welcome.title}</ThemedText>
        <ThemedText variant="subhead">{t.overview.welcome.subtitle}</ThemedText>
      </View>
      <GetStarted schedules={[]} transactions={[]} />
    </>
  );
};
