import { expect, test } from "bun:test";

import type { Profile } from "@/data/profile";
import type { Schedule } from "@/data/types";
import { fr } from "@/i18n/messages/fr";
import {
  getStartedSteps,
  isGetStartedComplete,
} from "@/screens/overview/get-started-steps";

const NOTHING = { schedules: [], transactions: [] };

const schedule = (changes: Partial<Schedule>): Schedule => ({
  amountCents: 1,
  categoryId: "bills",
  color: null,
  currency: "XOF",
  dayOfMonth: 3,
  icon: null,
  id: 1,
  nextDue: "2026-12-03",
  note: "",
  type: "expense",
  ...changes,
});

const profile: Profile = {
  daily: ["fuel"],
  fixed: ["rent", "electricity", "water"],
  income: ["salary", "business"],
};
const steps = getStartedSteps(profile, NOTHING, fr);
const stepNamed = (key: string) => steps.find((step) => step.key === key);

test("follows the profile, with nothing done yet", () => {
  expect(steps.map((step) => step.key)).toEqual([
    "salary",
    "business",
    "rent",
    "electricity",
    "water",
    "daily",
  ]);
  expect(steps.some((step) => step.done)).toBe(false);
});

test("suggests the usual day of a monthly expense", () => {
  expect(stepNamed("rent")?.hint).toBe(
    "Avant le 5 du mois, par exemple. Treso vous la rappelle."
  );
});

test("opens each step's form prefilled", () => {
  expect(stepNamed("salary")?.href).toEqual({
    params: {
      categoryId: "salary",
      day: "26",
      note: "Salaire",
      type: "income",
    },
    pathname: "/schedule/new",
  });
  expect(stepNamed("business")?.href).toEqual({
    params: { categoryId: "freelance", note: "", type: "income" },
    pathname: "/transaction/new",
  });
  expect(stepNamed("daily")?.href).toEqual({
    params: { categoryId: "transport", icon: "fuel", note: "Carburant" },
    pathname: "/transaction/new",
  });
});

test("ticks a step by category, or by icon when bills share one", () => {
  const done = getStartedSteps(
    profile,
    {
      schedules: [
        schedule({ categoryId: "housing", id: 2, note: "Appart" }),
        schedule({ icon: "bolt", id: 3, note: "Facture CIE" }),
      ],
      transactions: [],
    },
    fr
  ).filter((step) => step.done);
  expect(done.map((step) => step.key)).toEqual(["rent", "electricity"]);
});

test("asks nothing about what doesn't apply", () => {
  const onlyWater: Profile = { daily: [], fixed: ["water"], income: [] };
  expect(
    getStartedSteps(onlyWater, NOTHING, fr).map((step) => step.key)
  ).toEqual(["water"]);
});

test("has nothing to do for an empty profile", () => {
  expect(
    isGetStartedComplete({ daily: [], fixed: [], income: [] }, NOTHING, fr)
  ).toBe(true);
});
