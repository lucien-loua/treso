import { EmptyState } from "@/components/ui/empty-state";
import { symbols } from "@/constants/symbols";

/** Shown in place of a screen's content when the local database can't be read. */
export const LoadError = ({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) => (
  <EmptyState
    icon={symbols.warning}
    title="Impossible de charger vos données"
    message={error.message}
    actionLabel="Réessayer"
    onAction={onRetry}
  />
);
