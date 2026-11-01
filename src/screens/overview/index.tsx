import { useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";

import {
  ADD_BUTTON_CLEARANCE,
  AddTransactionButton,
} from "@/components/add-transaction-button";
import { LoadError } from "@/components/load-error";
import { DEFAULT_PROFILE } from "@/data/profile";
import { useProfile } from "@/data/profile-store";
import { useGetStartedHidden, useMonthlyBudget } from "@/data/settings";
import { useTransactions } from "@/data/transactions-provider";
import { useMoney } from "@/hooks/use-money";
import { useToday } from "@/hooks/use-today";
import { useI18n } from "@/i18n/context";
import { monthKeyOf } from "@/lib/datetime";
import type { MonthKey } from "@/lib/datetime";
import { spacing } from "@/theme";
import { frequentExpenses } from "@/utils/shortcuts";

import { BalanceCard } from "./balance-card";
import { BudgetCard } from "./budget-card";
import { CategoryBreakdown } from "./category-breakdown";
import { everydayShortcuts } from "./everyday-shortcuts";
import { GetStarted } from "./get-started";
import { isGetStartedComplete } from "./get-started-steps";
import { monthOverview } from "./month-overview";
import { MonthSwitcher } from "./month-switcher";
import { QuickAdd } from "./quick-add";
import { Upcoming } from "./upcoming";

/** The month at a glance. Past months show the figures only; the current one adds what's next. */
const MonthDashboard = () => {
  const { transactions, schedules } = useTransactions();
  const { t } = useI18n();
  const money = useMoney();
  const [budget] = useMonthlyBudget();
  const [savedProfile] = useProfile();
  const profile = savedProfile ?? DEFAULT_PROFILE;
  const [getStartedHidden, setGetStartedHidden] = useGetStartedHidden();
  const today = useToday();
  const currentMonth = monthKeyOf(today);
  const [month, setMonth] = useState<MonthKey>(currentMonth);
  const isCurrentMonth = month === currentMonth;
  const { summary, forecastCents, todaySpentCents } = monthOverview({
    amountOf: money.amountOf,
    isCurrentMonth,
    month,
    schedules,
    today,
    transactions,
  });

  return (
    <>
      <MonthSwitcher
        month={month}
        currentMonth={currentMonth}
        onChange={setMonth}
      />
      <BalanceCard
        summary={summary}
        month={month}
        isCurrentMonth={isCurrentMonth}
        forecastCents={forecastCents}
      />
      {isCurrentMonth ? (
        <>
          <QuickAdd
            shortcuts={frequentExpenses(
              transactions,
              everydayShortcuts(profile, t),
              4,
              today
            )}
            todaySpentCents={todaySpentCents}
          />
          {schedules.length > 0 ? (
            <Upcoming schedules={schedules} transactions={transactions} />
          ) : null}
          {getStartedHidden ||
          isGetStartedComplete(
            profile,
            { schedules, transactions },
            t
          ) ? null : (
            <GetStarted
              profile={profile}
              schedules={schedules}
              transactions={transactions}
              onHide={() => setGetStartedHidden(true)}
            />
          )}
        </>
      ) : null}
      {budget ? (
        <BudgetCard
          budgetCents={money.amountOf(budget)}
          spentCents={summary.expenseCents}
          month={month}
        />
      ) : null}
      <CategoryBreakdown totals={summary.expensesByCategory} />
    </>
  );
};

export const Overview = () => {
  const state = useTransactions();
  const handleRetry = state.reload;

  let content = <MonthDashboard />;
  if (state.status === "loading") {
    content = <ActivityIndicator style={{ marginTop: spacing.xxl }} />;
  } else if (state.status === "error") {
    content = <LoadError error={state.error} onRetry={handleRetry} />;
  }

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          gap: spacing.lg,
          padding: spacing.md,
          paddingBottom: spacing.xxl + ADD_BUTTON_CLEARANCE,
        }}
      >
        {content}
      </ScrollView>
      <AddTransactionButton />
    </>
  );
};
