import type { TextStyle } from "react-native";

import { colors } from "./colors";

export { categoryColors, colors, type CategoryColor } from "./colors";

export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
} as const;

export const radius = {
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	full: 9999,
} as const;

export const type = {
	hero: {
		fontSize: 44,
		fontWeight: "700",
		letterSpacing: -0.5,
		fontVariant: ["tabular-nums"],
		color: colors.label,
	},
	title: { fontSize: 22, fontWeight: "700", color: colors.label },
	headline: { fontSize: 17, fontWeight: "600", color: colors.label },
	body: { fontSize: 17, fontWeight: "400", color: colors.label },
	callout: { fontSize: 16, fontWeight: "400", color: colors.label },
	subhead: { fontSize: 15, fontWeight: "400", color: colors.secondaryLabel },
	footnote: { fontSize: 13, fontWeight: "400", color: colors.secondaryLabel },
	caption: { fontSize: 12, fontWeight: "500", color: colors.secondaryLabel },
	sectionHeader: {
		fontSize: 13,
		fontWeight: "600",
		textTransform: "uppercase",
		letterSpacing: 0.3,
		color: colors.secondaryLabel,
	},
} as const satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;
