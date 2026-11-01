import { router } from "expo-router";
import { Fragment, useState, type ReactNode } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, View } from "react-native";

import { AddTransactionToolbar } from "@/components/add-transaction-toolbar";
import { EmptyState } from "@/components/empty-state";
import { GroupedSection, RowSeparator } from "@/components/grouped-section";
import { ThemedText } from "@/components/themed-text";
import { TransactionRow } from "@/components/transaction-row";
import { buildSampleTransactions } from "@/data/sample-data";
import { useCurrency, useGetStartedHidden, useMonthlyBudget } from "@/data/settings";
import { useTransactions } from "@/data/transactions-provider";
import { colors, spacing } from "@/theme";
import { endOfMonth, formatMonth, monthKeyOf, toISODate, type MonthKey } from "@/utils/dates";
import { haptics } from "@/utils/haptics";
import { pendingNetCents } from "@/utils/schedules";
import { frequentExpenses } from "@/utils/shortcuts";
import { summarizeMonth } from "@/utils/stats";

import { BalanceCard } from "./balance-card";
import { BudgetCard } from "./budget-card";
import { CategoryBreakdown } from "./category-breakdown";
import { GetStarted, isGetStartedComplete } from "./get-started";
import { MonthSwitcher } from "./month-switcher";
import { QuickAdd } from "./quick-add";
import { Upcoming } from "./upcoming";

const RECENT_COUNT = 5;

export function Overview() {
	const state = useTransactions();
	const { transactions, schedules } = state;
	const [currency] = useCurrency();
	const [budget] = useMonthlyBudget();
	const [getStartedHidden, setGetStartedHidden] = useGetStartedHidden();
	const today = new Date();
	const todayIso = toISODate(today);
	const currentMonth = monthKeyOf(today);
	const [month, setMonth] = useState<MonthKey>(currentMonth);
	const isCurrentMonth = month === currentMonth;

	const summary = summarizeMonth(transactions, month);
	const recent = summary.transactions.slice(0, RECENT_COUNT);
	const dueThisMonth = schedules.filter((s) => s.nextDue <= endOfMonth(month));
	const forecastCents =
		isCurrentMonth && dueThisMonth.length > 0
			? summary.closingCents + pendingNetCents(schedules, endOfMonth(month))
			: null;
	const todaySpentCents = transactions
		.filter((t) => t.date === todayIso && t.type === "expense")
		.reduce((sum, t) => sum + t.amountCents, 0);
	const showGetStarted = !getStartedHidden && !isGetStartedComplete(schedules, transactions);

	const loadSamples = () => {
		Alert.alert("Essayer avec des exemples ?", "Trois mois d’opérations fictives seront ajoutés. Vous pourrez tout effacer dans Réglages.", [
			{ text: "Annuler", style: "cancel" },
			{
				text: "Ajouter",
				onPress: () => {
					state
						.addMany(buildSampleTransactions(currency))
						.then(haptics.success, (error) => Alert.alert("Import impossible", String(error)));
				},
			},
		]);
	};

	let content: ReactNode;
	if (state.status === "loading") {
		content = <ActivityIndicator style={{ marginTop: spacing.xxl }} />;
	} else if (state.status === "error") {
		content = (
			<EmptyState
				icon={{ ios: "exclamationmark.triangle", android: "warning", web: "warning" }}
				title="Impossible de charger vos données"
				message={state.error.message}
				actionLabel="Réessayer"
				onAction={state.reload}
			/>
		);
	} else if (transactions.length === 0 && schedules.length === 0) {
		// First launch: explain the app in one line, then the guided setup.
		content = (
			<>
				<View style={{ gap: spacing.xs, paddingHorizontal: spacing.xs }}>
					<ThemedText variant="title">Bienvenue sur Treso</ThemedText>
					<ThemedText variant="subhead">
						Suivez votre argent mois par mois : ce qui rentre, ce qui sort, et ce qu’il vous reste.
					</ThemedText>
				</View>
				<GetStarted schedules={schedules} transactions={transactions} />
				<Pressable accessibilityRole="button" hitSlop={8} onPress={loadSamples} style={{ alignSelf: "center" }}>
					<ThemedText variant="subhead" style={{ color: colors.tint }}>
						Essayer avec des exemples
					</ThemedText>
				</Pressable>
			</>
		);
	} else {
		content = (
			<>
				<MonthSwitcher month={month} currentMonth={currentMonth} onChange={setMonth} />
				<BalanceCard
					summary={summary}
					month={month}
					isCurrentMonth={isCurrentMonth}
					forecastCents={forecastCents}
					currency={currency}
				/>
				{isCurrentMonth ? (
					<QuickAdd
						shortcuts={frequentExpenses(transactions, 4, today)}
						todaySpentCents={todaySpentCents}
						currency={currency}
					/>
				) : null}
				{isCurrentMonth && schedules.length > 0 ? <Upcoming schedules={schedules} transactions={transactions} currency={currency} /> : null}
				{isCurrentMonth && showGetStarted ? (
					<GetStarted
						schedules={schedules}
						transactions={transactions}
						onHide={() => setGetStartedHidden(true)}
					/>
				) : null}
				<BudgetCard budgetCents={budget} spentCents={summary.expenseCents} month={month} currency={currency} />
				<CategoryBreakdown totals={summary.expensesByCategory} currency={currency} />
				<GroupedSection
					title="Opérations du mois"
					accessory={
						summary.transactions.length > RECENT_COUNT ? (
							<Pressable accessibilityRole="link" hitSlop={8} onPress={() => router.navigate("/transactions")}>
								<ThemedText variant="subhead" style={{ color: colors.tint }}>
									Tout voir
								</ThemedText>
							</Pressable>
						) : null
					}
				>
					{recent.length === 0 ? (
						<ThemedText variant="subhead" style={{ padding: spacing.md }}>
							Aucune opération en {formatMonth(month).toLowerCase()}.
						</ThemedText>
					) : (
						recent.map((t, index) => (
							<Fragment key={t.id}>
								{index > 0 ? <RowSeparator inset={64} /> : null}
								<TransactionRow transaction={t} currency={currency} showDate />
							</Fragment>
						))
					)}
				</GroupedSection>
			</>
		);
	}

	return (
		<>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				contentContainerStyle={{ padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl }}
			>
				{content}
			</ScrollView>
			<AddTransactionToolbar />
		</>
	);
}
