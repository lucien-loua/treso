import { daysBetween, monthStart, parseISODate, toISODate } from "./calendar";
import type { MonthKey } from "./calendar";
import { createDateFormatter } from "./core";
import { createRelativeDays } from "./relative";

/** Every way Treso writes a date, in one language. Made once per locale. */
export interface DateTexts {
  readonly locale: string;
  /** As a title. @example month("2026-11") → "Novembre 2026" · "November 2026" */
  month: (key: MonthKey) => string;
  /** Inside a sentence. @example monthInText("2026-11") → "novembre 2026" · "November 2026" */
  monthInText: (key: MonthKey) => string;
  /** Inside a sentence, without the year. @example monthName("2026-11") → "novembre" · "November" */
  monthName: (key: MonthKey) => string;
  /** @example shortDate("2026-11-05") → "5 nov." · "Nov 5" */
  shortDate: (iso: string) => string;
  /** @example longDate(new Date(2026, 10, 1)) → "1 novembre 2026" · "November 1, 2026" */
  longDate: (date: Date) => string;
  /** List title of a day: « Aujourd’hui », « Hier », « Samedi 1 novembre » (the year when it isn't this one). */
  dayTitle: (iso: string, today?: Date) => string;
  /** @example relativeDays(3) → "dans 3 jours" · "in 3 days" */
  relativeDays: (days: number) => string;
}

/** Upper-cases the first letter in the locale's rules ("novembre 2026" → "Novembre 2026"). */
const capitalizeIn = (locale: string) => (value: string) =>
  value.charAt(0).toLocaleUpperCase(locale) + value.slice(1);

/** Builds the date texts of a locale on `Intl`, in the phone's time zone (calendar days are local). */
export const createDateTexts = (locale: string): DateTexts => {
  const dates = createDateFormatter({ locale });
  const relativeDays = createRelativeDays(locale);
  const capitalize = capitalizeIn(locale);
  return Object.freeze({
    dayTitle(iso: string, today = new Date()) {
      const offset = daysBetween(toISODate(today), iso);
      if (offset === 0 || offset === -1) {
        return capitalize(relativeDays(offset));
      }
      const date = parseISODate(iso);
      const preset =
        date.getFullYear() === today.getFullYear()
          ? "weekdayDay"
          : "weekdayDate";
      return capitalize(dates.format(date, preset));
    },
    locale,
    longDate: (date: Date) => dates.format(date, "date"),
    month: (key: MonthKey) =>
      capitalize(dates.format(monthStart(key), "monthYear")),
    monthInText: (key: MonthKey) => dates.format(monthStart(key), "monthYear"),
    monthName: (key: MonthKey) => dates.format(monthStart(key), "month"),
    relativeDays,
    shortDate: (iso: string) => dates.format(parseISODate(iso), "day"),
  });
};
