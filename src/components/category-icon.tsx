import { SymbolView } from "expo-symbols";
import { View } from "react-native";

import type { Category } from "@/data/catalog/categories";
import { getIcon } from "@/data/catalog/icons";
import { categoryColors, colors, radius } from "@/theme";
import type { CategoryColor } from "@/theme";

/** Share of the tile the glyph takes; Material Symbols carry more built-in padding than SF Symbols. */
const GLYPH_RATIO = process.env.EXPO_OS === "android" ? 0.64 : 0.55;

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
        size={Math.round(size * GLYPH_RATIO)}
      />
    </View>
  );
};
