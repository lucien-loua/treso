import type { Transaction } from "@/data/types";

import { toISODate } from "./dates";

export type Shortcut = { categoryId: string; note: string; icon: string | null; color: string | null };

const FALLBACK: Shortcut[] = [
	{ categoryId: "transport", note: "", icon: null, color: null },
	{ categoryId: "groceries", note: "", icon: null, color: null },
	{ categoryId: "restaurants", note: "", icon: null, color: null },
];

/**
 * The expenses the user enters most often over the last 60 days (same category, name and icon),
 * topped up with common categories for new users. Scheduled payments are left out: they have
 * their own "Payer" button.
 */
export function frequentExpenses(transactions: Transaction[], max = 4, today = new Date()): Shortcut[] {
	const since = toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 60));
	const counts = new Map<string, { shortcut: Shortcut; count: number; last: string }>();

	for (const t of transactions) {
		if (t.type !== "expense" || t.scheduleId !== null || t.date < since) continue;
		const key = `${t.categoryId}|${t.note.toLowerCase()}|${t.icon ?? ""}|${t.color ?? ""}`;
		const entry = counts.get(key);
		if (entry) entry.count += 1;
		else counts.set(key, { shortcut: { categoryId: t.categoryId, note: t.note, icon: t.icon, color: t.color }, count: 1, last: t.date });
	}

	const result = [...counts.values()]
		.sort((a, b) => b.count - a.count || b.last.localeCompare(a.last))
		.map((entry) => entry.shortcut)
		.slice(0, max);

	for (const fallback of FALLBACK) {
		if (result.length >= max) break;
		if (!result.some((s) => s.categoryId === fallback.categoryId)) result.push(fallback);
	}
	return result;
}
