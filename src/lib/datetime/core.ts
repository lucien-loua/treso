/**
 * Named ways to write a moment, as `Intl.DateTimeFormat` options. Screens ask for a preset by
 * name, never for a set of options: one place decides how "a day" looks.
 */
export const PRESETS = {
  /** "1 novembre 2026" */
  date: { day: "numeric", month: "long", year: "numeric" },
  /** "5 nov." · "Nov 5" */
  day: { day: "numeric", month: "short" },
  /** "novembre" · "November" */
  month: { month: "long" },
  /** "novembre 2026" */
  monthYear: { month: "long", year: "numeric" },
  /** "samedi 1 novembre 2026" */
  weekdayDate: {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  },
  /** "samedi 1 novembre" */
  weekdayDay: { day: "numeric", month: "long", weekday: "long" },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;

export type DatePreset = keyof typeof PRESETS;

/** What a moment can be given as: a Date, an ISO string or a timestamp in milliseconds. */
export type Moment = Date | number | string;

export interface DateFormatterOptions {
  /** BCP 47 locale that writes the months and the order of the parts. */
  locale: string;
  /**
   * IANA zone every moment is written in. Leave it out to write in the phone's own zone,
   * which is what Treso's calendar days (`YYYY-MM-DD`, local) need.
   */
  timeZone?: string;
}

export interface DateFormatter {
  readonly locale: string;
  /** @example dates.format(new Date(2026, 10, 1), "weekdayDay") → "samedi 1 novembre" */
  format: (moment: Moment, preset: DatePreset) => string;
}

const asDate = (moment: Moment): Date =>
  moment instanceof Date ? moment : new Date(moment);

/** Builds a formatter on `Intl.DateTimeFormat`, one `Intl` object per preset, made when first used. */
export const createDateFormatter = ({
  locale,
  timeZone,
}: DateFormatterOptions): DateFormatter => {
  const formatters = new Map<DatePreset, Intl.DateTimeFormat>();
  return Object.freeze({
    format(moment: Moment, preset: DatePreset) {
      let formatter = formatters.get(preset);
      if (!formatter) {
        formatter = new Intl.DateTimeFormat(locale, {
          ...PRESETS[preset],
          ...(timeZone ? { timeZone } : null),
        });
        formatters.set(preset, formatter);
      }
      return formatter.format(asDate(moment));
    },
    locale,
  });
};
