import type { TextStyle } from "react-native";

import { colors } from "./colors";

export { categoryColors, colors, type CategoryColor } from "./colors";

export const spacing = {
  lg: 24,
  md: 16,
  sm: 8,
  xl: 32,
  xs: 4,
  xxl: 48,
} as const;

export const radius = {
  full: 9999,
  lg: 16,
  md: 12,
  sm: 8,
  xl: 24,
} as const;

export const type = {
  body: { color: colors.label, fontSize: 17, fontWeight: "400" },
  callout: { color: colors.label, fontSize: 16, fontWeight: "400" },
  caption: { color: colors.secondaryLabel, fontSize: 12, fontWeight: "500" },
  footnote: { color: colors.secondaryLabel, fontSize: 13, fontWeight: "400" },
  headline: { color: colors.label, fontSize: 17, fontWeight: "600" },
  hero: {
    color: colors.label,
    fontSize: 44,
    fontVariant: ["tabular-nums"],
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  sectionHeader: {
    color: colors.secondaryLabel,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  subhead: { color: colors.secondaryLabel, fontSize: 15, fontWeight: "400" },
  title: { color: colors.label, fontSize: 22, fontWeight: "700" },
} as const satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;
