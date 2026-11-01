import { router } from "expo-router";
import type { Href } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Fragment } from "react";
import { Pressable, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { GroupedSection, RowSeparator } from "@/components/grouped-section";
import { ThemedText } from "@/components/themed-text";
import { getCategory } from "@/data/categories";
import type { Schedule, Transaction } from "@/data/types";
import { colors, spacing } from "@/theme";
import { haptics } from "@/utils/haptics";

interface Step {
  key: string;
  categoryId: string;
  title: string;
  hint: string;
  done: boolean;
  href: Href;
}

const steps = (schedules: Schedule[], transactions: Transaction[]): Step[] => {
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
) => steps(schedules, transactions).every((step) => step.done);

/** First-run checklist: each step opens a prefilled form, and ticks itself once done. */
export const GetStarted = ({
  schedules,
  transactions,
  onHide,
}: {
  schedules: Schedule[];
  transactions: Transaction[];
  onHide?: () => void;
}) => (
  <GroupedSection
    title="Bien démarrer"
    accessory={
      onHide ? (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onHide}>
          <ThemedText variant="subhead" style={{ color: colors.tint }}>
            Masquer
          </ThemedText>
        </Pressable>
      ) : null
    }
    footer="Vous pourrez tout modifier ensuite : montants, jours, noms."
  >
    {steps(schedules, transactions).map((step, index) => (
      <Fragment key={step.key}>
        {index > 0 ? <RowSeparator inset={64} /> : null}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ checked: step.done }}
          onPress={() => {
            haptics.selection();
            router.push(step.href);
          }}
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
              <CategoryIcon category={getCategory(step.categoryId)} />
              <View style={{ flex: 1, gap: 2 }}>
                <ThemedText
                  variant="body"
                  style={
                    step.done ? { color: colors.secondaryLabel } : undefined
                  }
                >
                  {step.title}
                </ThemedText>
                <ThemedText variant="footnote">{step.hint}</ThemedText>
              </View>
              <SymbolView
                name={
                  step.done
                    ? {
                        android: "check_circle",
                        ios: "checkmark.circle.fill",
                        web: "check_circle",
                      }
                    : {
                        android: "chevron_right",
                        ios: "chevron.right",
                        web: "chevron_right",
                      }
                }
                tintColor={step.done ? colors.income : colors.tertiaryLabel}
                weight="semibold"
                resizeMode="scaleAspectFit"
                style={
                  step.done
                    ? { height: 22, width: 22 }
                    : { height: 12, width: 12 }
                }
              />
            </View>
          )}
        </Pressable>
      </Fragment>
    ))}
  </GroupedSection>
);
