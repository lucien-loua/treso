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
  return [
    code,
    (next) => {
      // A budget saved before budgets carried a currency was in this one: say so before it changes
      if (
        readStored(BUDGET_KEY) !== null &&
        readStored(BUDGET_CURRENCY_KEY) === null
      ) {
        writeStored(BUDGET_CURRENCY_KEY, code);
      }
      writeStored(CURRENCY_KEY, next);
    },
  ];
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

export const useMonthlyBudget = (): [
  Budget | null,
  (budget: Budget | null) => void,
] => {
  const rawAmount = useStored(BUDGET_KEY);
  const [chosen] = useCurrencyCode();
  const currency = useStored(BUDGET_CURRENCY_KEY) ?? chosen;
  const amountCents = rawAmount === null ? Number.NaN : Number(rawAmount);
  const budget =
    Number.isFinite(amountCents) && amountCents > 0
      ? { amountCents, currency }
      : null;
  return [
    budget,
    (next) => {
      writeStored(BUDGET_CURRENCY_KEY, next?.currency ?? null);
      writeStored(BUDGET_KEY, next === null ? null : String(next.amountCents));
    },
  ];
};
