import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

import { ThemedText } from "./themed-text";

export function EmptyState({
	icon,
	title,
	message,
	actionLabel,
	onAction,
}: {
	icon: SymbolViewProps["name"];
	title: string;
	message?: string;
	actionLabel?: string;
	onAction?: () => void;
}) {
	return (
		<View
			style={{
				alignItems: "center",
				gap: spacing.sm,
				paddingVertical: spacing.xxl,
				paddingHorizontal: spacing.lg,
			}}
		>
			<SymbolView
				name={icon}
				tintColor={colors.tertiaryLabel as string}
				resizeMode="scaleAspectFit"
				style={{ width: 48, height: 48, marginBottom: spacing.sm }}
			/>
			<ThemedText variant="headline" style={{ textAlign: "center" }}>
				{title}
			</ThemedText>
			{message ? (
				<ThemedText variant="subhead" style={{ textAlign: "center" }}>
					{message}
				</ThemedText>
			) : null}
			{actionLabel && onAction ? (
				<Pressable
					accessibilityRole="button"
					onPress={onAction}
					style={({ pressed }) => ({
						marginTop: spacing.md,
						paddingVertical: spacing.sm + 4,
						paddingHorizontal: spacing.lg,
						borderRadius: radius.full,
						backgroundColor: colors.tint,
						opacity: pressed ? 0.7 : 1,
					})}
				>
					<ThemedText variant="headline" style={{ color: colors.onTint }}>
						{actionLabel}
					</ThemedText>
				</Pressable>
			) : null}
		</View>
	);
}
