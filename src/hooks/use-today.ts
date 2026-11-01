import { useEffect, useState } from "react";
import { AppState } from "react-native";

/** Today's date, refreshed when the app comes back to the foreground (e.g. the next morning). */
export const useToday = () => {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (next) => {
      if (next === "active") {
        setToday(new Date());
      }
    });
    return () => subscription.remove();
  }, []);

  return today;
};
