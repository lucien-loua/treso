const formatters = new Map<string, Intl.NumberFormat>();

function formatterFor(currency: string, compact: boolean) {
	const key = `${currency}:${compact}`;
	let formatter = formatters.get(key);
	if (!formatter) {
		formatter = new Intl.NumberFormat("fr-FR", {
			style: "currency",
			currency,
			...(compact ? { maximumFractionDigits: 0 } : null),
		});
		formatters.set(key, formatter);
	}
	return formatter;
}

type FormatOptions = {
	/** Prefix `+` for positive values (a `−` is always shown for negatives). */
	showPlus?: boolean;
	/** Drop the decimals, for headline figures. */
	compact?: boolean;
};

/** Formats hundredths of a currency unit, e.g. `123456` → `1 234,56 €`. */
export function formatMoney(cents: number, currency: string, options: FormatOptions = {}) {
	const formatted = formatterFor(currency, options.compact ?? false).format(Math.abs(cents) / 100);
	if (cents < 0) return `−${formatted}`;
	if (cents > 0 && options.showPlus) return `+${formatted}`;
	return formatted;
}

// Hermes has no `Intl.NumberFormat#formatToParts`, so symbols are listed by hand
// (same strings `fr-FR` formatting prints).
const symbols: Record<string, string> = {
	XOF: "F CFA",
	GNF: "GNF",
	USD: "$US",
};

export function currencySymbol(currency: string) {
	return symbols[currency] ?? currency;
}

/** Digits after the decimal separator: 0 for franc CFA and franc guinéen, 2 for the dollar. */
export function currencyDecimals(currency: string) {
	return formatterFor(currency, false).resolvedOptions().maximumFractionDigits ?? 2;
}

/**
 * Parses user input such as `12,5`, `1 200.40` or `150000` into cents.
 * Returns `null` when invalid or when it has more decimals than `decimals`.
 */
export function parseAmount(input: string, decimals = 2): number | null {
	const normalized = input.replace(/[\s  ]/g, "").replace(",", ".");
	const pattern = decimals > 0 ? new RegExp(`^\\d+(\\.\\d{0,${decimals}})?$`) : /^\d+$/;
	if (!pattern.test(normalized)) return null;
	const cents = Math.round(Number(normalized) * 100);
	return cents > 0 ? cents : null;
}

/** Inverse of `parseAmount`, for prefilling an input: `1250` → `12,5`. */
export function centsToInput(cents: number) {
	return (cents / 100).toString().replace(".", ",");
}
