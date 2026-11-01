import "expo-sqlite/localStorage/install";
import { useSyncExternalStore } from "react";

const CURRENCY_KEY = "treso.currency";
const BUDGET_KEY = "treso.monthlyBudgetCents";

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const write = (key: string, value: string | null) => {
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, value);
  }
  for (const listener of listeners) {
    listener();
  }
};

// Snapshots are primitives so `useSyncExternalStore` sees stable values between renders.
const readCurrencyCode = () => localStorage.getItem(CURRENCY_KEY);

const readBudget = (): number | null => {
  const raw = localStorage.getItem(BUDGET_KEY);
  if (raw === null) {
    return null;
  }
  const cents = Number(raw);
  return Number.isFinite(cents) && cents > 0 ? cents : null;
};

/** The ISO code chosen in Settings, `null` before any choice. Screens use `useMoney()`. */
export const useCurrencyCode = (): [string | null, (code: string) => void] => {
  const code = useSyncExternalStore(
    subscribe,
    readCurrencyCode,
    readCurrencyCode
  );
  return [code, (next) => write(CURRENCY_KEY, next)];
};

const GET_STARTED_HIDDEN_KEY = "treso.getStartedHidden";

const readGetStartedHidden = () =>
  localStorage.getItem(GET_STARTED_HIDDEN_KEY) === "1";

/** Whether the user dismissed the get-started checklist. */
export const useGetStartedHidden = (): [boolean, (hidden: boolean) => void] => {
  const hidden = useSyncExternalStore(
    subscribe,
    readGetStartedHidden,
    readGetStartedHidden
  );
  return [hidden, (next) => write(GET_STARTED_HIDDEN_KEY, next ? "1" : null)];
};

export const useMonthlyBudget = (): [
  number | null,
  (cents: number | null) => void,
] => {
  const budget = useSyncExternalStore(subscribe, readBudget, readBudget);
  return [
    budget,
    (cents) => write(BUDGET_KEY, cents === null ? null : String(cents)),
  ];
};
