import { router, Stack } from "expo-router";
import { ActivityIndicator } from "react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { symbols } from "@/constants/symbols";
import { spacing } from "@/theme";

/**
 * What an edit sheet shows when its item isn't there: a spinner while data loads,
 * else « introuvable » with a way out (deep link to a deleted item, for instance).
 */
export const SheetFallback = ({
  loading,
  title,
  missingLabel,
  message,
}: {
  loading: boolean;
  /** Sheet title, e.g. « Opération ». */
  title: string;
  /** e.g. « Opération introuvable ». */
  missingLabel: string;
  message?: string;
}) =>
  loading ? (
    <ActivityIndicator style={{ marginTop: spacing.xxl }} />
  ) : (
    <>
      <Stack.Screen.Title>{title}</Stack.Screen.Title>
      <EmptyState
        icon={symbols.help}
        title={missingLabel}
        message={message}
        actionLabel="Fermer"
        onAction={() => router.back()}
      />
    </>
  );
