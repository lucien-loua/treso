import { Stack } from "expo-router";
import { Pressable } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { colors } from "@/theme";

import type { StepHeaderProps } from "./step-header";

const TextAction = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <Pressable accessibilityRole="button" hitSlop={12} onPress={onPress}>
    <ThemedText variant="headline" style={{ color: colors.tint }}>
      {label}
    </ThemedText>
  </Pressable>
);

/**
 * Android top app bar: « Passer » as a text action on the right. Header toolbar buttons only
 * take image icons on Android, hence a custom item; leaving goes through the system back.
 */
export const StepHeader = ({ skipLabel, onSkip }: StepHeaderProps) =>
  skipLabel && onSkip ? (
    <Stack.Toolbar placement="right" asChild>
      <TextAction label={skipLabel} onPress={onSkip} />
    </Stack.Toolbar>
  ) : null;
