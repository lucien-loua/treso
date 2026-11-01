import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { ThemedText } from "@/components/ui/themed-text";
import { symbols } from "@/constants/symbols";
import { getCategory } from "@/data/catalog/categories";
import { colors, radius, spacing } from "@/theme";
import { haptics } from "@/utils/haptics";
import { formatMoney } from "@/utils/money";
import type { Shortcut } from "@/utils/shortcuts";

const Chip = ({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: ReactNode;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`Ajouter : ${label}`}
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

/** One-tap entry for everyday spending: each chip opens the form prefilled, amount focused. */
export const QuickAdd = ({
  shortcuts,
  todaySpentCents,
  currency,
}: {
  shortcuts: Shortcut[];
  todaySpentCents: number;
  currency: string;
}) => (
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
        Ajout rapide
      </ThemedText>
      <ThemedText variant="footnote" style={{ fontVariant: ["tabular-nums"] }}>
        Aujourd’hui : {formatMoney(todaySpentCents, currency)}
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
            label={shortcut.note || category.label}
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
      <Chip label="Autre" onPress={() => router.push("/transaction/new")}>
        <View
          style={{
            alignItems: "center",
            backgroundColor: colors.fill,
            borderCurve: "continuous",
            borderRadius: radius.sm,
            height: 28,
            justifyContent: "center",
            width: 28,
          }}
        >
          <SymbolView
            name={symbols.add}
            tintColor={colors.label}
            weight="semibold"
            resizeMode="scaleAspectFit"
            style={{ height: 14, width: 14 }}
          />
        </View>
      </Chip>
    </ScrollView>
  </View>
);
