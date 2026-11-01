import { SymbolView } from "expo-symbols";
import type { SymbolViewProps } from "expo-symbols";
import { Pressable, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

import { ThemedText } from "./themed-text";

export const EmptyState = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon: SymbolViewProps["name"];
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <View
    style={{
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xxl,
    }}
  >
    <SymbolView
      name={icon}
      tintColor={colors.tertiaryLabel as string}
      resizeMode="scaleAspectFit"
      style={{ height: 48, marginBottom: spacing.sm, width: 48 }}
    />
    <ThemedText variant="headline" style={{ textAlign: "center" }}>
      {title}
    </ThemedText>
    {message ? (
      <ThemedText variant="subhead" style={{ textAlign: "center" }}>
        {message}
      </ThemedText>
    ) : null}
    {actionLabel && onAction ? (
      <Pressable
        accessibilityRole="button"
        onPress={onAction}
        style={({ pressed }) => ({
          backgroundColor: colors.tint,
          borderRadius: radius.full,
          marginTop: spacing.md,
          opacity: pressed ? 0.7 : 1,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm + 4,
        })}
      >
        <ThemedText variant="headline" style={{ color: colors.onTint }}>
          {actionLabel}
        </ThemedText>
      </Pressable>
    ) : null}
  </View>
);
