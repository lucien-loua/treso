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

/**
 * One item of a virtualized list (SectionList) drawn as part of a grouped section:
 * rounded on the section's first and last item, hairline above the others.
 */
export const GroupedListItem = ({
  index,
  count,
  separatorInset,
  children,
}: {
  index: number;
  count: number;
  separatorInset: number;
  children: ReactNode;
}) => {
  const first = index === 0;
  const last = index === count - 1;
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderBottomLeftRadius: last ? radius.lg : 0,
        borderBottomRightRadius: last ? radius.lg : 0,
        borderCurve: "continuous",
        borderTopLeftRadius: first ? radius.lg : 0,
        borderTopRightRadius: first ? radius.lg : 0,
        overflow: "hidden",
      }}
    >
      {first ? null : <RowSeparator inset={separatorInset} />}
      {children}
    </View>
  );
};
