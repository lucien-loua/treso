import { Pressable } from "react-native";

import { colors } from "@/theme";

import { ThemedText } from "./themed-text";

/** Tinted text action, e.g. « Ajouter » or « Tout voir » next to a section title. */
export const TextButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    hitSlop={8}
    onPress={onPress}
    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
  >
    <ThemedText variant="subhead" style={{ color: colors.tint }}>
      {label}
    </ThemedText>
  </Pressable>
);
