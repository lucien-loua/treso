import { defaultCategoryId } from "@/data/catalog/categories";
import type { IconKeywords } from "@/data/catalog/icon-suggestions";
import { suggestIcon } from "@/data/catalog/icon-suggestions";
import type { TransactionType } from "@/data/types";
import type { Currency } from "@/lib/currency";
import { nextDueFrom, parseISODate, toISODate } from "@/lib/datetime";

/** Everything the form edits. `date` matters for a transaction, `dayOfMonth` and `nextDue` for a schedule. */
export interface EntryDraft {
  type: TransactionType;
  amountCents: number;
  /** The currency the amount is typed in: the entry's own, else the one on screen. */
  currency: string;
  categoryId: string;
  note: string;
  icon: string | null;
  color: string | null;
  date: string;
  dayOfMonth: number;
  nextDue: string;
}

/** The form's live state: the amount as typed, dates as `Date` for the pickers. */
export interface FormValues {
  type: TransactionType;
  amountText: string;
  categoryId: string;
  /** Picked by the user (or given by the caller): the name no longer suggests one. */
  categoryChosen: boolean;
  note: string;
  /** `null` = automatic: the icon follows the name ("Taxi" → car), else the category. */
  iconId: string | null;
  /** `null` = the category's color. */
  colorId: string | null;
  date: Date;
  dayOfMonth: number;
  /** A schedule's next due date: follows the day, but can be set by hand (e.g. this month's rent isn't paid yet). */
  nextDue: Date;
}

export const toTransactionInput = ({
  dayOfMonth: _day,
  nextDue: _nextDue,
  ...draft
}: EntryDraft) => draft;

export const toScheduleInput = ({ date: _date, ...draft }: EntryDraft) => draft;

export const initialValues = (
  initial: Partial<EntryDraft>,
  money: Currency
): FormValues => {
  const today = new Date();
  const type = initial.type ?? "expense";
  const dayOfMonth = initial.dayOfMonth ?? today.getDate();
  return {
    amountText: initial.amountCents ? money.toInput(initial.amountCents) : "",
    categoryChosen: initial.categoryId !== undefined,
    categoryId: initial.categoryId ?? defaultCategoryId[type],
    colorId: initial.color ?? null,
    date: initial.date ? parseISODate(initial.date) : today,
    dayOfMonth,
    iconId: initial.icon ?? null,
    nextDue: parseISODate(initial.nextDue ?? nextDueFrom(dayOfMonth, today)),
    note: initial.note ?? "",
    type,
  };
};

/** `keywords`: the words of the app's language that pick the automatic icon. */
export const toDraft = (
  values: FormValues,
  amount: { amountCents: number; currency: string },
  keywords: IconKeywords
): EntryDraft => ({
  ...amount,
  categoryId: values.categoryId,
  color: values.colorId,
  date: toISODate(values.date),
  dayOfMonth: values.dayOfMonth,
  icon: values.iconId ?? suggestIcon(values.note, keywords),
  nextDue: toISODate(values.nextDue),
  note: values.note.trim(),
  type: values.type,
});

const NOT_A_FIGURE = /[^\d.,]/gu;
const SEPARATORS = /[.,]/gu;
/** Up to hundreds of billions: enough for francs, short of float rounding. */
const MAX_WHOLE_DIGITS = 12;

/**
 * Keeps digits and, when the currency has cents, one decimal separator (the locale's, whichever
 * the keyboard typed) with at most the currency's decimals. Without cents, separators are
 * thousands: "25,000" stays twenty-five thousand.
 */
export const sanitizeAmount = (text: string, money: Currency) => {
  const figure = text.replaceAll(NOT_A_FIGURE, "");
  if (money.decimals === 0) {
    return figure.replaceAll(SEPARATORS, "").slice(0, MAX_WHOLE_DIGITS);
  }
  const [whole, ...fraction] = figure.split(SEPARATORS);
  const integer = whole.slice(0, MAX_WHOLE_DIGITS);
  if (fraction.length === 0) {
    return integer;
  }
  return `${integer || "0"}${money.decimalSeparator}${fraction.join("").slice(0, money.decimals)}`;
};
