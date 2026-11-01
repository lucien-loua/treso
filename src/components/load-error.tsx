import { EmptyState } from "@/components/ui/empty-state";
import { symbols } from "@/constants/symbols";
import { useI18n } from "@/i18n/context";

/** Shown in place of a screen's content when the local database can't be read. */
export const LoadError = ({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) => {
  const { t } = useI18n();
  return (
    <EmptyState
      icon={symbols.warning}
      title={t.errors.loadFailed}
      message={error.message}
      actionLabel={t.actions.retry}
      onAction={onRetry}
    />
  );
};
