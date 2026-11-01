import type { OwnRatesBackup } from "@/data/exchange-rates";
import { readProfile } from "@/data/profile";
import type { Profile } from "@/data/profile";
import type { SettingsBackup } from "@/data/settings";
import type { Schedule, Transaction, TransactionType } from "@/data/types";
import { CURRENCY_CODES, DEFAULT_CURRENCY_CODE } from "@/lib/currency";
import type { ExchangeRates } from "@/lib/currency";

const FORMAT = "treso-backup";

/** Raised when the shape of a backup changes; older backups stay readable. */
const VERSION = 1;

/** Everything Treso keeps, in one file that can be imported on this phone or another. */
export interface Backup {
  format: typeof FORMAT;
  version: number;
  /** When it was made, ISO 8601 */
  exportedAt: string;
  settings: SettingsBackup & { rates: OwnRatesBackup; profile: Profile | null };
  schedules: Schedule[];
  transactions: Transaction[];
}

export const createBackup = (
  data: { schedules: Schedule[]; transactions: Transaction[] },
  settings: Backup["settings"],
  now = new Date()
): Backup => ({
  exportedAt: now.toISOString(),
  format: FORMAT,
  schedules: data.schedules,
  settings,
  transactions: data.transactions,
  version: VERSION,
});

/** Why a file can't be imported. */
export type BackupProblem = "invalid" | "newer";

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/u;
const MAX_NOTE_LENGTH = 200;
const LAST_DAY = 31;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isId = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;

const isAmount = isId;

const isType = (value: unknown): value is TransactionType =>
  value === "expense" || value === "income";

const isCurrency = (value: unknown): value is string =>
  typeof value === "string" && CURRENCY_CODES.includes(value);

const isDay = (value: unknown): value is string =>
  typeof value === "string" && ISO_DAY.test(value);

const isDayOfMonth = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= 1 &&
  value <= LAST_DAY;

const isOptionalText = (value: unknown): value is string | null =>
  value === null || typeof value === "string";

const isNote = (value: unknown): value is string =>
  typeof value === "string" && value.length <= MAX_NOTE_LENGTH;

const isTimestamp = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

/** What transactions and schedules share, or `null` when a field is wrong. */
const readEntry = (row: Record<string, unknown>) => {
  const { id, type, amountCents, currency, categoryId, note, icon, color } =
    row;
  if (
    !isId(id) ||
    !isType(type) ||
    !isAmount(amountCents) ||
    !isCurrency(currency) ||
    typeof categoryId !== "string" ||
    !isNote(note) ||
    !isOptionalText(icon) ||
    !isOptionalText(color)
  ) {
    return null;
  }
  return { amountCents, categoryId, color, currency, icon, id, note, type };
};

const readSchedule = (row: unknown): Schedule | null => {
  const entry = isRecord(row) ? readEntry(row) : null;
  if (!entry || !isRecord(row)) {
    return null;
  }
  const { dayOfMonth, nextDue } = row;
  if (!isDayOfMonth(dayOfMonth) || !isDay(nextDue)) {
    return null;
  }
  return { ...entry, dayOfMonth, nextDue };
};

const readTransaction = (row: unknown): Transaction | null => {
  const entry = isRecord(row) ? readEntry(row) : null;
  if (!entry || !isRecord(row)) {
    return null;
  }
  const { date, scheduleId, settlesDue, createdAt } = row;
  if (
    !isDay(date) ||
    !(scheduleId === null || isId(scheduleId)) ||
    !(settlesDue === null || isDay(settlesDue)) ||
    !isTimestamp(createdAt)
  ) {
    return null;
  }
  return { ...entry, createdAt, date, scheduleId, settlesDue };
};

/** Every row valid, or `null`: a damaged file is refused whole, never half imported. */
const readAll = <Row>(rows: unknown, read: (row: unknown) => Row | null) => {
  if (!Array.isArray(rows)) {
    return null;
  }
  const result: Row[] = [];
  for (const row of rows) {
    const valid = read(row);
    if (valid === null) {
      return null;
    }
    result.push(valid);
  }
  return result;
};

const readRates = (value: unknown): ExchangeRates | null => {
  if (!isRecord(value) || !isDay(value.date) || !isRecord(value.rates)) {
    return null;
  }
  const rates: Record<string, number> = {};
  for (const code of CURRENCY_CODES) {
    const rate = value.rates[code];
    if (typeof rate === "number" && Number.isFinite(rate) && rate > 0) {
      rates[code] = rate;
    }
  }
  return { base: "USD", date: value.date, rates };
};

/** Settings are a convenience: anything unreadable falls back to defaults rather than refusing the file. */
const readSettings = (value: unknown): Backup["settings"] => {
  const settings = isRecord(value) ? value : {};
  const budget = isRecord(settings.budget) ? settings.budget : null;
  const rates = isRecord(settings.rates) ? settings.rates : {};
  const own = readRates(rates.own);
  return {
    budget:
      budget && isAmount(budget.amountCents) && isCurrency(budget.currency)
        ? { amountCents: budget.amountCents, currency: budget.currency }
        : null,
    currency: isCurrency(settings.currency)
      ? settings.currency
      : DEFAULT_CURRENCY_CODE,
    profile: readProfile(settings.profile),
    rates: { manual: rates.manual === true && own !== null, own },
  };
};

/** Payments pointing at a schedule that isn't in the file are kept as plain transactions. */
const unlinkOrphans = (
  transactions: Transaction[],
  schedules: Schedule[]
): Transaction[] => {
  const ids = new Set(schedules.map(({ id }) => id));
  return transactions.map((transaction) =>
    transaction.scheduleId === null || ids.has(transaction.scheduleId)
      ? transaction
      : { ...transaction, scheduleId: null, settlesDue: null }
  );
};

/** Reads a backup file's text: the backup, or why it can't be imported. */
export const readBackup = (
  text: string
): { backup: Backup } | { problem: BackupProblem } => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { problem: "invalid" };
  }
  if (!isRecord(parsed) || parsed.format !== FORMAT) {
    return { problem: "invalid" };
  }
  const { version } = parsed;
  if (!isId(version)) {
    return { problem: "invalid" };
  }
  if (version > VERSION) {
    return { problem: "newer" };
  }
  const schedules = readAll(parsed.schedules, readSchedule);
  const transactions = readAll(parsed.transactions, readTransaction);
  if (
    schedules === null ||
    transactions === null ||
    typeof parsed.exportedAt !== "string" ||
    Number.isNaN(Date.parse(parsed.exportedAt))
  ) {
    return { problem: "invalid" };
  }
  return {
    backup: {
      exportedAt: parsed.exportedAt,
      format: FORMAT,
      schedules,
      settings: readSettings(parsed.settings),
      transactions: unlinkOrphans(transactions, schedules),
      version,
    },
  };
};
