import type { ColorValue } from "react-native";
import { Pressable } from "react-native";

import { colors, radius, spacing } from "@/theme";

import { ThemedText } from "./themed-text";

const sizes = {
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.smd,
    variant: "headline",
  },
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    variant: "footnote",
  },
} as const;

/** Filled capsule button: « Ajouter une opération », « Payer »… */
export const PillButton = ({
  label,
  onPress,
  size = "md",
  color = colors.tint,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  size?: keyof typeof sizes;
  color?: ColorValue;
  accessibilityLabel?: string;
}) => {
  const { variant, ...padding } = sizes[size];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: color,
        borderRadius: radius.full,
        opacity: pressed ? 0.7 : 1,
        ...padding,
      })}
    >
      <ThemedText
        variant={variant}
        style={{ color: colors.onTint, fontWeight: "600" }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
};
