import { useLocalSearchParams } from "expo-router";

import { useTransactions } from "@/data/transactions-provider";
import type { TransactionType } from "@/data/types";
import { EntryForm, SCHEDULE_FOOTER, toScheduleInput } from "@/screens/entry-form";

/** New monthly schedule. Params (`type`, `categoryId`, `note`, `day`) prefill presets such as salary or rent. */
export default function NewScheduleRoute() {
	const params = useLocalSearchParams<{ type?: TransactionType; categoryId?: string; note?: string; day?: string }>();
	const { addSchedule } = useTransactions();

	return (
		<EntryForm
			kind="schedule"
			initial={{
				type: params.type,
				categoryId: params.categoryId,
				note: params.note,
				dayOfMonth: params.day ? Number(params.day) : undefined,
			}}
			title="Nouvelle échéance"
			submitLabel="Ajouter"
			focusAmount
			footer={SCHEDULE_FOOTER}
			onSubmit={(draft) => addSchedule(toScheduleInput(draft))}
		/>
	);
}
