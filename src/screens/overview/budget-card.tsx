import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { GroupedSection } from "@/components/grouped-section";
import { ProgressBar } from "@/components/progress-bar";
import { ThemedText } from "@/components/themed-text";
import { colors, spacing } from "@/theme";
import { daysLeftInMonth, type MonthKey } from "@/utils/dates";
import { formatMoney } from "@/utils/money";

export function BudgetCard({
	budgetCents,
	spentCents,
	month,
	currency,
}: {
	budgetCents: number | null;
	spentCents: number;
	month: MonthKey;
	currency: string;
}) {
	if (budgetCents === null) {
		return (
			<GroupedSection title="Budget">
				<Pressable
					accessibilityRole="button"
					onPress={() => router.navigate("/settings")}
					style={({ pressed }) => ({
						flexDirection: "row",
						alignItems: "center",
						gap: spacing.sm,
						padding: spacing.md,
						backgroundColor: pressed ? colors.fill : "transparent",
					})}
				>
					<View style={{ flex: 1, gap: 2 }}>
						<ThemedText variant="body">Définir un budget mensuel</ThemedText>
						<ThemedText variant="footnote">Suivez ce qu’il vous reste à dépenser chaque mois.</ThemedText>
					</View>
					<SymbolView
						name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
						tintColor={colors.tertiaryLabel}
						weight="semibold"
						resizeMode="scaleAspectFit"
						style={{ width: 12, height: 12 }}
					/>
				</Pressable>
			</GroupedSection>
		);
	}

	const ratio = spentCents / budgetCents;
	const remaining = budgetCents - spentCents;
	const daysLeft = daysLeftInMonth(month);
	const barColor = ratio >= 1 ? colors.danger : ratio >= 0.8 ? colors.warning : colors.tint;

	let hint = `${formatMoney(spentCents, currency)} dépensés sur ${formatMoney(budgetCents, currency)}`;
	if (remaining > 0 && daysLeft > 0) {
		hint += ` · ${formatMoney(Math.floor(remaining / daysLeft), currency)} par jour sur ${daysLeft} j`;
	}

	return (
		<GroupedSection
			title="Budget"
			accessory={<ThemedText variant="footnote">{Math.round(ratio * 100)} % utilisé</ThemedText>}
		>
			<View style={{ padding: spacing.md, gap: spacing.sm + 4 }}>
				<ThemedText
					variant="title"
					selectable
					style={{ fontVariant: ["tabular-nums"], color: remaining < 0 ? colors.danger : colors.label }}
				>
					{remaining >= 0
						? `Reste ${formatMoney(remaining, currency)}`
						: `Dépassé de ${formatMoney(-remaining, currency)}`}
				</ThemedText>
				<ProgressBar value={ratio} color={barColor} height={8} />
				<ThemedText variant="footnote">{hint}</ThemedText>
			</View>
		</GroupedSection>
	);
}
