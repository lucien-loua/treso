import "expo-sqlite/localStorage/install";

import { useSyncExternalStore } from "react";

export const currencies = [
	{ code: "XOF", label: "Franc CFA (F CFA)" },
	{ code: "GNF", label: "Franc guinéen (GNF)" },
	{ code: "USD", label: "Dollar US ($US)" },
] as const;

const DEFAULT_CURRENCY = "XOF";

const CURRENCY_KEY = "treso.currency";
const BUDGET_KEY = "treso.monthlyBudgetCents";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

function write(key: string, value: string | null) {
	if (value === null) localStorage.removeItem(key);
	else localStorage.setItem(key, value);
	for (const listener of listeners) listener();
}

// Snapshots are primitives so `useSyncExternalStore` sees stable values between renders.
function readCurrency(): string {
	const stored = localStorage.getItem(CURRENCY_KEY);
	return currencies.find((c) => c.code === stored)?.code ?? DEFAULT_CURRENCY;
}

function readBudget(): number | null {
	const raw = localStorage.getItem(BUDGET_KEY);
	if (raw === null) return null;
	const cents = Number(raw);
	return Number.isFinite(cents) && cents > 0 ? cents : null;
}

export function useCurrency(): [string, (code: string) => void] {
	const currency = useSyncExternalStore(subscribe, readCurrency, readCurrency);
	return [currency, (code) => write(CURRENCY_KEY, code)];
}

const GET_STARTED_HIDDEN_KEY = "treso.getStartedHidden";

function readGetStartedHidden() {
	return localStorage.getItem(GET_STARTED_HIDDEN_KEY) === "1";
}

/** Whether the user dismissed the « Bien démarrer » checklist. */
export function useGetStartedHidden(): [boolean, (hidden: boolean) => void] {
	const hidden = useSyncExternalStore(subscribe, readGetStartedHidden, readGetStartedHidden);
	return [hidden, (next) => write(GET_STARTED_HIDDEN_KEY, next ? "1" : null)];
}

export function useMonthlyBudget(): [number | null, (cents: number | null) => void] {
	const budget = useSyncExternalStore(subscribe, readBudget, readBudget);
	return [budget, (cents) => write(BUDGET_KEY, cents === null ? null : String(cents))];
}
