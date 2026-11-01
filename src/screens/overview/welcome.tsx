import { View } from "react-native";

import { TextButton } from "@/components/ui/text-button";
import { ThemedText } from "@/components/ui/themed-text";
import { useLoadSampleData } from "@/hooks/use-load-sample-data";
import { useI18n } from "@/i18n/context";
import { spacing } from "@/theme";

import { GetStarted } from "./get-started";

/** First launch: what Treso does in one line, the guided setup, and a way to try it with sample data. */
export const Welcome = () => {
  const { t } = useI18n();
  const loadSamples = useLoadSampleData();
  return (
    <>
      <View style={{ gap: spacing.xs, paddingHorizontal: spacing.xs }}>
        <ThemedText variant="title">{t.overview.welcome.title}</ThemedText>
        <ThemedText variant="subhead">{t.overview.welcome.subtitle}</ThemedText>
      </View>
      <GetStarted schedules={[]} transactions={[]} />
      <View style={{ alignSelf: "center" }}>
        <TextButton
          label={t.overview.welcome.trySamples}
          onPress={loadSamples}
        />
      </View>
    </>
  );
};
