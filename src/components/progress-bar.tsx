import { View, type ColorValue } from "react-native";

import { colors, radius } from "@/theme";

/** Thin capsule track. `value` is clamped to 0–1. */
export function ProgressBar({
	value,
	color,
	height = 6,
}: {
	value: number;
	color: ColorValue;
	height?: number;
}) {
	const clamped = Math.min(Math.max(value, 0), 1);
	return (
		<View
			accessibilityRole="progressbar"
			accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
			style={{
				height,
				borderRadius: radius.full,
				backgroundColor: colors.fill,
				overflow: "hidden",
			}}
		>
			<View
				style={{
					width: `${clamped * 100}%`,
					height: "100%",
					borderRadius: radius.full,
					backgroundColor: color,
				}}
			/>
		</View>
	);
}
