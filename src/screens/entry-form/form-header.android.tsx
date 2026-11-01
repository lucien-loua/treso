import { Stack } from "expo-router";
import { Pressable } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { colors } from "@/theme";

import type { FormHeaderProps } from "./form-header";

const SaveAction = ({
  label,
  enabled,
  onPress,
}: {
  label: string;
  enabled: boolean;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ disabled: !enabled }}
    disabled={!enabled}
    hitSlop={12}
    onPress={onPress}
  >
    <ThemedText
      variant="headline"
      style={{ color: enabled ? colors.tint : colors.tertiaryLabel }}
    >
      {label}
    </ThemedText>
  </Pressable>
);

/**
 * Android top app bar: back arrow (system), title, and the save action as a text button on the
 * right. Header toolbar buttons only take image icons on Android, hence a custom header item.
 */
export const FormHeader = ({
  title,
  submitLabel,
  canSave,
  onSave,
}: FormHeaderProps) => (
  <>
    <Stack.Screen.Title>{title}</Stack.Screen.Title>
    <Stack.Toolbar placement="right" asChild>
      <SaveAction label={submitLabel} enabled={canSave} onPress={onSave} />
    </Stack.Toolbar>
  </>
);
