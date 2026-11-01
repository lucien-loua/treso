import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { useTransactions } from "@/data/transactions-provider";
import type { Schedule } from "@/data/types";
import { EntryForm, SCHEDULE_FOOTER, toScheduleInput } from "@/screens/entry-form";
import { spacing } from "@/theme";

export default function EditScheduleRoute() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { status, schedules, updateSchedule, removeSchedule } = useTransactions();
	// Keeps the form on screen while the sheet dismisses after a delete.
	const [deleted, setDeleted] = useState<Schedule | null>(null);
	const schedule = schedules.find((s) => s.id === Number(id)) ?? deleted;

	if (!schedule) {
		return status === "loading" ? (
			<ActivityIndicator style={{ marginTop: spacing.xxl }} />
		) : (
			<>
				<Stack.Screen.Title>Échéance</Stack.Screen.Title>
				<EmptyState
					icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
					title="Échéance introuvable"
					actionLabel="Fermer"
					onAction={() => router.back()}
				/>
			</>
		);
	}

	return (
		<EntryForm
			key={schedule.id}
			kind="schedule"
			initial={schedule}
			title="Échéance"
			submitLabel="Enregistrer"
			footer={SCHEDULE_FOOTER}
			onSubmit={(draft) => updateSchedule(schedule, toScheduleInput(draft))}
			deleteLabel="Supprimer l’échéance"
			deleteMessage="Elle ne sera plus rappelée. Les paiements déjà enregistrés sont conservés."
			onDelete={async () => {
				setDeleted(schedule);
				await removeSchedule(schedule.id);
			}}
		/>
	);
}
