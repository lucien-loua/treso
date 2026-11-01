import { Link, router } from "expo-router";
import { View } from "react-native";

import { SignedAmount } from "@/components/amount-text";
import { CategoryIcon } from "@/components/category-icon";
import { GroupedSection } from "@/components/ui/grouped-section";
import { ListRow, ListRowText, SeparatedList } from "@/components/ui/list-row";
import { PillButton } from "@/components/ui/pill-button";
import { TextButton } from "@/components/ui/text-button";
import { entryCategory, entryTitle, signedAmount } from "@/data/entries";
import { useTransactions } from "@/data/transactions-provider";
import type { Schedule, Transaction } from "@/data/types";
import { useMoney } from "@/hooks/use-money";
import { useI18n } from "@/i18n/context";
import { advanceDue } from "@/lib/datetime";
import { colors, spacing } from "@/theme";
import { confirm } from "@/utils/alerts";
import { haptics } from "@/utils/haptics";
import { dueStatus } from "@/utils/schedules";

const toneColor = {
  danger: colors.danger,
  done: colors.income,
  normal: colors.secondaryLabel,
  warning: colors.warning,
};

const settle = (schedule: Schedule) => {
  haptics.selection();
  router.push({
    params: { scheduleId: String(schedule.id) },
    pathname: "/transaction/new",
  });
};

const UpcomingRow = ({
  schedule,
  transactions,
}: {
  schedule: Schedule;
  transactions: Transaction[];
}) => {
  const { skip } = useTransactions();
  const money = useMoney();
  const i18n = useI18n();
  const { t, dates } = i18n;
  const texts = t.overview.upcoming;
  const isIncome = schedule.type === "income";
  const title = entryTitle(schedule, t);
  const status = dueStatus(schedule, transactions, i18n);
  const actionLabel = isIncome ? texts.received : texts.pay;

  const confirmSkip = () =>
    confirm({
      cancelLabel: t.actions.cancel,
      confirmLabel: t.actions.skip,
      failureTitle: t.errors.actionFailed,
      message: texts.skipMessage(
        dates.shortDate(advanceDue(schedule.nextDue, schedule.dayOfMonth))
      ),
      onConfirm: () => skip(schedule),
      title: texts.skipTitle(title),
    });

  return (
    <Link href={`/schedule/${schedule.id}`} asChild>
      <Link.Trigger>
        <ListRow accessibilityHint={texts.openHint}>
          <CategoryIcon
            category={entryCategory(schedule)}
            iconId={schedule.icon}
            colorId={schedule.color}
          />
          <ListRowText
            title={title}
            subtitle={status.label}
            subtitleColor={toneColor[status.tone]}
          />
          <View style={{ alignItems: "flex-end", gap: spacing.sm }}>
            <SignedAmount
              cents={signedAmount(schedule, money.amountOf)}
              variant="subhead"
            />
            <PillButton
              label={actionLabel}
              accessibilityLabel={texts.action(actionLabel, title)}
              size="sm"
              color={isIncome ? colors.income : colors.tint}
              onPress={() => settle(schedule)}
            />
          </View>
        </ListRow>
      </Link.Trigger>
      <Link.Menu>
        <Link.MenuAction
          icon="checkmark.circle"
          onPress={() => settle(schedule)}
        >
          {isIncome ? texts.markReceived : texts.markPaid}
        </Link.MenuAction>
        <Link.MenuAction icon="forward" onPress={confirmSkip}>
          {texts.skip}
        </Link.MenuAction>
      </Link.Menu>
    </Link>
  );
};

/** Bills and income still to confirm, soonest first, each with a one-tap Pay / Received button. */
export const Upcoming = ({
  schedules,
  transactions,
}: {
  schedules: Schedule[];
  transactions: Transaction[];
}) => {
  const { t } = useI18n();
  return (
    <GroupedSection
      title={t.overview.upcoming.title}
      accessory={
        <TextButton
          label={t.actions.add}
          onPress={() => router.push("/schedule/new")}
        />
      }
    >
      <SeparatedList
        data={schedules}
        keyExtractor={(schedule) => schedule.id}
        renderItem={(schedule) => (
          <UpcomingRow schedule={schedule} transactions={transactions} />
        )}
      />
    </GroupedSection>
  );
};
