import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { colors, radius, spacing } from "@/theme";
import { formatMonth, shiftMonth, type MonthKey } from "@/utils/dates";
import { haptics } from "@/utils/haptics";

function ArrowButton({
	icon,
	label,
	disabled,
	onPress,
}: {
	icon: SymbolViewProps["name"];
	label: string;
	disabled?: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={label}
			accessibilityState={{ disabled }}
			disabled={disabled}
			hitSlop={8}
			onPress={() => {
				haptics.selection();
				onPress();
			}}
			style={({ pressed }) => ({
				width: 36,
				height: 36,
				borderRadius: radius.full,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: colors.fill,
				opacity: disabled ? 0.35 : pressed ? 0.6 : 1,
			})}
		>
			<SymbolView
				name={icon}
				tintColor={colors.label}
				weight="semibold"
				resizeMode="scaleAspectFit"
				style={{ width: 14, height: 14 }}
			/>
		</Pressable>
	);
}

export function MonthSwitcher({
	month,
	currentMonth,
	onChange,
}: {
	month: MonthKey;
	currentMonth: MonthKey;
	onChange: (month: MonthKey) => void;
}) {
	const isCurrent = month === currentMonth;
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				paddingHorizontal: spacing.xs,
			}}
		>
			<ArrowButton
				icon={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
				label="Mois précédent"
				onPress={() => onChange(shiftMonth(month, -1))}
			/>
			<Pressable
				accessibilityRole="button"
				accessibilityHint={isCurrent ? undefined : "Revient au mois en cours"}
				disabled={isCurrent}
				onPress={() => onChange(currentMonth)}
			>
				<ThemedText variant="headline" accessibilityRole="header">
					{formatMonth(month)}
				</ThemedText>
			</Pressable>
			<ArrowButton
				icon={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
				label="Mois suivant"
				disabled={isCurrent}
				onPress={() => onChange(shiftMonth(month, 1))}
			/>
		</View>
	);
}
