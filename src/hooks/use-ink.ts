import { useColorScheme } from "react-native";

/**
 * Plain hex colors for `@expo/ui` trees: their `textStyle.color` takes CSS strings,
 * not the native semantic colors from `@/theme`. Values mirror the iOS system palette.
 */
export function useInk() {
	const dark = useColorScheme() === "dark";
	return {
		label: dark ? "#FFFFFF" : "#000000",
		secondaryLabel: "#8E8E93",
		tint: dark ? "#7D7AFF" : "#5856D6",
		danger: dark ? "#FF453A" : "#FF3B30",
		income: dark ? "#30D158" : "#34C759",
	};
}
