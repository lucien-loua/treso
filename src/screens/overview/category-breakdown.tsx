import { Fragment } from "react";
import { View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { GroupedSection, RowSeparator } from "@/components/grouped-section";
import { ProgressBar } from "@/components/progress-bar";
import { ThemedText } from "@/components/themed-text";
import { getCategory } from "@/data/categories";
import { categoryColors, radius, spacing } from "@/theme";
import { formatMoney } from "@/utils/money";
import type { CategoryTotal } from "@/utils/stats";

/** One capsule split into the month's spending shares, then one row per category. */
export function CategoryBreakdown({ totals, currency }: { totals: CategoryTotal[]; currency: string }) {
	if (totals.length === 0) {
		return (
			<GroupedSection title="Dépenses par catégorie">
				<ThemedText variant="subhead" style={{ padding: spacing.md }}>
					Aucune dépense ce mois-ci.
				</ThemedText>
			</GroupedSection>
		);
	}

	return (
		<GroupedSection title="Dépenses par catégorie">
			<View
				accessible
				accessibilityLabel={totals
					.map((t) => `${getCategory(t.categoryId).label} ${Math.round(t.share * 100)} %`)
					.join(", ")}
				style={{
					flexDirection: "row",
					height: 12,
					margin: spacing.md,
					marginBottom: spacing.sm,
					gap: 2,
					borderRadius: radius.full,
					overflow: "hidden",
				}}
			>
				{totals.map((t) => (
					<View
						key={t.categoryId}
						style={{
							flex: t.share,
							backgroundColor: categoryColors[getCategory(t.categoryId).color],
						}}
					/>
				))}
			</View>
			{totals.map((t, index) => {
				const category = getCategory(t.categoryId);
				return (
					<Fragment key={t.categoryId}>
						{index > 0 ? <RowSeparator inset={spacing.md + 32 + spacing.sm + 4} /> : null}
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								gap: spacing.sm + 4,
								paddingHorizontal: spacing.md,
								paddingVertical: spacing.sm + 2,
							}}
						>
							<CategoryIcon category={category} size={32} />
							<View style={{ flex: 1, gap: 6 }}>
								<View style={{ flexDirection: "row", alignItems: "baseline", gap: spacing.sm }}>
									<ThemedText variant="body" numberOfLines={1} style={{ flex: 1 }}>
										{category.label}
									</ThemedText>
									<ThemedText variant="footnote" style={{ fontVariant: ["tabular-nums"] }}>
										{Math.round(t.share * 100)} %
									</ThemedText>
									<ThemedText
										variant="body"
										selectable
										style={{ fontWeight: "600", fontVariant: ["tabular-nums"] }}
									>
										{formatMoney(t.totalCents, currency)}
									</ThemedText>
								</View>
								<ProgressBar value={t.share} color={categoryColors[category.color]} height={4} />
							</View>
						</View>
					</Fragment>
				);
			})}
			<View style={{ height: spacing.xs }} />
		</GroupedSection>
	);
}
