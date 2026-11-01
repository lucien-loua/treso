/**
 * Calendar days as Treso stores them: local `YYYY-MM-DD` strings, never UTC, so an entry made
 * late in the evening keeps its day. Pure arithmetic, no formatting.
 */

const pad = (value: number) => String(value).padStart(2, "0");

/** `Date` → local `YYYY-MM-DD`. */
export const toISODate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** Local `YYYY-MM-DD` → `Date` at local midnight. */
export const parseISODate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/** A calendar month, `YYYY-MM`. */
export type MonthKey = `${number}-${string}`;

export const monthKeyOf = (date: Date): MonthKey =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

export const shiftMonth = (key: MonthKey, delta: number): MonthKey => {
  const [year, month] = key.split("-").map(Number);
  return monthKeyOf(new Date(year, month - 1 + delta, 1));
};

/** First day of a month, as a `Date`. */
export const monthStart = (key: MonthKey) => parseISODate(`${key}-01`);

/** `YYYY-MM-DD` for `day` in `key`, clamped to the month's last day (31 → 30 in November). */
export const dateInMonth = (key: MonthKey, day: number) => {
  const [year, month] = key.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  return `${key}-${pad(Math.min(day, lastDay))}`;
};

export const endOfMonth = (key: MonthKey) => dateInMonth(key, 31);

/** First date on or after `today` that falls on `day` (clamped to short months). */
export const nextDueFrom = (day: number, today = new Date()) => {
  const month = monthKeyOf(today);
  const candidate = dateInMonth(month, day);
  return candidate >= toISODate(today)
    ? candidate
    : dateInMonth(shiftMonth(month, 1), day);
};

/** Same `day`, one month after `due`. */
export const advanceDue = (due: string, day: number) =>
  dateInMonth(shiftMonth(due.slice(0, 7) as MonthKey, 1), day);

/** Same `day`, one month before `due`. */
export const previousDue = (due: string, day: number) =>
  dateInMonth(shiftMonth(due.slice(0, 7) as MonthKey, -1), day);

/** Whole calendar days from `from` to `to` (negative when `to` is earlier). */
export const daysBetween = (from: string, to: string) =>
  Math.round(
    (parseISODate(to).getTime() - parseISODate(from).getTime()) / 86_400_000
  );

/** Days left in `key` counting today; 0 for any other month. */
export const daysLeftInMonth = (key: MonthKey, today = new Date()) => {
  if (key !== monthKeyOf(today)) {
    return 0;
  }
  const lastDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  return lastDay - today.getDate() + 1;
};
