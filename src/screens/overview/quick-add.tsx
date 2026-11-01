import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { ThemedText } from "@/components/ui/themed-text";
import { getCategory } from "@/data/catalog/categories";
import { useMoney } from "@/hooks/use-money";
import { useI18n } from "@/i18n/context";
import { colors, radius, spacing } from "@/theme";
import { haptics } from "@/utils/haptics";
import type { Shortcut } from "@/utils/shortcuts";

const Chip = ({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: ReactNode;
}) => {
  const { t } = useI18n();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.overview.quickAdd.add(label)}
      onPress={() => {
        haptics.selection();
        onPress();
      }}
    >
      {({ pressed }) => (
        <View
          style={{
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: radius.full,
            flexDirection: "row",
            gap: spacing.sm,
            opacity: pressed ? 0.6 : 1,
            paddingLeft: spacing.sm,
            paddingRight: spacing.md,
            paddingVertical: spacing.sm,
          }}
        >
          {children}
          <ThemedText
            variant="callout"
            numberOfLines={1}
            style={{ maxWidth: 160 }}
          >
            {label}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
};

/** One-tap entry for everyday spending: each chip opens the form prefilled, amount focused. */
export const QuickAdd = ({
  shortcuts,
  todaySpentCents,
}: {
  shortcuts: Shortcut[];
  todaySpentCents: number;
}) => {
  const { t } = useI18n();
  const money = useMoney();
  return (
    <View style={{ gap: spacing.sm }}>
      <View
        style={{
          alignItems: "baseline",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: spacing.md,
        }}
      >
        <ThemedText variant="sectionHeader" accessibilityRole="header">
          {t.overview.quickAdd.title}
        </ThemedText>
        <ThemedText
          variant="footnote"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {t.overview.quickAdd.today(money.format(todaySpentCents))}
        </ThemedText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -spacing.md }}
        contentContainerStyle={{
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
        }}
      >
        {shortcuts.map((shortcut) => {
          const category = getCategory(shortcut.categoryId);
          return (
            <Chip
              key={`${shortcut.categoryId}|${shortcut.note}|${shortcut.icon ?? ""}|${shortcut.color ?? ""}`}
              label={shortcut.note || t.categories[category.id]}
              onPress={() =>
                router.push({
                  params: {
                    categoryId: shortcut.categoryId,
                    color: shortcut.color ?? "",
                    icon: shortcut.icon ?? "",
                    note: shortcut.note,
                  },
                  pathname: "/transaction/new",
                })
              }
            >
              <CategoryIcon
                category={category}
                iconId={shortcut.icon}
                colorId={shortcut.color}
                size={28}
              />
            </Chip>
          );
        })}
      </ScrollView>
    </View>
  );
};
