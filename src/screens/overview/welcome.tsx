import { View } from "react-native";

import { TextButton } from "@/components/ui/text-button";
import { ThemedText } from "@/components/ui/themed-text";
import { useLoadSampleData } from "@/hooks/use-load-sample-data";
import { spacing } from "@/theme";

import { GetStarted } from "./get-started";

/** First launch: what Treso does in one line, the guided setup, and a way to try it with sample data. */
export const Welcome = () => {
  const loadSamples = useLoadSampleData();
  return (
    <>
      <View style={{ gap: spacing.xs, paddingHorizontal: spacing.xs }}>
        <ThemedText variant="title">Bienvenue sur Treso</ThemedText>
        <ThemedText variant="subhead">
          Suivez votre argent mois par mois : ce qui rentre, ce qui sort, et ce
          qu’il vous reste.
        </ThemedText>
      </View>
      <GetStarted schedules={[]} transactions={[]} />
      <View style={{ alignSelf: "center" }}>
        <TextButton label="Essayer avec des exemples" onPress={loadSamples} />
      </View>
    </>
  );
};
