import { Color } from 'expo-router';
import { DynamicColorIOS, Platform, type ColorValue } from 'react-native';

function semantic(ios: ColorValue, android: ColorValue, web: string): ColorValue {
  return Platform.select({ ios, android, default: web })!;
}

export const colors = {
  label: semantic(Color.ios.label, Color.android.dynamic.onSurface, '#000000'),
  secondaryLabel: semantic(
    Color.ios.secondaryLabel,
    Color.android.dynamic.onSurfaceVariant,
    '#3c3c4399',
  ),
  tertiaryLabel: semantic(Color.ios.tertiaryLabel, Color.android.dynamic.outline, '#3c3c434d'),
  separator: semantic(Color.ios.separator, Color.android.dynamic.outlineVariant, '#c6c6c8'),
  background: semantic(
    Color.ios.systemGroupedBackground,
    Color.android.dynamic.surface,
    '#f2f2f7',
  ),
  surface: semantic(
    Color.ios.secondarySystemGroupedBackground,
    Color.android.dynamic.surfaceContainer,
    '#ffffff',
  ),
  fill: semantic(
    Color.ios.tertiarySystemFill,
    Color.android.dynamic.surfaceContainerHighest,
    '#7676801f',
  ),
  // Treso brand accent: indigo, adapted for dark mode on iOS, Material You on Android.
  tint: semantic(
    DynamicColorIOS({ light: '#5856D6', dark: '#7D7AFF' }),
    Color.android.dynamic.primary,
    '#5856D6',
  ),
  onTint: '#ffffff',
  income: semantic(Color.ios.systemGreen, '#2E9D52', '#34C759'),
  expense: semantic(Color.ios.label, Color.android.dynamic.onSurface, '#000000'),
  danger: semantic(Color.ios.systemRed, Color.android.dynamic.error, '#FF3B30'),
  warning: semantic(Color.ios.systemOrange, '#E8890C', '#FF9500'),
};

/** Category accents: iOS system colors (auto light/dark), fixed hex elsewhere. */
export const categoryColors = {
  orange: semantic(Color.ios.systemOrange, '#F28C28', '#FF9500'),
  pink: semantic(Color.ios.systemPink, '#E8446A', '#FF2D55'),
  blue: semantic(Color.ios.systemBlue, '#2F7DE1', '#007AFF'),
  brown: semantic(Color.ios.systemBrown, '#9C7A55', '#A2845E'),
  yellow: semantic(Color.ios.systemYellow, '#E6B800', '#FFCC00'),
  purple: semantic(Color.ios.systemPurple, '#A14FD9', '#AF52DE'),
  teal: semantic(Color.ios.systemTeal, '#2AA5B8', '#30B0C7'),
  red: semantic(Color.ios.systemRed, '#E5483F', '#FF3B30'),
  mint: semantic(Color.ios.systemMint, '#00A99D', '#00C7BE'),
  cyan: semantic(Color.ios.systemCyan, '#1E9FD6', '#32ADE6'),
  indigo: semantic(Color.ios.systemIndigo, '#5856D6', '#5856D6'),
  green: semantic(Color.ios.systemGreen, '#2E9D52', '#34C759'),
  gray: semantic(Color.ios.systemGray, '#8E8E93', '#8E8E93'),
} as const;

export type CategoryColor = keyof typeof categoryColors;
