import type { SQLiteDatabase } from "expo-sqlite";

import { advanceDue, dateInMonth, previousDue, shiftMonth, type MonthKey } from "@/utils/dates";

import type { Schedule, ScheduleInput, Transaction, TransactionInput } from "./types";

export const DATABASE_NAME = "treso.db";
const DATABASE_VERSION = 6;

type TransactionRow = {
	id: number;
	type: Transaction["type"];
	amount_cents: number;
	category_id: string;
	note: string;
	date: string;
	created_at: number;
	schedule_id: number | null;
	settles_due: string | null;
	icon: string | null;
	color: string | null;
};

type ScheduleRow = {
	id: number;
	type: Schedule["type"];
	amount_cents: number;
	category_id: string;
	note: string;
	icon: string | null;
	color: string | null;
	day_of_month: number;
	next_due: string;
};

/** Runs on first open (via `SQLiteProvider.onInit`) and brings the schema up to date. */
export async function migrate(db: SQLiteDatabase) {
	const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
	let version = row?.user_version ?? 0;
	if (version >= DATABASE_VERSION) return;

	if (version === 0) {
		await db.execAsync(`
			PRAGMA journal_mode = 'wal';
			CREATE TABLE IF NOT EXISTS transactions (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
				amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
				category_id TEXT NOT NULL,
				note TEXT NOT NULL DEFAULT '',
				date TEXT NOT NULL,
				created_at INTEGER NOT NULL
			);
			CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date DESC);
		`);
		version = 1;
	}

	if (version === 1) {
		await db.execAsync(`
			CREATE TABLE IF NOT EXISTS recurring_rules (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
				amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
				category_id TEXT NOT NULL,
				note TEXT NOT NULL DEFAULT '',
				day_of_month INTEGER NOT NULL CHECK (day_of_month BETWEEN 1 AND 31),
				last_month TEXT NOT NULL,
				created_at INTEGER NOT NULL
			);
			ALTER TABLE transactions ADD COLUMN recurring_id INTEGER;
		`);
		version = 2;
	}

	if (version === 2) {
		await db.execAsync(`
			ALTER TABLE transactions ADD COLUMN icon TEXT;
			ALTER TABLE recurring_rules ADD COLUMN icon TEXT;
		`);
		version = 3;
	}

	// v4: auto-created monthly rules become schedules the user confirms (pay / receive) by hand.
	if (version === 3) {
		await db.execAsync(`
			CREATE TABLE schedules (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
				amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
				category_id TEXT NOT NULL,
				note TEXT NOT NULL DEFAULT '',
				icon TEXT,
				day_of_month INTEGER NOT NULL CHECK (day_of_month BETWEEN 1 AND 31),
				next_due TEXT NOT NULL,
				created_at INTEGER NOT NULL
			);
			ALTER TABLE transactions RENAME COLUMN recurring_id TO schedule_id;
		`);
		const rules = await db.getAllAsync<{
			id: number;
			type: string;
			amount_cents: number;
			category_id: string;
			note: string;
			icon: string | null;
			day_of_month: number;
			last_month: string;
			created_at: number;
		}>("SELECT * FROM recurring_rules");
		for (const rule of rules) {
			await db.runAsync(
				"INSERT INTO schedules (id, type, amount_cents, category_id, note, icon, day_of_month, next_due, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
				rule.id,
				rule.type,
				rule.amount_cents,
				rule.category_id,
				rule.note,
				rule.icon,
				rule.day_of_month,
				dateInMonth(shiftMonth(rule.last_month as MonthKey, 1), rule.day_of_month),
				rule.created_at,
			);
		}
		await db.execAsync("DROP TABLE recurring_rules");
		version = 4;
	}

	// v5: each payment remembers the due date it settled, so deleting it can put that due date back.
	if (version === 4) {
		await db.execAsync("ALTER TABLE transactions ADD COLUMN settles_due TEXT");
		// Existing payments each moved the schedule one month ahead: walk back from its next due date.
		const schedules = await db.getAllAsync<{ id: number; day_of_month: number; next_due: string }>(
			"SELECT id, day_of_month, next_due FROM schedules",
		);
		for (const schedule of schedules) {
			const payments = await db.getAllAsync<{ id: number }>(
				"SELECT id FROM transactions WHERE schedule_id = ? ORDER BY date DESC, created_at DESC",
				schedule.id,
			);
			let due = schedule.next_due;
			for (const payment of payments) {
				due = previousDue(due, schedule.day_of_month);
				await db.runAsync("UPDATE transactions SET settles_due = ? WHERE id = ?", due, payment.id);
			}
		}
		version = 5;
	}

	if (version === 5) {
		await db.execAsync(`
			ALTER TABLE transactions ADD COLUMN color TEXT;
			ALTER TABLE schedules ADD COLUMN color TEXT;
		`);
		version = 6;
	}

	await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

function fromRow(row: TransactionRow): Transaction {
	return {
		id: row.id,
		type: row.type,
		amountCents: row.amount_cents,
		categoryId: row.category_id,
		note: row.note,
		date: row.date,
		createdAt: row.created_at,
		scheduleId: row.schedule_id,
		settlesDue: row.settles_due,
		icon: row.icon,
		color: row.color,
	};
}

function scheduleFromRow(row: ScheduleRow): Schedule {
	return {
		id: row.id,
		type: row.type,
		amountCents: row.amount_cents,
		categoryId: row.category_id,
		note: row.note,
		icon: row.icon,
		color: row.color,
		dayOfMonth: row.day_of_month,
		nextDue: row.next_due,
	};
}

export async function selectTransactions(db: SQLiteDatabase): Promise<Transaction[]> {
	const rows = await db.getAllAsync<TransactionRow>(
		"SELECT * FROM transactions ORDER BY date DESC, created_at DESC",
	);
	return rows.map(fromRow);
}

export async function selectSchedules(db: SQLiteDatabase): Promise<Schedule[]> {
	const rows = await db.getAllAsync<ScheduleRow>("SELECT * FROM schedules ORDER BY next_due, type DESC, id");
	return rows.map(scheduleFromRow);
}

async function insertOne(
	db: SQLiteDatabase,
	input: TransactionInput,
	settlement: { scheduleId: number; due: string } | null = null,
) {
	await db.runAsync(
		"INSERT INTO transactions (type, amount_cents, category_id, note, date, created_at, schedule_id, settles_due, icon, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		input.type,
		input.amountCents,
		input.categoryId,
		input.note,
		input.date,
		Date.now(),
		settlement?.scheduleId ?? null,
		settlement?.due ?? null,
		input.icon,
		input.color,
	);
}

export async function insertTransactions(db: SQLiteDatabase, inputs: TransactionInput[]) {
	await db.withTransactionAsync(async () => {
		for (const input of inputs) await insertOne(db, input);
	});
}

export async function updateTransaction(db: SQLiteDatabase, id: number, input: TransactionInput) {
	await db.runAsync(
		"UPDATE transactions SET type = ?, amount_cents = ?, category_id = ?, note = ?, date = ?, icon = ?, color = ? WHERE id = ?",
		input.type,
		input.amountCents,
		input.categoryId,
		input.note,
		input.date,
		input.icon,
		input.color,
		id,
	);
}

/** Deletes a transaction. If it was the latest payment of a schedule, that due date becomes pending again. */
export async function deleteTransaction(db: SQLiteDatabase, id: number) {
	await db.withTransactionAsync(async () => {
		const payment = await db.getFirstAsync<{ schedule_id: number | null; settles_due: string | null }>(
			"SELECT schedule_id, settles_due FROM transactions WHERE id = ?",
			id,
		);
		await db.runAsync("DELETE FROM transactions WHERE id = ?", id);
		if (payment?.schedule_id == null || payment.settles_due == null) return;

		const schedule = await db.getFirstAsync<{ day_of_month: number; next_due: string }>(
			"SELECT day_of_month, next_due FROM schedules WHERE id = ?",
			payment.schedule_id,
		);
		if (schedule && advanceDue(payment.settles_due, schedule.day_of_month) === schedule.next_due) {
			await db.runAsync(
				"UPDATE schedules SET next_due = ? WHERE id = ?",
				payment.settles_due,
				payment.schedule_id,
			);
		}
	});
}

export async function insertSchedule(db: SQLiteDatabase, input: ScheduleInput) {
	await db.runAsync(
		"INSERT INTO schedules (type, amount_cents, category_id, note, icon, color, day_of_month, next_due, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		input.type,
		input.amountCents,
		input.categoryId,
		input.note,
		input.icon,
		input.color,
		input.dayOfMonth,
		input.nextDue,
		Date.now(),
	);
}

export async function updateSchedule(db: SQLiteDatabase, schedule: Schedule, input: ScheduleInput) {
	await db.runAsync(
		"UPDATE schedules SET type = ?, amount_cents = ?, category_id = ?, note = ?, icon = ?, color = ?, day_of_month = ?, next_due = ? WHERE id = ?",
		input.type,
		input.amountCents,
		input.categoryId,
		input.note,
		input.icon,
		input.color,
		input.dayOfMonth,
		input.nextDue,
		schedule.id,
	);
}

/** Removes the schedule; transactions it already produced stay. */
export async function deleteSchedule(db: SQLiteDatabase, id: number) {
	await db.withTransactionAsync(async () => {
		await db.runAsync("UPDATE transactions SET schedule_id = NULL WHERE schedule_id = ?", id);
		await db.runAsync("DELETE FROM schedules WHERE id = ?", id);
	});
}

/** Records the payment (or receipt) and moves the schedule to next month's due date. */
export async function settleSchedule(db: SQLiteDatabase, schedule: Schedule, input: TransactionInput) {
	await db.withTransactionAsync(async () => {
		await insertOne(db, input, { scheduleId: schedule.id, due: schedule.nextDue });
		await db.runAsync(
			"UPDATE schedules SET next_due = ? WHERE id = ?",
			advanceDue(schedule.nextDue, schedule.dayOfMonth),
			schedule.id,
		);
	});
}

/** Skips this month without recording anything. */
export async function skipSchedule(db: SQLiteDatabase, schedule: Schedule) {
	await db.runAsync(
		"UPDATE schedules SET next_due = ? WHERE id = ?",
		advanceDue(schedule.nextDue, schedule.dayOfMonth),
		schedule.id,
	);
}

export async function deleteAllData(db: SQLiteDatabase) {
	await db.withTransactionAsync(async () => {
		await db.runAsync("DELETE FROM transactions");
		await db.runAsync("DELETE FROM schedules");
	});
}
