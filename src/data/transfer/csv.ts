import { entryCategory } from "@/data/entries";
import type { Transaction } from "@/data/types";
import type { Messages } from "@/i18n/messages/fr";
import type { CurrencyRegistry } from "@/lib/currency";

/** Byte order mark: without it, Excel reads UTF-8 accents as gibberish. */
const BOM = "﻿";
const LINE_END = "\r\n";
const NEEDS_QUOTES = /[",;\r\n]/u;
const QUOTE = /"/gu;
/** A cell starting like a formula would run in Excel or Sheets: it is written as text instead. */
const FORMULA_START = /^[=+\-@\t\r]/u;

const cell = (value: string) => {
  const text = FORMULA_START.test(value) ? `'${value}` : value;
  return NEEDS_QUOTES.test(text) ? `"${text.replaceAll(QUOTE, '""')}"` : text;
};

/**
 * Transactions as a spreadsheet, newest first: date, type, name, category, signed amount and
 * the currency it was entered in. Where the locale writes "1,5", columns are separated by ";"
 * as Excel expects there, else by ",".
 */
export const transactionsCsv = (
  transactions: Transaction[],
  { t, currencies }: { t: Messages; currencies: CurrencyRegistry }
) => {
  const separator = currencies.default.decimalSeparator === "," ? ";" : ",";
  const { columns } = t.transfer;
  const header = [
    columns.date,
    columns.type,
    columns.name,
    columns.category,
    columns.amount,
    columns.currency,
  ];
  const rows = transactions.map((transaction) => {
    const currency =
      currencies.find(transaction.currency) ?? currencies.default;
    const signed =
      transaction.type === "income"
        ? transaction.amountCents
        : -transaction.amountCents;
    return [
      transaction.date,
      t.form[transaction.type],
      cell(transaction.note),
      cell(t.categories[entryCategory(transaction).id]),
      currency.figure(signed),
      transaction.currency,
    ];
  });
  return (
    BOM +
    [header.map(cell), ...rows]
      .map((row) => row.join(separator))
      .join(LINE_END) +
    LINE_END
  );
};
