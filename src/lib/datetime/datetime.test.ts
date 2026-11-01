import { expect, test } from "bun:test";

import { createDateTexts } from "@/lib/datetime";

const fr = createDateTexts("fr-FR");
const en = createDateTexts("en-US");
const NOVEMBER_FIRST = new Date(2026, 10, 1);

test.each([
  ["a month in French", fr.month("2026-11"), "Novembre 2026"],
  ["a month in English", en.month("2026-11"), "November 2026"],
  ["a month in a sentence, French", fr.monthInText("2026-11"), "novembre 2026"],
  [
    "a month in a sentence, English",
    en.monthInText("2026-11"),
    "November 2026",
  ],
  ["a month name in French", fr.monthName("2026-10"), "octobre"],
  ["a month name in English", en.monthName("2026-10"), "October"],
  ["a short date in French", fr.shortDate("2026-11-05"), "5 nov."],
  ["a short date in English", en.shortDate("2026-11-05"), "Nov 5"],
  ["a long date in French", fr.longDate(NOVEMBER_FIRST), "1 novembre 2026"],
])("writes %s", (_name, written, expected) => {
  expect(written).toBe(expected);
});

test.each([
  ["today", fr, "2026-11-01", "Aujourd’hui"],
  ["yesterday", en, "2026-10-31", "Yesterday"],
  ["an older day in French", fr, "2026-10-26", "Lundi 26 octobre"],
  ["an older day in English", en, "2026-10-26", "Monday, October 26"],
])("titles a day: %s", (_name, dates, day, title) => {
  expect(dates.dayTitle(day, NOVEMBER_FIRST)).toBe(title);
});

test.each([
  ["tomorrow in French", fr, 1, "demain"],
  ["tomorrow in English", en, 1, "tomorrow"],
  ["a few days in French", fr, 3, "dans 3 jours"],
  ["a few days in English", en, 3, "in 3 days"],
  ["the past", en, -3, "3 days ago"],
])("says how far: %s", (_name, dates, days, text) => {
  expect(dates.relativeDays(days)).toBe(text);
});
