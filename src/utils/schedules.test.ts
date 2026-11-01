import { expect, test } from "bun:test";

import type { AmountOf } from "@/data/entries";
import type { Schedule, Transaction } from "@/data/types";
import { i18nFor } from "@/i18n/i18n";
import { plainSpaces } from "@/test/helpers";
import {
  dueStatus,
  paymentThisMonth,
  pendingNetCents,
} from "@/utils/schedules";

const i18n = i18nFor([{ languageCode: "fr", languageTag: "fr-FR" }]);
const TODAY = new Date(2026, 10, 1);
const asRecorded: AmountOf = ({ amountCents }) => amountCents;

const schedule = (changes: Partial<Schedule>): Schedule => ({
  amountCents: 1000,
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

const rentPayment: Transaction = {
  amountCents: 1000,
  categoryId: "housing",
  color: null,
  createdAt: 0,
  currency: "XOF",
  date: "2026-11-01",
  icon: null,
  id: 9,
  note: "Loyer",
  scheduleId: 1,
  settlesDue: "2026-11-05",
  type: "expense",
};

test.each([
  ["a late bill", "expense", "2026-10-30", "danger"],
  ["a bill due today", "expense", "2026-11-01", "danger"],
  ["a bill due in 3 days", "expense", "2026-11-04", "warning"],
  ["a bill due in 4 days", "expense", "2026-11-05", "normal"],
  ["a late income", "income", "2026-10-30", "warning"],
  ["an income expected today", "income", "2026-11-01", "warning"],
  ["an income expected later", "income", "2026-11-26", "normal"],
] as const)("marks %s", (_name, type, nextDue, tone) => {
  const status = dueStatus(schedule({ nextDue, type }), [], i18n, TODAY);
  expect(status.tone).toBe(tone);
});

test("says how long until a bill is due", () => {
  const status = dueStatus(schedule({}), [], i18n, TODAY);
  expect(plainSpaces(status.label)).toBe(
    i18n.t.schedules.dueBy("5 nov.", "dans 4 jours")
  );
});

test("says this month is paid when the next due date is next month", () => {
  const paid = schedule({ nextDue: "2026-12-05" });
  expect(paymentThisMonth(paid, [rentPayment], TODAY)).toBe(rentPayment);
  expect(dueStatus(paid, [rentPayment], i18n, TODAY)).toEqual({
    label: i18n.t.schedules.paid("1 nov.", "5 déc."),
    tone: "done",
  });
});

test("ignores another schedule's payment", () => {
  const other = schedule({ id: 2, nextDue: "2026-12-05" });
  expect(paymentThisMonth(other, [rentPayment], TODAY)).toBeUndefined();
});

test("counts what's still due by a date, overdue included", () => {
  const schedules = [
    schedule({ amountCents: 1000, id: 1, nextDue: "2026-10-30" }),
    schedule({
      amountCents: 5000,
      id: 2,
      nextDue: "2026-11-26",
      type: "income",
    }),
    schedule({ amountCents: 9999, id: 3, nextDue: "2026-12-05" }),
  ];
  expect(pendingNetCents(schedules, "2026-11-30", asRecorded)).toBe(4000);
});
