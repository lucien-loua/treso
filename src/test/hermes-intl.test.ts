import { expect, test } from "bun:test";

const FULL_INTL = Boolean(process.env.FULL_INTL);

test("runs with the Intl it was asked for", () => {
  expect(typeof Intl.RelativeTimeFormat === "function").toBe(FULL_INTL);
  expect(typeof Intl.NumberFormat.prototype.formatToParts === "function").toBe(
    FULL_INTL
  );
});
