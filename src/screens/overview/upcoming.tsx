import { Link, router } from "expo-router";
import { View } from "react-native";

import { SignedAmount } from "@/components/amount-text";
import { CategoryIcon } from "@/components/category-icon";
import { GroupedSection } from "@/components/ui/grouped-section";
import { ListRow, ListRowText, SeparatedList } from "@/components/ui/list-row";
import { PillButton } from "@/components/ui/pill-button";
import { TextButton } from "@/components/ui/text-button";
import { entryCategory, entryTitle, signedCents } from "@/data/entries";
import { useTransactions } from "@/data/transactions-provider";
import type { Schedule, Transaction } from "@/data/types";
import { colors, spacing } from "@/theme";
import { confirm } from "@/utils/alerts";
import { advanceDue, formatShortDate } from "@/utils/dates";
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
  currency,
}: {
  schedule: Schedule;
  transactions: Transaction[];
  currency: string;
}) => {
  const { skip } = useTransactions();
  const isIncome = schedule.type === "income";
  const title = entryTitle(schedule);
  const status = dueStatus(schedule, transactions);
  const actionLabel = isIncome ? "Reçu" : "Payer";

  const confirmSkip = () =>
    confirm({
      confirmLabel: "Ignorer",
      message: `Rien ne sera enregistré. Prochaine échéance : ${formatShortDate(advanceDue(schedule.nextDue, schedule.dayOfMonth))}.`,
      onConfirm: () => skip(schedule),
      title: `Ignorer « ${title} » ce mois-ci ?`,
    });

  return (
    <Link href={`/schedule/${schedule.id}`} asChild>
      <Link.Trigger>
        <ListRow accessibilityHint="Ouvre l’échéance pour la modifier">
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
              cents={signedCents(schedule)}
              currency={currency}
              variant="subhead"
            />
            <PillButton
              label={actionLabel}
              accessibilityLabel={`${actionLabel} : ${title}`}
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
          {isIncome ? "Marquer comme reçu" : "Marquer comme payé"}
        </Link.MenuAction>
        <Link.MenuAction icon="forward" onPress={confirmSkip}>
          Ignorer ce mois-ci
        </Link.MenuAction>
      </Link.Menu>
    </Link>
  );
};

/** Bills and income still to confirm, soonest first, each with a one-tap Pay / Received button. */
export const Upcoming = ({
  schedules,
  transactions,
  currency,
}: {
  schedules: Schedule[];
  transactions: Transaction[];
  currency: string;
}) => (
  <GroupedSection
    title="À venir"
    accessory={
      <TextButton
        label="Ajouter"
        onPress={() => router.push("/schedule/new")}
      />
    }
    footer="Touchez « Payer » ou « Reçu » quand c’est fait. Touchez la ligne pour changer la date ou le montant, appui long pour ignorer un mois."
  >
    <SeparatedList
      data={schedules}
      keyExtractor={(schedule) => schedule.id}
      renderItem={(schedule) => (
        <UpcomingRow
          schedule={schedule}
          transactions={transactions}
          currency={currency}
        />
      )}
    />
  </GroupedSection>
);
