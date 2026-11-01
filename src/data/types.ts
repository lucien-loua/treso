export type TransactionType = "expense" | "income";

export type Transaction = {
	id: number;
	type: TransactionType;
	/** Always positive, in hundredths of the currency unit. `type` carries the sign. */
	amountCents: number;
	categoryId: string;
	note: string;
	/** Local calendar date, `YYYY-MM-DD`. */
	date: string;
	createdAt: number;
	/** Set when the transaction settled a monthly schedule (rent paid, salary received…). */
	scheduleId: number | null;
	/** The due date (`YYYY-MM-DD`) this transaction settled. Deleting it puts that due date back. */
	settlesDue: string | null;
	/** Icon id from `@/data/icons` chosen instead of the category's; `null` uses the category icon. */
	icon: string | null;
	/** Color key from `categoryColors` chosen instead of the category's; `null` uses the category color. */
	color: string | null;
};

export type TransactionInput = Omit<Transaction, "id" | "createdAt" | "scheduleId" | "settlesDue">;

/**
 * A monthly bill or income the user confirms by hand, because its exact day and amount vary:
 * rent due by the 5th, salary expected around the 26th.
 */
export type Schedule = Omit<TransactionInput, "date"> & {
	id: number;
	/** Expenses: pay by this day. Income: expected around this day. 1–31, clamped to short months. */
	dayOfMonth: number;
	/** Next unsettled due date, `YYYY-MM-DD`. Paying moves it one month ahead, even when paid early. */
	nextDue: string;
};

export type ScheduleInput = Omit<Schedule, "id">;
