import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { View, type ColorValue } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { colors, radius, spacing } from "@/theme";
import { formatMonth, shiftMonth, type MonthKey } from "@/utils/dates";
import { formatMoney } from "@/utils/money";
import type { MonthSummary } from "@/utils/stats";

function Flow({
	icon,
	color,
	label,
	value,
}: {
	icon: SymbolViewProps["name"];
	color: ColorValue;
	label: string;
	value: string;
}) {
	return (
		<View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
			<View
				style={{
					width: 32,
					height: 32,
					borderRadius: radius.full,
					backgroundColor: colors.fill,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<SymbolView
					name={icon}
					tintColor={color}
					weight="bold"
					resizeMode="scaleAspectFit"
					style={{ width: 14, height: 14 }}
				/>
			</View>
			<View style={{ flex: 1 }}>
				<ThemedText variant="caption">{label}</ThemedText>
				<ThemedText
					variant="headline"
					selectable
					numberOfLines={1}
					adjustsFontSizeToFit
					style={{ fontVariant: ["tabular-nums"] }}
				>
					{value}
				</ThemedText>
			</View>
		</View>
	);
}

export function BalanceCard({
	summary,
	month,
	isCurrentMonth,
	forecastCents,
	currency,
}: {
	summary: MonthSummary;
	month: MonthKey;
	isCurrentMonth: boolean;
	/** Expected end-of-month balance once the remaining schedules are settled; `null` hides the line. */
	forecastCents: number | null;
	currency: string;
}) {
	const previousMonth = formatMonth(shiftMonth(month, -1)).toLowerCase();
	return (
		<View
			style={{
				backgroundColor: colors.surface,
				borderRadius: radius.xl,
				borderCurve: "continuous",
				padding: spacing.lg - 4,
				gap: spacing.md,
			}}
		>
			<View style={{ gap: spacing.xs }}>
				<ThemedText variant="subhead">
					{isCurrentMonth ? "Solde actuel" : `Solde fin ${formatMonth(month).toLowerCase()}`}
				</ThemedText>
				<ThemedText
					variant="hero"
					selectable
					numberOfLines={1}
					adjustsFontSizeToFit
					style={{ color: summary.closingCents < 0 ? colors.danger : colors.label }}
				>
					{formatMoney(summary.closingCents, currency)}
				</ThemedText>
				<ThemedText variant="footnote" selectable>
					Report de {previousMonth} : {formatMoney(summary.openingCents, currency)} · Ce mois :{" "}
					{formatMoney(summary.balanceCents, currency, { showPlus: true })}
				</ThemedText>
			</View>
			{forecastCents !== null ? (
				<View
					accessible
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						gap: spacing.sm,
						paddingVertical: spacing.sm,
						paddingHorizontal: spacing.sm + 4,
						borderRadius: radius.md,
						borderCurve: "continuous",
						backgroundColor: colors.fill,
					}}
				>
					<View style={{ flexShrink: 1 }}>
						<ThemedText variant="subhead" style={{ color: colors.label }}>
							Prévu fin {formatMonth(month).toLowerCase().split(" ")[0]}
						</ThemedText>
						<ThemedText variant="caption">Après les échéances à venir</ThemedText>
					</View>
					<ThemedText
						variant="headline"
						selectable
						style={{ fontVariant: ["tabular-nums"], color: forecastCents < 0 ? colors.danger : colors.label }}
					>
						{formatMoney(forecastCents, currency)}
					</ThemedText>
				</View>
			) : null}
			<View style={{ height: 0.5, backgroundColor: colors.separator }} />
			<View style={{ flexDirection: "row", gap: spacing.md }}>
				<Flow
					icon={{ ios: "arrow.down", android: "arrow_downward", web: "arrow_downward" }}
					color={colors.income}
					label="Revenus"
					value={formatMoney(summary.incomeCents, currency)}
				/>
				<Flow
					icon={{ ios: "arrow.up", android: "arrow_upward", web: "arrow_upward" }}
					color={colors.danger}
					label="Dépenses"
					value={formatMoney(summary.expenseCents, currency)}
				/>
			</View>
		</View>
	);
}
