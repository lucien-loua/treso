import { expect, test } from "bun:test";

import type { Schedule } from "@/data/types";
import { fr } from "@/i18n/messages/fr";
import { plannedReminders } from "@/utils/reminders";

const NOVEMBER = 10;
const DECEMBER = 11;

const schedule = (changes: Partial<Schedule>): Schedule => ({
  amountCents: 7_500_000,
  categoryId: "housing",
  color: null,
  currency: "XOF",
  dayOfMonth: 5,
  icon: null,
  id: 1,
  nextDue: "2026-11-05",
  note: "Loyer",
  type: "expense",
  ...changes,
});

const remindersAt = (now: Date, changes: Partial<Schedule> = {}) =>
  plannedReminders([schedule(changes)], fr, now);

test.each([
  ["well before", new Date(2026, NOVEMBER, 1, 20), 4, fr.reminders.dueTomorrow],
  [
    "the day before, early",
    new Date(2026, NOVEMBER, 4, 8),
    4,
    fr.reminders.dueTomorrow,
  ],
  [
    "the day before, too late",
    new Date(2026, NOVEMBER, 4, 10),
    5,
    fr.schedules.dueToday,
  ],
  [
    "on the day, early",
    new Date(2026, NOVEMBER, 5, 8),
    5,
    fr.schedules.dueToday,
  ],
])("reminds of a bill: %s", (_when, now, day, body) => {
  expect(remindersAt(now)).toEqual([
    { body, date: new Date(2026, NOVEMBER, day, 9), title: "Loyer" },
  ]);
});

test.each([
  ["on the day, too late", new Date(2026, NOVEMBER, 5, 10)],
  ["at the very moment", new Date(2026, NOVEMBER, 5, 9)],
  ["once it's late", new Date(2026, NOVEMBER, 20)],
])("stays quiet about a bill %s", (_when, now) => {
  expect(remindersAt(now)).toEqual([]);
});

test("reminds of an income on the day only", () => {
  const income = {
    categoryId: "salary",
    note: "Salaire",
    type: "income",
  } as const;
  expect(
    remindersAt(new Date(2026, NOVEMBER, 4), {
      ...income,
      nextDue: "2026-11-26",
    })
  ).toEqual([
    {
      body: fr.schedules.expectedToday,
      date: new Date(2026, NOVEMBER, 26, 9),
      title: "Salaire",
    },
  ]);
  expect(
    remindersAt(new Date(2026, NOVEMBER, 26, 10), {
      ...income,
      nextDue: "2026-11-26",
    })
  ).toEqual([]);
});

test("goes back across months", () => {
  const [reminder] = remindersAt(new Date(2026, NOVEMBER, 1), {
    nextDue: "2026-12-01",
  });
  expect(reminder?.date).toEqual(new Date(2026, NOVEMBER, 30, 9));
  expect(reminder?.date.getMonth()).not.toBe(DECEMBER);
});

test("uses the category's name when the schedule has none", () => {
  const [reminder] = remindersAt(new Date(2026, NOVEMBER, 1), { note: "" });
  expect(reminder?.title).toBe(fr.categories.housing);
});

test("never shows an amount", () => {
  const [reminder] = remindersAt(new Date(2026, NOVEMBER, 1));
  expect(`${reminder?.title} ${reminder?.body}`).not.toMatch(/\d/u);
});

test("plans one reminder per schedule", () => {
  const reminders = plannedReminders(
    [schedule({ id: 1 }), schedule({ id: 2, note: "Internet" })],
    fr,
    new Date(2026, NOVEMBER, 1)
  );
  expect(reminders.map(({ title }) => title)).toEqual(["Loyer", "Internet"]);
});
