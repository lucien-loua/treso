/** How a language names day offsets when `Intl.RelativeTimeFormat` is missing. */
interface DayWords {
  /** Words written instead of a figure (`numeric: "auto"`), keyed by the offset */
  named: Record<string, string>;
  one: string;
  many: string;
  past: (count: string) => string;
  future: (count: string) => string;
}

const WORDS: Record<string, DayWords> = {
  en: {
    future: (count) => `in ${count}`,
    many: "days",
    named: { "-1": "yesterday", "0": "today", "1": "tomorrow" },
    one: "day",
    past: (count) => `${count} ago`,
  },
  fr: {
    future: (count) => `dans ${count}`,
    many: "jours",
    named: {
      "-1": "hier",
      "-2": "avant-hier",
      "0": "aujourd’hui",
      "1": "demain",
      "2": "après-demain",
    },
    one: "jour",
    past: (count) => `il y a ${count}`,
  },
};

/**
 * Writes a whole number of days from today in `locale`, as `Intl.RelativeTimeFormat` does.
 * Hermes, React Native's engine, has no `Intl.RelativeTimeFormat`: the same words are then
 * written from the table above (English for a language it doesn't list).
 * @example relativeDays(1) → "demain" (fr) · "tomorrow" (en) · relativeDays(3) → "dans 3 jours"
 */
export const createRelativeDays = (locale: string) => {
  if (typeof Intl.RelativeTimeFormat === "function") {
    const format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    return (days: number) => format.format(days, "day");
  }
  const language = locale.split("-")[0].toLowerCase();
  const words = WORDS[language] ?? WORDS.en;
  const figures = new Intl.NumberFormat(locale);
  return (days: number) => {
    const named = words.named[String(days)];
    if (named) {
      return named;
    }
    // French counts 0 and 1 in the singular, English only 1: both are plural from 2
    const count = `${figures.format(Math.abs(days))} ${Math.abs(days) < 2 ? words.one : words.many}`;
    return days < 0 ? words.past(count) : words.future(count);
  };
};
