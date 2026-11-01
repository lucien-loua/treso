import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { ThemedText } from "@/components/themed-text";
import type { Category } from "@/data/categories";
import { getIcon, icons } from "@/data/icons";
import { categoryColors, colors, radius, spacing, type CategoryColor } from "@/theme";
import { haptics } from "@/utils/haptics";

// Clearly distinct colors; near-duplicates (cyan, mint, teal…) only appear as a category's own color.
const PALETTE: CategoryColor[] = ["red", "orange", "yellow", "green", "teal", "blue", "indigo", "purple", "pink"];
const PALETTE_SIZE = 8;

/** One row: the category's color first (the automatic choice), then distinct colors. Keeps a saved choice visible. */
function paletteFor(category: Category, colorId: string | null): CategoryColor[] {
	const keys = [category.color, ...PALETTE.filter((key) => key !== category.color)].slice(0, PALETTE_SIZE);
	const saved = colorId as CategoryColor | null;
	if (saved && saved in categoryColors && !keys.includes(saved)) keys[keys.length - 1] = saved;
	return keys;
}

const colorNames: Record<CategoryColor, string> = {
	orange: "Orange",
	pink: "Rose",
	blue: "Bleu",
	brown: "Marron",
	yellow: "Jaune",
	purple: "Violet",
	teal: "Bleu canard",
	red: "Rouge",
	mint: "Menthe",
	cyan: "Cyan",
	indigo: "Indigo",
	green: "Vert",
	gray: "Gris",
};

function IconCell({
	label,
	selected,
	onPress,
	children,
}: {
	label: string;
	selected: boolean;
	onPress: () => void;
	children: ReactNode;
}) {
	return (
		<Pressable
			accessibilityRole="radio"
			accessibilityLabel={label}
			accessibilityState={{ selected }}
			onPress={() => {
				haptics.selection();
				onPress();
			}}
			style={({ pressed }) => ({
				width: "16.66%",
				alignItems: "center",
				paddingVertical: spacing.xs,
				opacity: pressed ? 0.6 : 1,
			})}
		>
			<View
				style={{
					padding: 2,
					borderRadius: radius.md,
					borderCurve: "continuous",
					borderWidth: 2,
					borderColor: selected ? colors.tint : "transparent",
				}}
			>
				{children}
			</View>
		</Pressable>
	);
}

/**
 * Opened from the icon next to the name: a row of colors, then the icons.
 * Defaults stay automatic (category color, icon from the name); a tap here overrides them.
 */
export function AppearancePicker({
	category,
	autoIconId,
	iconId,
	colorId,
	onIconChange,
	onColorChange,
}: {
	category: Category;
	/** Icon suggested from the name, shown in the "automatic" cell. */
	autoIconId: string | null;
	iconId: string | null;
	colorId: string | null;
	onIconChange: (id: string | null) => void;
	onColorChange: (id: string | null) => void;
}) {
	const activeColor = (colorId as CategoryColor | null) ?? category.color;
	// The "automatic" cell already shows this glyph: don't list it twice (unless it's the saved choice).
	const autoGlyph = (getIcon(autoIconId)?.symbol ?? category.icon) as { ios?: string };
	const library = icons.filter(
		(option) => option.id === iconId || (option.symbol as { ios?: string }).ios !== autoGlyph.ios,
	);

	return (
		<View style={{ gap: spacing.sm, paddingHorizontal: spacing.sm, paddingBottom: spacing.md }}>
			<View
				accessibilityRole="radiogroup"
				accessibilityLabel="Couleur"
				style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.xs }}
			>
				{paletteFor(category, colorId).map((key) => {
					const selected = key === activeColor;
					return (
						<Pressable
							key={key}
							accessibilityRole="radio"
							accessibilityLabel={key === category.color ? `${colorNames[key]} (couleur de la catégorie)` : colorNames[key]}
							accessibilityState={{ selected }}
							hitSlop={6}
							onPress={() => {
								haptics.selection();
								// Picking the category's own color goes back to automatic.
								onColorChange(key === category.color ? null : key);
							}}
							style={{
								width: 36,
								height: 36,
								borderRadius: 18,
								borderWidth: 2,
								borderColor: selected ? colors.tint : "transparent",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<View
								style={{
									width: 28,
									height: 28,
									borderRadius: 14,
									backgroundColor: categoryColors[key],
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								{selected ? (
									<SymbolView
										name={{ ios: "checkmark", android: "check", web: "check" }}
										tintColor="#ffffff"
										weight="bold"
										resizeMode="scaleAspectFit"
										style={{ width: 12, height: 12 }}
									/>
								) : null}
							</View>
						</Pressable>
					);
				})}
			</View>

			<View style={{ height: 0.5, marginHorizontal: spacing.sm, backgroundColor: colors.separator }} />

			<View accessibilityRole="radiogroup" accessibilityLabel="Icône" style={{ flexDirection: "row", flexWrap: "wrap" }}>
				<IconCell label="Automatique, selon le nom" selected={iconId === null} onPress={() => onIconChange(null)}>
					<CategoryIcon category={category} iconId={autoIconId} colorId={colorId} size={36} />
				</IconCell>
				{library.map((option) => (
					<IconCell
						key={option.id}
						label={option.label}
						selected={iconId === option.id}
						onPress={() => onIconChange(option.id)}
					>
						<CategoryIcon category={category} iconId={option.id} colorId={colorId} size={36} />
					</IconCell>
				))}
			</View>
			<ThemedText variant="footnote" style={{ paddingHorizontal: spacing.sm }}>
				Par défaut, la couleur suit la catégorie et la première icône s’adapte au nom.
			</ThemedText>
		</View>
	);
}
