import { useColorScheme } from "react-native";

import { type } from "@/theme";

/**
 * Plain hex colors for `@expo/ui` trees: their `textStyle.color` takes CSS strings,
 * not the native semantic colors from `@/theme`. Values mirror the iOS system palette.
 */
export const useInk = () => {
  const dark = useColorScheme() === "dark";
  const secondaryLabel = "#8E8E93";
  return {
    danger: dark ? "#FF453A" : "#FF3B30",
    /** Text style for section footers, matching the footnote ramp step. */
    footnote: { color: secondaryLabel, fontSize: type.footnote.fontSize },
    income: dark ? "#30D158" : "#34C759",
    label: dark ? "#FFFFFF" : "#000000",
    secondaryLabel,
    tint: dark ? "#7D7AFF" : "#5856D6",
  };
};
