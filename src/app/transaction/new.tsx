import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { getCategory } from "@/data/categories";
import { useTransactions } from "@/data/transactions-provider";
import { EntryForm, toTransactionInput } from "@/screens/entry-form";
import { spacing } from "@/theme";
import { formatShortDate, toISODate } from "@/utils/dates";

/**
 * New transaction. Optional params prefill it:
 * - `categoryId`, `note`, `icon`: a quick-add shortcut (e.g. Transport);
 * - `scheduleId`: paying a bill / receiving an expected income from « À venir ».
 */
export default function NewTransactionRoute() {
	const params = useLocalSearchParams<{
		categoryId?: string;
		note?: string;
		icon?: string;
		color?: string;
		scheduleId?: string;
	}>();
	const { status, schedules, add, settle } = useTransactions();

	if (params.scheduleId) {
		const schedule = schedules.find((s) => s.id === Number(params.scheduleId));
		if (!schedule) {
			return status === "loading" ? (
				<ActivityIndicator style={{ marginTop: spacing.xxl }} />
			) : (
				<EmptyState
					icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
					title="Échéance introuvable"
					actionLabel="Fermer"
					onAction={() => router.back()}
				/>
			);
		}
		const isIncome = schedule.type === "income";
		const name = schedule.note || getCategory(schedule.categoryId, schedule.type).label;
		return (
			<EntryForm
				kind="transaction"
				initial={{ ...schedule, date: toISODate(new Date()) }}
				title={isIncome ? "Revenu reçu" : "Paiement"}
				submitLabel="Confirmer"
				essentialsOnly
				intro={`${name} · ${isIncome ? "attendu vers le" : "échéance le"} ${formatShortDate(schedule.nextDue)}`}
				footer="Ajustez le montant ou la date s’ils diffèrent de d’habitude. L’échéance passera ensuite au mois suivant."
				onSubmit={(draft) => settle(schedule, toTransactionInput(draft))}
			/>
		);
	}

	return (
		<EntryForm
			kind="transaction"
			initial={{
				categoryId: params.categoryId,
				note: params.note,
				icon: params.icon || null,
				color: params.color || null,
			}}
			title="Nouvelle opération"
			submitLabel="Ajouter"
			focusAmount
			onSubmit={(draft) => add(toTransactionInput(draft))}
		/>
	);
}
