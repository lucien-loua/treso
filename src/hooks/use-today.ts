import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { toISODate } from "@/lib/datetime";

/**
 * Today's date, refreshed when the app comes back to the foreground on another day (e.g. the next
 * morning). Same day, same object: screens that depend on it don't re-render for nothing.
 */
export const useToday = () => {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (next) => {
      if (next !== "active") {
        return;
      }
      const now = new Date();
      setToday((previous) =>
        toISODate(previous) === toISODate(now) ? previous : now
      );
    });
    return () => subscription.remove();
  }, []);

  return today;
};
