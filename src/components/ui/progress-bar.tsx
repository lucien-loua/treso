import { View } from "react-native";
import type { ColorValue } from "react-native";

import { colors, radius } from "@/theme";

/** Thin capsule track. `value` is clamped to 0–1. */
export const ProgressBar = ({
  value,
  color,
  height = 6,
}: {
  value: number;
  color: ColorValue;
  height?: number;
}) => {
  const clamped = Math.min(Math.max(value, 0), 1);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ max: 100, min: 0, now: Math.round(clamped * 100) }}
      style={{
        backgroundColor: colors.fill,
        borderRadius: radius.full,
        height,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          backgroundColor: color,
          borderRadius: radius.full,
          height: "100%",
          width: `${clamped * 100}%`,
        }}
      />
    </View>
  );
};
