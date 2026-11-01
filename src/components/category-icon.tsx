import { SymbolView } from "expo-symbols";
import { View } from "react-native";

import type { Category } from "@/data/catalog/categories";
import { getIcon } from "@/data/catalog/icons";
import { categoryColors, colors, radius } from "@/theme";
import type { CategoryColor } from "@/theme";

/**
 * Rounded-square glyph in the category color, like iOS Settings icons.
 * `iconId` and `colorId` override the category's glyph and color.
 */
export const CategoryIcon = ({
  category,
  iconId,
  colorId,
  size = 36,
}: {
  category: Category;
  iconId?: string | null;
  colorId?: string | null;
  size?: number;
}) => {
  const color =
    colorId && colorId in categoryColors
      ? (colorId as CategoryColor)
      : category.color;
  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: categoryColors[color],
        borderCurve: "continuous",
        borderRadius: size >= 44 ? radius.md : radius.sm + 2,
        height: size,
        justifyContent: "center",
        width: size,
      }}
    >
      <SymbolView
        name={getIcon(iconId)?.symbol ?? category.icon}
        tintColor={colors.onTint}
        resizeMode="scaleAspectFit"
        weight="semibold"
        style={{ height: size * 0.55, width: size * 0.55 }}
      />
    </View>
  );
};
