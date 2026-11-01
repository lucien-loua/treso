/** Where money comes from. None of them: no regular income (student, between jobs…). */
export const INCOME_SOURCES = ["salary", "business", "family"] as const;
export type IncomeSource = (typeof INCOME_SOURCES)[number];

/** What is paid every month, each one becoming a reminder. */
export const FIXED_EXPENSES = [
  "rent",
  "electricity",
  "water",
  "internet",
  "phone",
  "school",
  "tontine",
  "family",
] as const;
export type FixedExpense = (typeof FIXED_EXPENSES)[number];

/** What is spent on day to day, each one becoming a quick-add shortcut. */
export const DAILY_EXPENSES = [
  "transport",
  "food",
  "groceries",
  "airtime",
  "fuel",
] as const;
export type DailyExpense = (typeof DAILY_EXPENSES)[number];

/** What the user told Treso about their life, so it only suggests what applies to them. */
export interface Profile {
  income: IncomeSource[];
  fixed: FixedExpense[];
  daily: DailyExpense[];
}

/** The usual setup, for people who skip the first-launch questions: changeable in Settings. */
export const DEFAULT_PROFILE: Profile = {
  daily: ["transport", "groceries", "food"],
  fixed: ["rent", "electricity"],
  income: ["salary"],
};

/** The known ids of `value`, in the order of `all`, each once. */
const pick = <Id extends string>(value: unknown, all: readonly Id[]): Id[] =>
  Array.isArray(value) ? all.filter((id) => value.includes(id)) : [];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** A profile from stored or imported data; anything unknown is dropped. */
export const readProfile = (value: unknown): Profile | null => {
  if (!isRecord(value)) {
    return null;
  }
  const { income, fixed, daily } = value;
  if (
    !Array.isArray(income) ||
    !Array.isArray(fixed) ||
    !Array.isArray(daily)
  ) {
    return null;
  }
  return {
    daily: pick(daily, DAILY_EXPENSES),
    fixed: pick(fixed, FIXED_EXPENSES),
    income: pick(income, INCOME_SOURCES),
  };
};
