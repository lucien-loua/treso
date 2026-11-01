import { defaultCategoryId } from "@/data/catalog/categories";
import { suggestIcon } from "@/data/catalog/icon-suggestions";
import type { TransactionType } from "@/data/types";
import { nextDueFrom, parseISODate, toISODate } from "@/utils/dates";
import { centsToInput } from "@/utils/money";

/** Everything the form edits. `date` matters for a transaction, `dayOfMonth` and `nextDue` for a schedule. */
export interface EntryDraft {
  type: TransactionType;
  amountCents: number;
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
  note: string;
  /** `null` = automatic: the icon follows the name (« Taxi » → car), else the category. */
  iconId: string | null;
  /** `null` = the category's color. */
  colorId: string | null;
  date: Date;
  dayOfMonth: number;
  /** A schedule's next due date: follows the day, but can be set by hand (e.g. this month's rent isn't paid yet). */
  nextDue: Date;
}

export const SCHEDULE_FOOTER =
  "Treso vous la rappelle chaque mois dans « À venir ». Quand c’est payé (ou reçu), touchez le bouton : le montant et la date peuvent varier.";

export const toTransactionInput = ({
  dayOfMonth: _day,
  nextDue: _nextDue,
  ...draft
}: EntryDraft) => draft;

export const toScheduleInput = ({ date: _date, ...draft }: EntryDraft) => draft;

export const initialValues = (
  initial: Partial<EntryDraft> = {}
): FormValues => {
  const today = new Date();
  const type = initial.type ?? "expense";
  const dayOfMonth = initial.dayOfMonth ?? today.getDate();
  return {
    amountText: initial.amountCents ? centsToInput(initial.amountCents) : "",
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

export const toDraft = (
  values: FormValues,
  amountCents: number
): EntryDraft => ({
  amountCents,
  categoryId: values.categoryId,
  color: values.colorId,
  date: toISODate(values.date),
  dayOfMonth: values.dayOfMonth,
  icon: values.iconId ?? suggestIcon(values.note),
  nextDue: toISODate(values.nextDue),
  note: values.note.trim(),
  type: values.type,
});

/** Keeps digits and, when the currency has cents, one decimal comma with at most `decimals` digits. */
export const sanitizeAmount = (text: string, decimals: number) => {
  const [whole, ...fraction] = text
    .replaceAll(/[^\d.,]/gu, "")
    .replaceAll(".", ",")
    .split(",");
  const integer = whole.slice(0, 12);
  if (decimals === 0 || fraction.length === 0) {
    return integer;
  }
  return `${integer || "0"},${fraction.join("").slice(0, decimals)}`;
};
