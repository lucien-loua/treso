import { Pressable, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { ThemedText } from "@/components/themed-text";
import { categoriesFor } from "@/data/categories";
import type { TransactionType } from "@/data/types";
import { colors, radius, spacing } from "@/theme";
import { haptics } from "@/utils/haptics";

export function CategoryGrid({
	type,
	selectedId,
	onSelect,
}: {
	type: TransactionType;
	selectedId: string;
	onSelect: (id: string) => void;
}) {
	return (
		<View
			accessibilityRole="radiogroup"
			style={{ flexDirection: "row", flexWrap: "wrap", padding: spacing.sm }}
		>
			{categoriesFor(type).map((category) => {
				const selected = category.id === selectedId;
				return (
					<Pressable
						key={category.id}
						accessibilityRole="radio"
						accessibilityLabel={category.label}
						accessibilityState={{ selected }}
						onPress={() => {
							haptics.selection();
							onSelect(category.id);
						}}
						style={({ pressed }) => ({
							width: "25%",
							alignItems: "center",
							gap: 6,
							paddingVertical: spacing.sm,
							borderRadius: radius.md,
							borderCurve: "continuous",
							backgroundColor: selected ? colors.fill : "transparent",
							opacity: pressed ? 0.6 : 1,
						})}
					>
						<View
							style={{
								padding: 2,
								borderRadius: radius.md + 2,
								borderCurve: "continuous",
								borderWidth: 2,
								borderColor: selected ? colors.tint : "transparent",
							}}
						>
							<CategoryIcon category={category} size={40} />
						</View>
						<ThemedText
							variant="caption"
							numberOfLines={1}
							style={selected ? { color: colors.label, fontWeight: "600" } : undefined}
						>
							{category.label}
						</ThemedText>
					</Pressable>
				);
			})}
		</View>
	);
}
