import type { DailyExpense, FixedExpense, IncomeSource } from "@/data/profile";
import type { TransactionType } from "@/data/types";

import type { CategoryId } from "./categories";
import type { IconId } from "./icons";

/** Something set up once as a monthly reminder: rent by the 5th, salary around the 26th. */
interface SchedulePreset {
  kind: "schedule";
  type: TransactionType;
  categoryId: CategoryId;
  icon: IconId;
  /** Usual day of the month, a starting point the user adjusts */
  day: number;
}

/** Something noted as it happens: a sale, money sent by family. */
interface TransactionPreset {
  kind: "transaction";
  type: TransactionType;
  categoryId: CategoryId;
  icon: IconId;
}

export type Preset = SchedulePreset | TransactionPreset;

const RENT_DAY = 5;
const BILL_DAY = 3;
const SALARY_DAY = 26;
const START_OF_MONTH = 1;

export const INCOME_PRESETS: Record<IncomeSource, Preset> = {
  business: {
    categoryId: "freelance",
    icon: "work",
    kind: "transaction",
    type: "income",
  },
  family: {
    categoryId: "gifts",
    icon: "family",
    kind: "transaction",
    type: "income",
  },
  salary: {
    categoryId: "salary",
    day: SALARY_DAY,
    icon: "cash",
    kind: "schedule",
    type: "income",
  },
};

const bill = (
  categoryId: CategoryId,
  icon: IconId,
  day: number
): SchedulePreset => ({
  categoryId,
  day,
  icon,
  kind: "schedule",
  type: "expense",
});

export const FIXED_PRESETS: Record<FixedExpense, SchedulePreset> = {
  electricity: bill("bills", "bolt", BILL_DAY),
  family: bill("help", "family", START_OF_MONTH),
  internet: bill("bills", "wifi", BILL_DAY),
  phone: bill("bills", "phone", START_OF_MONTH),
  rent: bill("housing", "house", RENT_DAY),
  school: bill("education", "school", RENT_DAY),
  tontine: bill("other-expense", "invest", START_OF_MONTH),
  water: bill("bills", "water", BILL_DAY),
};

/** A day-to-day expense as a quick-add shortcut: its category and, when it isn't the category's, its icon. */
export const DAILY_PRESETS: Record<
  DailyExpense,
  { categoryId: CategoryId; icon: IconId | null }
> = {
  airtime: { categoryId: "bills", icon: "phone" },
  food: { categoryId: "restaurants", icon: null },
  fuel: { categoryId: "transport", icon: "fuel" },
  groceries: { categoryId: "groceries", icon: null },
  transport: { categoryId: "transport", icon: null },
};
