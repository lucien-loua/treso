import { router, type Href } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Fragment } from "react";
import { Pressable, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { GroupedSection, RowSeparator } from "@/components/grouped-section";
import { ThemedText } from "@/components/themed-text";
import { getCategory } from "@/data/categories";
import type { Schedule, Transaction } from "@/data/types";
import { colors, spacing } from "@/theme";
import { haptics } from "@/utils/haptics";

type Step = {
	key: string;
	categoryId: string;
	title: string;
	hint: string;
	done: boolean;
	href: Href;
};

function steps(schedules: Schedule[], transactions: Transaction[]): Step[] {
	const hasSchedule = (categoryId: string) => schedules.some((s) => s.categoryId === categoryId);
	return [
		{
			key: "salary",
			categoryId: "salary",
			title: "Votre salaire",
			hint: "Vers le 26 du mois, par exemple. Treso vous le rappelle.",
			done: hasSchedule("salary"),
			href: {
				pathname: "/schedule/new",
				params: { type: "income", categoryId: "salary", note: "Salaire", day: "26" },
			},
		},
		{
			key: "rent",
			categoryId: "housing",
			title: "Votre loyer",
			hint: "À payer avant le 5, en avance ou le jour même.",
			done: hasSchedule("housing"),
			href: {
				pathname: "/schedule/new",
				params: { type: "expense", categoryId: "housing", note: "Loyer", day: "5" },
			},
		},
		{
			key: "bills",
			categoryId: "bills",
			title: "Vos factures",
			hint: "Eau, électricité, wifi… une échéance par facture.",
			done: hasSchedule("bills"),
			href: {
				pathname: "/schedule/new",
				params: { type: "expense", categoryId: "bills", note: "Électricité", day: "3" },
			},
		},
		{
			key: "daily",
			categoryId: "transport",
			title: "Une dépense du jour",
			hint: "Transport, repas… notée en quelques secondes.",
			done: transactions.some((t) => t.type === "expense" && t.scheduleId === null),
			href: { pathname: "/transaction/new", params: { categoryId: "transport" } },
		},
	];
}

export function isGetStartedComplete(schedules: Schedule[], transactions: Transaction[]) {
	return steps(schedules, transactions).every((step) => step.done);
}

/** First-run checklist: each step opens a prefilled form, and ticks itself once done. */
export function GetStarted({
	schedules,
	transactions,
	onHide,
}: {
	schedules: Schedule[];
	transactions: Transaction[];
	onHide?: () => void;
}) {
	return (
		<GroupedSection
			title="Bien démarrer"
			accessory={
				onHide ? (
					<Pressable accessibilityRole="button" hitSlop={8} onPress={onHide}>
						<ThemedText variant="subhead" style={{ color: colors.tint }}>
							Masquer
						</ThemedText>
					</Pressable>
				) : null
			}
			footer="Vous pourrez tout modifier ensuite : montants, jours, noms."
		>
			{steps(schedules, transactions).map((step, index) => (
				<Fragment key={step.key}>
					{index > 0 ? <RowSeparator inset={64} /> : null}
					<Pressable
						accessibilityRole="button"
						accessibilityState={{ checked: step.done }}
						onPress={() => {
							haptics.selection();
							router.push(step.href);
						}}
					>
						{({ pressed }) => (
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									gap: spacing.sm + 4,
									minHeight: 64,
									paddingHorizontal: spacing.md,
									paddingVertical: spacing.sm + 2,
									backgroundColor: pressed ? colors.fill : "transparent",
								}}
							>
								<CategoryIcon category={getCategory(step.categoryId)} />
								<View style={{ flex: 1, gap: 2 }}>
									<ThemedText
										variant="body"
										style={step.done ? { color: colors.secondaryLabel } : undefined}
									>
										{step.title}
									</ThemedText>
									<ThemedText variant="footnote">{step.hint}</ThemedText>
								</View>
								<SymbolView
									name={
										step.done
											? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
											: { ios: "chevron.right", android: "chevron_right", web: "chevron_right" }
									}
									tintColor={step.done ? colors.income : colors.tertiaryLabel}
									weight="semibold"
									resizeMode="scaleAspectFit"
									style={step.done ? { width: 22, height: 22 } : { width: 12, height: 12 }}
								/>
							</View>
						)}
					</Pressable>
				</Fragment>
			))}
		</GroupedSection>
	);
}
