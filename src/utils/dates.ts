const pad = (value: number) => String(value).padStart(2, "0");

/** `Date` → local `YYYY-MM-DD` (never UTC, so late-evening entries keep their day). */
export function toISODate(date: Date) {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseISODate(value: string) {
	const [year, month, day] = value.split("-").map(Number);
	return new Date(year, month - 1, day);
}

export type MonthKey = `${number}-${string}`;

export function monthKeyOf(date: Date): MonthKey {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function shiftMonth(key: MonthKey, delta: number): MonthKey {
	const [year, month] = key.split("-").map(Number);
	return monthKeyOf(new Date(year, month - 1 + delta, 1));
}

function capitalize(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatMonth(key: MonthKey) {
	const [year, month] = key.split("-").map(Number);
	return capitalize(
		new Date(year, month - 1, 1).toLocaleDateString("fr-FR", {
			month: "long",
			year: "numeric",
		}),
	);
}

/** `YYYY-MM-DD` for `day` in `key`, clamped to the month's last day. */
export function dateInMonth(key: MonthKey, day: number) {
	const [year, month] = key.split("-").map(Number);
	const lastDay = new Date(year, month, 0).getDate();
	return `${key}-${pad(Math.min(day, lastDay))}`;
}

/** First date on or after `today` that falls on `day` (clamped to short months). */
export function nextDueFrom(day: number, today = new Date()) {
	const month = monthKeyOf(today);
	const candidate = dateInMonth(month, day);
	return candidate >= toISODate(today) ? candidate : dateInMonth(shiftMonth(month, 1), day);
}

/** Same `day`, one month after `due`. */
export function advanceDue(due: string, day: number) {
	return dateInMonth(shiftMonth(due.slice(0, 7) as MonthKey, 1), day);
}

/** Same `day`, one month before `due`. */
export function previousDue(due: string, day: number) {
	return dateInMonth(shiftMonth(due.slice(0, 7) as MonthKey, -1), day);
}

/** Whole calendar days from `from` to `to` (negative when `to` is earlier). */
export function daysBetween(from: string, to: string) {
	return Math.round((parseISODate(to).getTime() - parseISODate(from).getTime()) / 86_400_000);
}

export function endOfMonth(key: MonthKey) {
	return dateInMonth(key, 31);
}

export function daysLeftInMonth(key: MonthKey, today = new Date()) {
	if (key !== monthKeyOf(today)) return 0;
	const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
	return lastDay - today.getDate() + 1;
}

/** Section title for a day: « Aujourd'hui », « Hier », or « Samedi 1 novembre ». */
export function formatDayTitle(iso: string, today = new Date()) {
	const todayIso = toISODate(today);
	const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
	if (iso === todayIso) return "Aujourd’hui";
	if (iso === toISODate(yesterday)) return "Hier";
	const date = parseISODate(iso);
	return capitalize(
		date.toLocaleDateString("fr-FR", {
			weekday: "long",
			day: "numeric",
			month: "long",
			...(date.getFullYear() === today.getFullYear() ? null : { year: "numeric" }),
		}),
	);
}

export function formatShortDate(iso: string) {
	return parseISODate(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
