import { SymbolView } from "expo-symbols";
import { View } from "react-native";

import type { Category } from "@/data/categories";
import { getIcon } from "@/data/icons";
import { categoryColors, radius, type CategoryColor } from "@/theme";

/**
 * Rounded-square glyph in the category color, like iOS Settings icons.
 * `iconId` and `colorId` override the category's glyph and color.
 */
export function CategoryIcon({
	category,
	iconId,
	colorId,
	size = 36,
}: {
	category: Category;
	iconId?: string | null;
	colorId?: string | null;
	size?: number;
}) {
	const color = colorId && colorId in categoryColors ? (colorId as CategoryColor) : category.color;
	return (
		<View
			style={{
				width: size,
				height: size,
				borderRadius: size >= 44 ? radius.md : radius.sm + 2,
				borderCurve: "continuous",
				backgroundColor: categoryColors[color],
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<SymbolView
				name={getIcon(iconId)?.symbol ?? category.icon}
				tintColor="#ffffff"
				resizeMode="scaleAspectFit"
				weight="semibold"
				style={{ width: size * 0.55, height: size * 0.55 }}
			/>
		</View>
	);
}
