import type { SymbolViewProps } from "expo-symbols";
import { SymbolView } from "expo-symbols";
import { View } from "react-native";

import { colors, spacing } from "@/theme";

import { PillButton } from "./pill-button";
import { ThemedText } from "./themed-text";

/** Centered icon, title, message and an optional main action: empty, error and not-found states. */
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
      tintColor={colors.tertiaryLabel}
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
      <View style={{ marginTop: spacing.md }}>
        <PillButton label={actionLabel} onPress={onAction} />
      </View>
    ) : null}
  </View>
);
