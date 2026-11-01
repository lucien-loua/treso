import type { ReactNode } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PillButton } from "@/components/ui/pill-button";
import { ThemedText } from "@/components/ui/themed-text";
import { spacing } from "@/theme";

const isIOS = process.env.EXPO_OS === "ios";

/** One question: a title, a line of context, the answers, and the button to go on, always in reach. */
export const StepScreen = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
  children: ReactNode;
}) => {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior={isIOS ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          gap: spacing.lg,
          padding: spacing.md,
          paddingBottom: spacing.xl,
        }}
      >
        <View style={{ gap: spacing.xs, paddingHorizontal: spacing.xs }}>
          <ThemedText variant="title" accessibilityRole="header">
            {title}
          </ThemedText>
          <ThemedText variant="subhead">{subtitle}</ThemedText>
        </View>
        {children}
      </ScrollView>
      <View
        style={{
          paddingBottom: Math.max(insets.bottom, spacing.md),
          paddingHorizontal: spacing.md,
          paddingTop: spacing.sm,
        }}
      >
        <PillButton label={actionLabel} onPress={onAction} fill />
      </View>
    </KeyboardAvoidingView>
  );
};
