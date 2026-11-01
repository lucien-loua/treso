import { expect, test } from "bun:test";

import { createBackup, readBackup } from "@/data/transfer/backup";
import type { Backup } from "@/data/transfer/backup";
import type { Schedule, Transaction } from "@/data/types";

const schedule: Schedule = {
  amountCents: 7_500_000,
  categoryId: "housing",
  color: null,
  currency: "XOF",
  dayOfMonth: 5,
  icon: null,
  id: 3,
  nextDue: "2026-12-05",
  note: "Loyer",
  type: "expense",
};
const purchase: Transaction = {
  amountCents: 1000,
  categoryId: "groceries",
  color: "red",
  createdAt: 1_793_000_000_000,
  currency: "USD",
  date: "2026-11-01",
  icon: "cart",
  id: 10,
  note: "Courses",
  scheduleId: null,
  settlesDue: null,
  type: "expense",
};
const payment: Transaction = {
  amountCents: 7_500_000,
  categoryId: "housing",
  color: null,
  createdAt: 1_792_000_000_000,
  currency: "XOF",
  date: "2026-11-03",
  icon: null,
  id: 9,
  note: "Loyer",
  scheduleId: 3,
  settlesDue: "2026-11-05",
  type: "expense",
};
const settings: Backup["settings"] = {
  budget: { amountCents: 50_000_000, currency: "XOF" },
  currency: "XOF",
  profile: {
    daily: ["transport"],
    fixed: ["rent", "water"],
    income: ["salary"],
  },
  rates: {
    manual: true,
    own: { base: "USD", date: "2026-11-01", rates: { GNF: 8800, XOF: 600 } },
  },
};
const backup = createBackup(
  { schedules: [schedule], transactions: [purchase, payment] },
  settings,
  new Date("2026-11-01T16:00:00Z")
);

/** What importing `changes` on top of the backup gives. */
const read = (changes: object) =>
  readBackup(JSON.stringify({ ...backup, ...changes }));

const importedSettings = (changes: object) => {
  const result = read({ settings: { ...settings, ...changes } });
  return "backup" in result ? result.backup.settings : result;
};

test("reads back what it exported", () => {
  expect(readBackup(JSON.stringify(backup, null, 2))).toEqual({ backup });
});

test("reads an empty backup", () => {
  expect(read({ schedules: [], transactions: [] })).toHaveProperty("backup");
});

test.each([
  ["a file that isn't JSON", "hello"],
  ["JSON that isn't a backup", JSON.stringify({ a: 1 })],
])("refuses %s", (_name, text) => {
  expect(readBackup(text)).toEqual({ problem: "invalid" });
});

test("says when a backup comes from a newer version", () => {
  expect(read({ version: 2 })).toEqual({ problem: "newer" });
});

test.each([
  ["a negative amount", { amountCents: -5 }],
  ["a currency Treso doesn't offer", { currency: "EUR" }],
  ["a date in another format", { date: "01/11/2026" }],
])("refuses a whole file over %s", (_name, change) => {
  expect(read({ transactions: [{ ...purchase, ...change }] })).toEqual({
    problem: "invalid",
  });
});

test("refuses a schedule on day 32", () => {
  expect(read({ schedules: [{ ...schedule, dayOfMonth: 32 }] })).toEqual({
    problem: "invalid",
  });
});

test("unlinks a payment whose schedule isn't in the file", () => {
  const result = read({ schedules: [] });
  expect(
    "backup" in result ? result.backup.transactions[1]?.scheduleId : result
  ).toBeNull();
});

test("uses default settings when they are unreadable", () => {
  const result = read({ settings: "?" });
  expect("backup" in result ? result.backup.settings : result).toEqual({
    budget: null,
    currency: "XOF",
    profile: null,
    rates: { manual: false, own: null },
  });
});

test("drops a profile with a part of the wrong type", () => {
  expect(
    importedSettings({
      profile: { daily: ["transport"], fixed: "rent", income: [] },
    })
  ).toHaveProperty("profile", null);
});

test("keeps a profile's known choices, once each", () => {
  expect(
    importedSettings({
      profile: {
        daily: ["jet", "fuel"],
        fixed: [],
        income: ["salary", "salary"],
      },
    })
  ).toHaveProperty("profile", {
    daily: ["fuel"],
    fixed: [],
    income: ["salary"],
  });
});
