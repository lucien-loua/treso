import type { Href } from "expo-router";

import type { CategoryId } from "@/data/catalog/categories";
import { suggestIcon } from "@/data/catalog/icon-suggestions";
import type { IconId } from "@/data/catalog/icons";
import {
  DAILY_PRESETS,
  FIXED_PRESETS,
  INCOME_PRESETS,
} from "@/data/catalog/profile-presets";
import type { Preset } from "@/data/catalog/profile-presets";
import type { Profile } from "@/data/profile";
import type { Schedule, Transaction } from "@/data/types";
import type { Messages } from "@/i18n/messages/fr";

interface Step {
  key: string;
  categoryId: CategoryId;
  icon: IconId | null;
  title: string;
  hint: string;
  done: boolean;
  href: Href;
}

const ALL_PRESETS: Preset[] = [
  ...Object.values(INCOME_PRESETS),
  ...Object.values(FIXED_PRESETS),
];

/** Electricity, water and internet are all bills: only the icon tells them apart. */
const sharesCategory = (preset: Preset) =>
  ALL_PRESETS.filter(
    (other) =>
      other.categoryId === preset.categoryId && other.type === preset.type
  ).length > 1;

/** Whether an entry looks like `preset`: same icon (chosen or read from its name), else same category when that's enough. */
const matches = (
  entry: Pick<Schedule, "type" | "categoryId" | "icon" | "note">,
  preset: Preset,
  t: Messages
) =>
  entry.type === preset.type &&
  ((entry.icon ?? suggestIcon(entry.note, t.iconKeywords)) === preset.icon ||
    (!sharesCategory(preset) && entry.categoryId === preset.categoryId));

const presetStep = (
  key: string,
  preset: Preset,
  { label, name }: { label: string; name: string },
  data: { schedules: Schedule[]; transactions: Transaction[] },
  t: Messages
): Step => {
  const base = {
    categoryId: preset.categoryId,
    icon: preset.icon,
    key,
    title: label,
  };
  if (preset.kind === "schedule") {
    const day = t.dayOfMonth(preset.day);
    return {
      ...base,
      done: data.schedules.some((s) => matches(s, preset, t)),
      hint:
        preset.type === "income"
          ? t.profile.incomeHint.schedule(day)
          : t.profile.fixedHint(day),
      href: {
        params: {
          categoryId: preset.categoryId,
          day: String(preset.day),
          note: name,
          type: preset.type,
        },
        pathname: "/schedule/new",
      },
    };
  }
  return {
    ...base,
    done: data.transactions.some(
      (transaction) =>
        transaction.scheduleId === null && matches(transaction, preset, t)
    ),
    hint: t.profile.incomeHint.transaction,
    href: {
      params: { categoryId: preset.categoryId, note: name, type: preset.type },
      pathname: "/transaction/new",
    },
  };
};

/**
 * The first things to set up, from what the user said about their life: one step per income
 * source and monthly expense they picked, then a first everyday expense. Each opens its form
 * prefilled and ticks itself once done.
 */
export const getStartedSteps = (
  profile: Profile,
  data: { schedules: Schedule[]; transactions: Transaction[] },
  t: Messages
): Step[] => {
  const steps = [
    ...profile.income.map((id) =>
      presetStep(id, INCOME_PRESETS[id], t.profile.income[id], data, t)
    ),
    ...profile.fixed.map((id) =>
      presetStep(id, FIXED_PRESETS[id], t.profile.fixed[id], data, t)
    ),
  ];
  const [daily] = profile.daily;
  if (daily) {
    const { categoryId, icon } = DAILY_PRESETS[daily];
    steps.push({
      categoryId,
      done: data.transactions.some(
        (transaction) =>
          transaction.type === "expense" && transaction.scheduleId === null
      ),
      hint: t.profile.dailyStep.hint,
      href: {
        params: {
          categoryId,
          icon: icon ?? "",
          note: t.profile.daily[daily].name,
        },
        pathname: "/transaction/new",
      },
      icon,
      key: "daily",
      title: t.profile.dailyStep.title,
    });
  }
  return steps;
};

/** Nothing left to set up (or nothing to set up at all). */
export const isGetStartedComplete = (
  profile: Profile,
  data: { schedules: Schedule[]; transactions: Transaction[] },
  t: Messages
) => getStartedSteps(profile, data, t).every((step) => step.done);
