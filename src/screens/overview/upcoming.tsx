import { Link, router } from "expo-router";
import { Fragment } from "react";
import { Alert, Pressable, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { GroupedSection, RowSeparator } from "@/components/grouped-section";
import { ThemedText } from "@/components/themed-text";
import { getCategory } from "@/data/categories";
import { useTransactions } from "@/data/transactions-provider";
import type { Schedule, Transaction } from "@/data/types";
import { colors, radius, spacing } from "@/theme";
import { advanceDue, formatShortDate } from "@/utils/dates";
import { haptics } from "@/utils/haptics";
import { formatMoney } from "@/utils/money";
import { runOrAlert } from "@/utils/run-or-alert";
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
  const category = getCategory(schedule.categoryId, schedule.type);
  const isIncome = schedule.type === "income";
  const title = schedule.note || category.label;
  const status = dueStatus(schedule, transactions);
  const actionLabel = isIncome ? "Reçu" : "Payer";

  const confirmSkip = () => {
    Alert.alert(
      `Ignorer « ${title} » ce mois-ci ?`,
      `Rien ne sera enregistré. Prochaine échéance : ${formatShortDate(advanceDue(schedule.nextDue, schedule.dayOfMonth))}.`,
      [
        { style: "cancel", text: "Annuler" },
        {
          onPress: () => runOrAlert(() => skip(schedule), "Action impossible"),
          text: "Ignorer",
        },
      ]
    );
  };

  return (
    <Link href={`/schedule/${schedule.id}`} asChild>
      <Link.Trigger>
        <Pressable
          accessibilityRole="button"
          accessibilityHint="Ouvre l’échéance pour la modifier"
        >
          {({ pressed }) => (
            <View
              style={{
                alignItems: "center",
                backgroundColor: pressed ? colors.fill : "transparent",
                flexDirection: "row",
                gap: spacing.sm + 4,
                minHeight: 64,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm + 2,
              }}
            >
              <CategoryIcon
                category={category}
                iconId={schedule.icon}
                colorId={schedule.color}
              />
              <View style={{ flex: 1, gap: 2 }}>
                <ThemedText variant="body" numberOfLines={1}>
                  {title}
                </ThemedText>
                <ThemedText
                  variant="footnote"
                  numberOfLines={2}
                  style={{ color: toneColor[status.tone] }}
                >
                  {status.label}
                </ThemedText>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <ThemedText
                  variant="subhead"
                  style={{
                    color: isIncome ? colors.income : colors.label,
                    fontVariant: ["tabular-nums"],
                    fontWeight: "600",
                  }}
                >
                  {formatMoney(
                    isIncome ? schedule.amountCents : -schedule.amountCents,
                    currency,
                    {
                      showPlus: true,
                    }
                  )}
                </ThemedText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${actionLabel} : ${title}`}
                  hitSlop={6}
                  onPress={() => settle(schedule)}
                  style={({ pressed: buttonPressed }) => ({
                    backgroundColor: isIncome ? colors.income : colors.tint,
                    borderRadius: radius.full,
                    opacity: buttonPressed ? 0.7 : 1,
                    paddingHorizontal: spacing.md,
                    paddingVertical: 5,
                  })}
                >
                  <ThemedText
                    variant="footnote"
                    style={{ color: colors.onTint, fontWeight: "600" }}
                  >
                    {actionLabel}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          )}
        </Pressable>
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
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => router.push("/schedule/new")}
      >
        <ThemedText variant="subhead" style={{ color: colors.tint }}>
          Ajouter
        </ThemedText>
      </Pressable>
    }
    footer="Touchez « Payer » ou « Reçu » quand c’est fait. Touchez la ligne pour changer la date ou le montant, appui long pour ignorer un mois."
  >
    {schedules.map((schedule, index) => (
      <Fragment key={schedule.id}>
        {index > 0 ? <RowSeparator inset={64} /> : null}
        <UpcomingRow
          schedule={schedule}
          transactions={transactions}
          currency={currency}
        />
      </Fragment>
    ))}
  </GroupedSection>
);
