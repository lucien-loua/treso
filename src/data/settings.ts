import { CURRENCY_CODES, DEFAULT_CURRENCY_CODE } from "@/lib/currency";

import { readStored, useStored, writeStored } from "./storage";

const CURRENCY_KEY = "treso.currency";
const BUDGET_KEY = "treso.monthlyBudgetCents";
const BUDGET_CURRENCY_KEY = "treso.monthlyBudgetCurrency";
const GET_STARTED_HIDDEN_KEY = "treso.getStartedHidden";

const offeredOrDefault = (code: string | null) =>
  code !== null && CURRENCY_CODES.includes(code) ? code : DEFAULT_CURRENCY_CODE;

/** The ISO code chosen in Settings (the default before any choice), read once. */
export const chosenCurrencyCode = () =>
  offeredOrDefault(readStored(CURRENCY_KEY));

/** The ISO code chosen in Settings, and a way to change it. Screens use `useMoney()`. */
export const useCurrencyCode = (): [string, (code: string) => void] => {
  const code = offeredOrDefault(useStored(CURRENCY_KEY));
  return [code, (next) => writeStored(CURRENCY_KEY, next)];
};

/** Whether the user dismissed the get-started checklist. */
export const useGetStartedHidden = (): [boolean, (hidden: boolean) => void] => {
  const hidden = useStored(GET_STARTED_HIDDEN_KEY) === "1";
  return [
    hidden,
    (next) => writeStored(GET_STARTED_HIDDEN_KEY, next ? "1" : null),
  ];
};

/** A monthly spending limit, in hundredths of `currency`. */
export interface Budget {
  amountCents: number;
  currency: string;
}

const budgetFrom = (
  rawAmount: string | null,
  currency: string | null
): Budget | null => {
  const amountCents = rawAmount === null ? Number.NaN : Number(rawAmount);
  return currency !== null &&
    Number.isSafeInteger(amountCents) &&
    amountCents > 0
    ? { amountCents, currency }
    : null;
};

const writeBudget = (budget: Budget | null) => {
  writeStored(BUDGET_CURRENCY_KEY, budget?.currency ?? null);
  writeStored(BUDGET_KEY, budget === null ? null : String(budget.amountCents));
};

export const useMonthlyBudget = (): [
  Budget | null,
  (budget: Budget | null) => void,
] => {
  const budget = budgetFrom(
    useStored(BUDGET_KEY),
    useStored(BUDGET_CURRENCY_KEY)
  );
  return [budget, writeBudget];
};

/** The settings a backup carries. */
export interface SettingsBackup {
  currency: string;
  budget: Budget | null;
}

export const settingsBackup = (): SettingsBackup => ({
  budget: budgetFrom(readStored(BUDGET_KEY), readStored(BUDGET_CURRENCY_KEY)),
  currency: chosenCurrencyCode(),
});

export const restoreSettings = ({ currency, budget }: SettingsBackup) => {
  writeStored(CURRENCY_KEY, offeredOrDefault(currency));
  writeBudget(budget);
};
