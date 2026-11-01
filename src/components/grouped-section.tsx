import type { ReactNode } from "react";
import { View } from "react-native";

import { colors, radius, spacing } from "@/theme";

import { ThemedText } from "./themed-text";

/** Inset-grouped block: optional uppercase header, rounded surface, optional footer. */
export const GroupedSection = ({
  title,
  accessory,
  footer,
  children,
}: {
  title?: string;
  accessory?: ReactNode;
  footer?: string;
  children: ReactNode;
}) => (
  <View style={{ gap: spacing.sm }}>
    {title || accessory ? (
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: spacing.md,
        }}
      >
        {title ? (
          <ThemedText variant="sectionHeader" accessibilityRole="header">
            {title}
          </ThemedText>
        ) : (
          <View />
        )}
        {accessory}
      </View>
    ) : null}
    <View
      style={{
        backgroundColor: colors.surface,
        borderCurve: "continuous",
        borderRadius: radius.lg,
        overflow: "hidden",
      }}
    >
      {children}
    </View>
    {footer ? (
      <ThemedText variant="footnote" style={{ paddingHorizontal: spacing.md }}>
        {footer}
      </ThemedText>
    ) : null}
  </View>
);

/** Hairline between rows of a grouped section, inset to line up with the row text. */
export const RowSeparator = ({ inset = spacing.md }: { inset?: number }) => (
  <View
    style={{
      backgroundColor: colors.separator,
      height: 0.5,
      marginLeft: inset,
    }}
  />
);
