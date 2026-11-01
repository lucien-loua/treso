import { toISODate } from "@/utils/dates";

import type { TransactionInput } from "./types";

type Template = Omit<TransactionInput, "date" | "icon" | "color"> & { day: number };

// One typical month, replayed over the current month and the two before it.
const month: Template[] = [
	{ day: 1, type: "income", amountCents: 245000, categoryId: "salary", note: "Salaire" },
	{ day: 2, type: "expense", amountCents: 75000, categoryId: "housing", note: "Loyer" },
	{ day: 3, type: "expense", amountCents: 6420, categoryId: "groceries", note: "Supermarché" },
	{ day: 5, type: "expense", amountCents: 1599, categoryId: "subscriptions", note: "Musique" },
	{ day: 6, type: "expense", amountCents: 3200, categoryId: "restaurants", note: "Dîner entre amis" },
	{ day: 8, type: "expense", amountCents: 7500, categoryId: "transport", note: "Pass transport" },
	{ day: 10, type: "expense", amountCents: 8990, categoryId: "bills", note: "Électricité" },
	{ day: 12, type: "expense", amountCents: 4875, categoryId: "groceries", note: "Marché" },
	{ day: 14, type: "income", amountCents: 40000, categoryId: "freelance", note: "Mission design" },
	{ day: 15, type: "expense", amountCents: 5990, categoryId: "shopping", note: "Chaussures" },
	{ day: 17, type: "expense", amountCents: 2500, categoryId: "health", note: "Pharmacie" },
	{ day: 19, type: "expense", amountCents: 1850, categoryId: "leisure", note: "Cinéma" },
	{ day: 21, type: "expense", amountCents: 5730, categoryId: "groceries", note: "Supermarché" },
	{ day: 24, type: "expense", amountCents: 2990, categoryId: "bills", note: "Internet" },
	{ day: 26, type: "expense", amountCents: 1450, categoryId: "restaurants", note: "Déjeuner" },
];

// Template amounts are written in dollars; scale them so francs get realistic figures.
const scale: Record<string, { factor: number; roundTo: number }> = {
	USD: { factor: 1, roundTo: 1 },
	XOF: { factor: 600, roundTo: 100_00 },
	GNF: { factor: 8600, roundTo: 1000_00 },
};

export function buildSampleTransactions(currency: string, today = new Date()): TransactionInput[] {
	const { factor, roundTo } = scale[currency] ?? scale.USD;
	const result: TransactionInput[] = [];
	for (let offset = 2; offset >= 0; offset--) {
		const year = today.getFullYear();
		const monthIndex = today.getMonth() - offset;
		for (const { day, ...rest } of month) {
			const date = new Date(year, monthIndex, day);
			if (date > today) continue;
			// Vary amounts a little from month to month so the charts look alive.
			const jitter = rest.type === "expense" && rest.categoryId !== "housing" ? 1 + (offset - 1) * 0.12 : 1;
			const amountCents = Math.max(roundTo, Math.round((rest.amountCents * jitter * factor) / roundTo) * roundTo);
			result.push({ ...rest, amountCents, date: toISODate(date), icon: null, color: null });
		}
	}
	return result;
}
