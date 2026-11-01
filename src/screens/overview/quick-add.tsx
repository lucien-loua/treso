import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { ThemedText } from "@/components/themed-text";
import { getCategory } from "@/data/categories";
import { colors, radius, spacing } from "@/theme";
import { haptics } from "@/utils/haptics";
import { formatMoney } from "@/utils/money";
import type { Shortcut } from "@/utils/shortcuts";

function Chip({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={`Ajouter : ${label}`}
			onPress={() => {
				haptics.selection();
				onPress();
			}}
		>
			{({ pressed }) => (
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: spacing.sm,
						paddingVertical: spacing.sm,
						paddingLeft: spacing.sm,
						paddingRight: spacing.md,
						borderRadius: radius.full,
						backgroundColor: colors.surface,
						opacity: pressed ? 0.6 : 1,
					}}
				>
					{children}
					<ThemedText variant="callout" numberOfLines={1} style={{ maxWidth: 160 }}>
						{label}
					</ThemedText>
				</View>
			)}
		</Pressable>
	);
}

/** One-tap entry for everyday spending: each chip opens the form prefilled, amount focused. */
export function QuickAdd({
	shortcuts,
	todaySpentCents,
	currency,
}: {
	shortcuts: Shortcut[];
	todaySpentCents: number;
	currency: string;
}) {
	return (
		<View style={{ gap: spacing.sm }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "baseline",
					paddingHorizontal: spacing.md,
				}}
			>
				<ThemedText variant="sectionHeader" accessibilityRole="header">
					Ajout rapide
				</ThemedText>
				<ThemedText variant="footnote" style={{ fontVariant: ["tabular-nums"] }}>
					Aujourd’hui : {formatMoney(todaySpentCents, currency)}
				</ThemedText>
			</View>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={{ marginHorizontal: -spacing.md }}
				contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.md }}
			>
				{shortcuts.map((shortcut) => {
					const category = getCategory(shortcut.categoryId);
					return (
						<Chip
							key={`${shortcut.categoryId}|${shortcut.note}|${shortcut.icon ?? ""}|${shortcut.color ?? ""}`}
							label={shortcut.note || category.label}
							onPress={() =>
								router.push({
									pathname: "/transaction/new",
									params: {
										categoryId: shortcut.categoryId,
										note: shortcut.note,
										icon: shortcut.icon ?? "",
										color: shortcut.color ?? "",
									},
								})
							}
						>
							<CategoryIcon category={category} iconId={shortcut.icon} colorId={shortcut.color} size={28} />
						</Chip>
					);
				})}
				<Chip label="Autre" onPress={() => router.push("/transaction/new")}>
					<View
						style={{
							width: 28,
							height: 28,
							borderRadius: radius.sm,
							borderCurve: "continuous",
							backgroundColor: colors.fill,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<SymbolView
							name={{ ios: "plus", android: "add", web: "add" }}
							tintColor={colors.label}
							weight="semibold"
							resizeMode="scaleAspectFit"
							style={{ width: 14, height: 14 }}
						/>
					</View>
				</Chip>
			</ScrollView>
		</View>
	);
}
