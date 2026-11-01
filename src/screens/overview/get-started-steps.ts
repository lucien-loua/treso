import type { Href } from "expo-router";

import type { Schedule, Transaction } from "@/data/types";

interface Step {
  key: string;
  categoryId: string;
  title: string;
  hint: string;
  done: boolean;
  href: Href;
}

export const getStartedSteps = (
  schedules: Schedule[],
  transactions: Transaction[]
): Step[] => {
  const hasSchedule = (categoryId: string) =>
    schedules.some((s) => s.categoryId === categoryId);
  return [
    {
      categoryId: "salary",
      done: hasSchedule("salary"),
      hint: "Vers le 26 du mois, par exemple. Treso vous le rappelle.",
      href: {
        params: {
          categoryId: "salary",
          day: "26",
          note: "Salaire",
          type: "income",
        },
        pathname: "/schedule/new",
      },
      key: "salary",
      title: "Votre salaire",
    },
    {
      categoryId: "housing",
      done: hasSchedule("housing"),
      hint: "À payer avant le 5, en avance ou le jour même.",
      href: {
        params: {
          categoryId: "housing",
          day: "5",
          note: "Loyer",
          type: "expense",
        },
        pathname: "/schedule/new",
      },
      key: "rent",
      title: "Votre loyer",
    },
    {
      categoryId: "bills",
      done: hasSchedule("bills"),
      hint: "Eau, électricité, wifi… une échéance par facture.",
      href: {
        params: {
          categoryId: "bills",
          day: "3",
          note: "Électricité",
          type: "expense",
        },
        pathname: "/schedule/new",
      },
      key: "bills",
      title: "Vos factures",
    },
    {
      categoryId: "transport",
      done: transactions.some(
        (t) => t.type === "expense" && t.scheduleId === null
      ),
      hint: "Transport, repas… notée en quelques secondes.",
      href: {
        params: { categoryId: "transport" },
        pathname: "/transaction/new",
      },
      key: "daily",
      title: "Une dépense du jour",
    },
  ];
};

export const isGetStartedComplete = (
  schedules: Schedule[],
  transactions: Transaction[]
) => getStartedSteps(schedules, transactions).every((step) => step.done);
