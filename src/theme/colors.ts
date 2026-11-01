import { Color } from "expo-router";
import type { ColorValue } from "react-native";
import { DynamicColorIOS, Platform } from "react-native";

/** Indigo adapted for dark mode. `DynamicColorIOS` throws on Android, so it is only built on iOS. */
const brandTintIOS = (): ColorValue =>
  process.env.EXPO_OS === "ios"
    ? DynamicColorIOS({ dark: "#7D7AFF", light: "#5856D6" })
    : "#5856D6";

const semantic = (
  ios: ColorValue,
  android: ColorValue,
  web: string
): ColorValue =>
  Platform.select<ColorValue>({ android, default: web, ios }) ?? web;

export const colors = {
  background: semantic(
    Color.ios.systemGroupedBackground,
    Color.android.dynamic.surface,
    "#f2f2f7"
  ),
  danger: semantic(Color.ios.systemRed, Color.android.dynamic.error, "#FF3B30"),
  expense: semantic(
    Color.ios.label,
    Color.android.dynamic.onSurface,
    "#000000"
  ),
  /** Floating action button (Android): Material You's primary container. */
  fab: semantic(
    brandTintIOS(),
    Color.android.dynamic.primaryContainer,
    "#5856D6"
  ),
  fill: semantic(
    Color.ios.tertiarySystemFill,
    Color.android.dynamic.surfaceContainerHighest,
    "#7676801f"
  ),
  income: semantic(Color.ios.systemGreen, "#2E9D52", "#34C759"),
  label: semantic(Color.ios.label, Color.android.dynamic.onSurface, "#000000"),
  onFab: semantic(
    "#ffffff",
    Color.android.dynamic.onPrimaryContainer,
    "#ffffff"
  ),
  onTint: "#ffffff",
  secondaryLabel: semantic(
    Color.ios.secondaryLabel,
    Color.android.dynamic.onSurfaceVariant,
    "#3c3c4399"
  ),
  separator: semantic(
    Color.ios.separator,
    Color.android.dynamic.outlineVariant,
    "#c6c6c8"
  ),
  surface: semantic(
    Color.ios.secondarySystemGroupedBackground,
    Color.android.dynamic.surfaceContainer,
    "#ffffff"
  ),
  tertiaryLabel: semantic(
    Color.ios.tertiaryLabel,
    Color.android.dynamic.outline,
    "#3c3c434d"
  ),
  // Treso brand accent: indigo, adapted for dark mode on iOS, Material You on Android.
  tint: semantic(brandTintIOS(), Color.android.dynamic.primary, "#5856D6"),
  warning: semantic(Color.ios.systemOrange, "#E8890C", "#FF9500"),
};

/** Category accents: iOS system colors (auto light/dark), fixed hex elsewhere. */
export const categoryColors = {
  blue: semantic(Color.ios.systemBlue, "#2F7DE1", "#007AFF"),
  brown: semantic(Color.ios.systemBrown, "#9C7A55", "#A2845E"),
  cyan: semantic(Color.ios.systemCyan, "#1E9FD6", "#32ADE6"),
  gray: semantic(Color.ios.systemGray, "#8E8E93", "#8E8E93"),
  green: semantic(Color.ios.systemGreen, "#2E9D52", "#34C759"),
  indigo: semantic(Color.ios.systemIndigo, "#5856D6", "#5856D6"),
  mint: semantic(Color.ios.systemMint, "#00A99D", "#00C7BE"),
  orange: semantic(Color.ios.systemOrange, "#F28C28", "#FF9500"),
  pink: semantic(Color.ios.systemPink, "#E8446A", "#FF2D55"),
  purple: semantic(Color.ios.systemPurple, "#A14FD9", "#AF52DE"),
  red: semantic(Color.ios.systemRed, "#E5483F", "#FF3B30"),
  teal: semantic(Color.ios.systemTeal, "#2AA5B8", "#30B0C7"),
  yellow: semantic(Color.ios.systemYellow, "#E6B800", "#FFCC00"),
};

export type CategoryColor = keyof typeof categoryColors;
