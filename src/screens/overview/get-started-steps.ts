import type { Href } from "expo-router";

import type { CategoryId } from "@/data/catalog/categories";
import type { Schedule, Transaction } from "@/data/types";
import type { Messages } from "@/i18n/messages/fr";

interface Step {
  key: string;
  categoryId: CategoryId;
  title: string;
  hint: string;
  done: boolean;
  href: Href;
}

/** The first things to set up, named in the app's language; the forms open prefilled. */
export const getStartedSteps = (
  schedules: Schedule[],
  transactions: Transaction[],
  t: Messages
): Step[] => {
  const texts = t.overview.getStarted;
  const hasSchedule = (categoryId: CategoryId) =>
    schedules.some((s) => s.categoryId === categoryId);
  return [
    {
      categoryId: "salary",
      done: hasSchedule("salary"),
      hint: texts.salary.hint,
      href: {
        params: {
          categoryId: "salary",
          day: "26",
          note: texts.salary.defaultName,
          type: "income",
        },
        pathname: "/schedule/new",
      },
      key: "salary",
      title: texts.salary.title,
    },
    {
      categoryId: "housing",
      done: hasSchedule("housing"),
      hint: texts.rent.hint,
      href: {
        params: {
          categoryId: "housing",
          day: "5",
          note: texts.rent.defaultName,
          type: "expense",
        },
        pathname: "/schedule/new",
      },
      key: "rent",
      title: texts.rent.title,
    },
    {
      categoryId: "bills",
      done: hasSchedule("bills"),
      hint: texts.bills.hint,
      href: {
        params: {
          categoryId: "bills",
          day: "3",
          note: texts.bills.defaultName,
          type: "expense",
        },
        pathname: "/schedule/new",
      },
      key: "bills",
      title: texts.bills.title,
    },
    {
      categoryId: "transport",
      done: transactions.some(
        (transaction) =>
          transaction.type === "expense" && transaction.scheduleId === null
      ),
      hint: texts.daily.hint,
      href: {
        params: { categoryId: "transport" },
        pathname: "/transaction/new",
      },
      key: "daily",
      title: texts.daily.title,
    },
  ];
};

/** Done once there's a salary, a rent, a bill and a day-to-day expense; texts don't matter here. */
export const isGetStartedComplete = (
  schedules: Schedule[],
  transactions: Transaction[],
  t: Messages
) => getStartedSteps(schedules, transactions, t).every((step) => step.done);
