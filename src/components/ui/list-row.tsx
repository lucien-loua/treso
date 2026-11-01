import { SymbolView } from "expo-symbols";
import { Fragment } from "react";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import type { ColorValue, PressableProps, ViewStyle } from "react-native";

import { symbols } from "@/constants/symbols";
import { colors, glyph, spacing } from "@/theme";

import { RowSeparator } from "./grouped-section";
import { rowInset } from "./row-inset";
import { ThemedText } from "./themed-text";

const rowStyle = (pressed: boolean): ViewStyle => ({
  alignItems: "center",
  backgroundColor: pressed ? colors.fill : "transparent",
  flexDirection: "row",
  gap: spacing.smd,
  minHeight: 60,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.smd,
});

/**
 * A row of a grouped section. Lays its children out in a line: typically an icon,
 * `<ListRowText>`, then trailing content. Becomes tappable (with pressed feedback)
 * when it receives `onPress`, directly or from a `<Link asChild>` around it.
 */
export const ListRow = ({
  children,
  onPress,
  ...pressableProps
}: Omit<PressableProps, "children" | "style"> & { children: ReactNode }) => {
  if (!onPress) {
    return <View style={rowStyle(false)}>{children}</View>;
  }
  return (
    <Pressable accessibilityRole="button" onPress={onPress} {...pressableProps}>
      {/* Layout lives on the inner View: `Link asChild` drops a function `style` on the Pressable. */}
      {({ pressed }) => <View style={rowStyle(pressed)}>{children}</View>}
    </Pressable>
  );
};

/** Title over an optional subtitle; takes the row's remaining width. */
export const ListRowText = ({
  title,
  subtitle,
  titleColor,
  subtitleColor,
  subtitleLines = 2,
}: {
  title: string;
  subtitle?: string;
  titleColor?: ColorValue;
  subtitleColor?: ColorValue;
  subtitleLines?: number;
}) => (
  <View style={{ flex: 1, gap: spacing.xxs }}>
    <ThemedText
      variant="body"
      numberOfLines={1}
      style={titleColor ? { color: titleColor } : undefined}
    >
      {title}
    </ThemedText>
    {subtitle ? (
      <ThemedText
        variant="footnote"
        numberOfLines={subtitleLines}
        style={subtitleColor ? { color: subtitleColor } : undefined}
      >
        {subtitle}
      </ThemedText>
    ) : null}
  </View>
);

/** Disclosure arrow for rows that open another screen. */
export const ListRowChevron = () => (
  <SymbolView
    name={symbols.chevronRight}
    tintColor={colors.tertiaryLabel}
    weight="semibold"
    resizeMode="scaleAspectFit"
    size={glyph.sm}
  />
);

/**
 * Renders `data` as rows separated by hairlines aligned with the rows' text.
 * Same shape as FlatList, for short lists inside a grouped section.
 */
export const SeparatedList = <T,>({
  data,
  keyExtractor,
  renderItem,
  inset = rowInset(),
}: {
  data: readonly T[];
  keyExtractor: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
  inset?: number;
}) => (
  <>
    {data.map((item, index) => (
      <Fragment key={keyExtractor(item)}>
        {index > 0 ? <RowSeparator inset={inset} /> : null}
        {renderItem(item)}
      </Fragment>
    ))}
  </>
);
