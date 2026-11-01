import { useState } from "react";

/**
 * For edit sheets: returns the item to show and a delete handler. After a delete the item
 * leaves the data, but the form keeps showing it while the sheet slides away.
 */
export const useKeepWhileDeleting = <T>(
  found: T | undefined,
  remove: (item: T) => Promise<void>
) => {
  const [deleted, setDeleted] = useState<T | null>(null);
  const item = found ?? deleted;

  const onDelete = async () => {
    if (item === null) {
      return;
    }
    setDeleted(item);
    await remove(item);
  };

  return [item, onDelete] as const;
};
