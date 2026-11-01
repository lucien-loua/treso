import { router, Stack } from "expo-router";
import { ActivityIndicator } from "react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { symbols } from "@/constants/symbols";
import { useI18n } from "@/i18n/context";
import { spacing } from "@/theme";

/**
 * What an edit sheet shows when its item isn't there: a spinner while data loads,
 * else "not found" with a way out (deep link to a deleted item, for instance).
 */
export const SheetFallback = ({
  loading,
  title,
  missingLabel,
  message,
}: {
  loading: boolean;
  /** Sheet title, e.g. "Transaction". */
  title: string;
  /** e.g. "Transaction not found". */
  missingLabel: string;
  message?: string;
}) => {
  const { t } = useI18n();
  if (loading) {
    return <ActivityIndicator style={{ marginTop: spacing.xxl }} />;
  }
  return (
    <>
      <Stack.Screen.Title>{title}</Stack.Screen.Title>
      <EmptyState
        icon={symbols.help}
        title={missingLabel}
        message={message}
        actionLabel={t.actions.close}
        onAction={() => router.back()}
      />
    </>
  );
};
