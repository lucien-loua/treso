import { expect, test } from "bun:test";

import { transactionsCsv } from "@/data/transfer/csv";
import type { Transaction } from "@/data/types";
import { i18nFor } from "@/i18n/i18n";

const BYTE_ORDER_MARK = "﻿";

const entry = (changes: Partial<Transaction>): Transaction => ({
  amountCents: 1000,
  categoryId: "groceries",
  color: null,
  createdAt: 1_793_000_000_000,
  currency: "USD",
  date: "2026-11-01",
  icon: null,
  id: 1,
  note: "",
  scheduleId: null,
  settlesDue: null,
  type: "expense",
  ...changes,
});

const transactions = [
  entry({ note: "Courses; marché" }),
  entry({
    amountCents: 7_500_000,
    categoryId: "housing",
    currency: "XOF",
    date: "2026-11-03",
    note: "=SUM(A1)",
  }),
  entry({
    amountCents: 147_000_000,
    categoryId: "salary",
    currency: "XOF",
    date: "2026-10-26",
    type: "income",
  }),
];

const linesOf = (csv: string) =>
  csv.slice(BYTE_ORDER_MARK.length).split("\r\n");

test("writes French for French spreadsheets", () => {
  const { currencies, t } = i18nFor([
    { languageCode: "fr", languageTag: "fr-FR" },
  ]);
  const csv = transactionsCsv(transactions, { currencies, t });
  expect(csv.startsWith(BYTE_ORDER_MARK)).toBe(true);
  expect(linesOf(csv)).toEqual([
    "Date;Type;Nom;Catégorie;Montant;Devise",
    '2026-11-01;Dépense;"Courses; marché";Courses;-10,00;USD',
    "2026-11-03;Dépense;'=SUM(A1);Logement;-75000;XOF",
    "2026-10-26;Revenu;;Salaire;1470000;XOF",
    "",
  ]);
});

test("writes English for English spreadsheets", () => {
  const { currencies, t } = i18nFor([
    { languageCode: "en", languageTag: "en-US" },
  ]);
  expect(linesOf(transactionsCsv(transactions, { currencies, t }))).toEqual([
    "Date,Type,Name,Category,Amount,Currency",
    '2026-11-01,Expense,"Courses; marché",Groceries,-10.00,USD',
    "2026-11-03,Expense,'=SUM(A1),Housing,-75000,XOF",
    "2026-10-26,Income,,Salary,1470000,XOF",
    "",
  ]);
});
