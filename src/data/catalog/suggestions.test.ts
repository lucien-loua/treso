import { expect, test } from "bun:test";

import { suggestCategory } from "@/data/catalog/category-suggestions";
import { suggestIcon } from "@/data/catalog/icon-suggestions";
import { en } from "@/i18n/messages/en";
import { fr } from "@/i18n/messages/fr";

test.each([
  ["Loyer", fr, "house"],
  ["Rent", en, "house"],
  ["Thé du matin", fr, "coffee"],
  ["Dinner at the mall", en, "food"],
  ["Taxi", en, "car"],
  ["Yango", fr, "car"],
  ["Pharmacies", fr, "pills"],
  ["Car pour Bouaké", fr, "bus"],
  ["Car wash", en, "car"],
  ["Petit-déjeuner", fr, "food"],
] as const)("suggests an icon for %s", (name, t, icon) => {
  expect(suggestIcon(name, t.iconKeywords)).toBe(icon);
});

test.each([
  ["a word that only starts like a keyword", "Carte"],
  ["an empty name", "  "],
])("suggests no icon for %s", (_case, name) => {
  expect(suggestIcon(name, fr.iconKeywords)).toBeNull();
});

test.each([
  ["Taxi", "expense", fr, "transport"],
  ["Loyer", "expense", fr, "housing"],
  ["Facture électricité", "expense", fr, "bills"],
  ["Déjeuner", "expense", fr, "restaurants"],
  ["Marché", "expense", fr, "groceries"],
  ["Pharmacie", "expense", fr, "health"],
  ["Salaire", "income", fr, "salary"],
  ["Cadeau maman", "income", fr, "gifts"],
  ["Rent", "expense", en, "housing"],
  ["Uber", "expense", en, "transport"],
  ["Netflix", "expense", en, "leisure"],
] as const)("suggests a category for %s (%s)", (name, type, t, category) => {
  expect(suggestCategory(name, type, t.iconKeywords)).toBe(category);
});

test.each([
  ["income as an expense", "Salaire", "expense"],
  ["an unknown word", "Assurance", "expense"],
  ["an empty name", "", "expense"],
] as const)("suggests no category for %s", (_case, name, type) => {
  expect(suggestCategory(name, type, fr.iconKeywords)).toBeNull();
});
