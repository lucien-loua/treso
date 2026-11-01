import { expect, test } from "bun:test";

import { i18nFor } from "@/i18n/i18n";
import { plainSpaces } from "@/test/helpers";

const tag = (languageTag: string) => ({
  languageCode: languageTag.slice(0, 2),
  languageTag,
});

const fr = i18nFor([tag("fr-FR")]);
const en = i18nFor([tag("en-US")]);

test("follows the phone's region", () => {
  const ivorian = i18nFor([tag("fr-CI")]);
  expect([ivorian.language, ivorian.locale]).toEqual(["fr", "fr-CI"]);
});

test("takes the phone's first language it speaks", () => {
  const spanishFirst = i18nFor([tag("es-ES"), tag("en-GB")]);
  expect([spanishFirst.language, spanishFirst.locale]).toEqual(["en", "en-GB"]);
});

test("falls back to English", () => {
  const spanish = i18nFor([tag("es-ES")]);
  expect([spanish.language, spanish.locale]).toEqual(["en", "en"]);
});

test("makes one object per locale", () => {
  expect(i18nFor([tag("fr-CI")])).toBe(i18nFor([tag("fr-CI")]));
});

test("writes percentages per locale", () => {
  expect(plainSpaces(fr.percent(0.42))).toBe("42 %");
  expect(en.percent(0.42)).toBe("42%");
});

test("writes days of the month per language", () => {
  const days = [1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 31];
  expect(days.map(en.t.dayOfMonth).join(" ")).toBe(
    "1st 2nd 3rd 4th 11th 12th 13th 21st 22nd 23rd 31st"
  );
  expect([1, 2].map(fr.t.dayOfMonth).join(" ")).toBe("1er 2");
});

test("counts what erasing deletes, with the right plurals", () => {
  expect(en.t.settings.eraseMessage(1, 2)).toBe(
    "1 transaction and 2 recurring items will be permanently deleted from this device."
  );
  expect(fr.t.settings.eraseMessage(1, 0)).toBe(
    "1 opération et 0 échéance seront supprimées définitivement de cet appareil."
  );
});
