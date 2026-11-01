import { expect, test } from "bun:test";

import {
  deleteAllData,
  deleteTransaction,
  insertSchedule,
  insertTransactions,
  migrate,
  replaceAllData,
  selectSchedules,
  selectTransactions,
  settleSchedule,
} from "@/data/db";
import { migrations } from "@/data/db/migrations";
import type { Schedule, Transaction, TransactionInput } from "@/data/types";
import { openTestDatabase } from "@/test/helpers";

const expense: TransactionInput = {
  amountCents: 1500,
  categoryId: "transport",
  color: null,
  currency: "XOF",
  date: "2026-11-01",
  icon: null,
  note: "Taxi",
  type: "expense",
};
const rent: Schedule = {
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
const rentPayment: Transaction = {
  amountCents: 7_500_000,
  categoryId: "housing",
  color: "red",
  createdAt: 1,
  currency: "XOF",
  date: "2026-11-03",
  icon: "house",
  id: 9,
  note: "Loyer",
  scheduleId: 3,
  settlesDue: "2026-11-05",
  type: "expense",
};

test("builds the schema, and doesn't redo it", async () => {
  const db = await openTestDatabase();
  await insertTransactions(db, [expense]);
  await migrate(db);

  const version = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  expect(version?.user_version).toBe(migrations.at(-1)?.version ?? 0);
  expect(await selectTransactions(db)).toHaveLength(1);
});

test("restoring replaces everything, ids and links included", async () => {
  const db = await openTestDatabase();
  await insertTransactions(db, [expense]);

  await replaceAllData(db, { schedules: [rent], transactions: [rentPayment] });

  expect(await selectSchedules(db)).toEqual([rent]);
  expect(await selectTransactions(db)).toEqual([rentPayment]);
});

test("a restore that fails keeps the existing data", async () => {
  const db = await openTestDatabase();
  await insertTransactions(db, [expense]);
  await insertSchedule(db, { ...rent, note: "Mon loyer" });
  const transactionsBefore = await selectTransactions(db);
  const schedulesBefore = await selectSchedules(db);

  const refusedByTheSchema = { ...rentPayment, amountCents: -5, id: 10 };
  await expect(
    replaceAllData(db, {
      schedules: [rent],
      transactions: [rentPayment, refusedByTheSchema],
    })
  ).rejects.toThrow();

  expect(await selectTransactions(db)).toEqual(transactionsBefore);
  expect(await selectSchedules(db)).toEqual(schedulesBefore);
});

test("new entries get ids after the restored ones", async () => {
  const db = await openTestDatabase();
  await replaceAllData(db, { schedules: [rent], transactions: [rentPayment] });

  await insertTransactions(db, [expense]);

  const transactions = await selectTransactions(db);
  const ids = transactions.map(({ id }) => id);
  expect(ids).toContain(rentPayment.id);
  expect(new Set(ids).size).toBe(2);
  expect(Math.max(...ids)).toBeGreaterThan(rentPayment.id);
});

test("erasing empties both tables", async () => {
  const db = await openTestDatabase();
  await insertTransactions(db, [expense]);
  await insertSchedule(db, rent);

  await deleteAllData(db);

  expect(await selectTransactions(db)).toEqual([]);
  expect(await selectSchedules(db)).toEqual([]);
});

test("paying moves a schedule on, and deleting the payment moves it back", async () => {
  const db = await openTestDatabase();
  await insertSchedule(db, { ...rent, nextDue: "2026-11-05" });
  const [schedule] = await selectSchedules(db);
  if (!schedule) {
    throw new Error("The schedule wasn't saved");
  }

  await settleSchedule(db, schedule, { ...expense, categoryId: "housing" });

  const [paid] = await selectSchedules(db);
  const [payment] = await selectTransactions(db);
  expect(paid?.nextDue).toBe("2026-12-05");
  expect(payment?.scheduleId).toBe(schedule.id);
  expect(payment?.settlesDue).toBe("2026-11-05");

  await deleteTransaction(db, payment?.id ?? 0);

  const [unpaid] = await selectSchedules(db);
  expect(unpaid?.nextDue).toBe("2026-11-05");
  expect(await selectTransactions(db)).toEqual([]);
});
