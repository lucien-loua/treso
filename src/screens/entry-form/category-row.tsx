import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { ThemedText } from "@/components/ui/themed-text";
import { symbols } from "@/constants/symbols";
import type { Category } from "@/data/catalog/categories";
import { useI18n } from "@/i18n/context";
import { colors, glyph, spacing } from "@/theme";
import { haptics } from "@/utils/haptics";

const ICON_SIZE = 24;
const MIN_HEIGHT = 50;

/** « Catégorie · [icon] Transport ⌄ »: the category in one line; tapping opens the grid below. */
export const CategoryRow = ({
  category,
  open,
  onToggle,
}: {
  category: Category;
  open: boolean;
  onToggle: () => void;
}) => {
  const { t } = useI18n();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.form.categoryValue(t.categories[category.id])}
      accessibilityState={{ expanded: open }}
      onPress={() => {
        haptics.selection();
        onToggle();
      }}
      style={({ pressed }) => ({
        alignItems: "center",
        backgroundColor: pressed ? colors.fill : "transparent",
        flexDirection: "row",
        gap: spacing.md,
        justifyContent: "space-between",
        minHeight: MIN_HEIGHT,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
      })}
    >
      <ThemedText variant="body">{t.form.category}</ThemedText>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          flexShrink: 1,
          gap: spacing.sm,
        }}
      >
        <CategoryIcon category={category} size={ICON_SIZE} />
        <ThemedText
          variant="body"
          numberOfLines={1}
          style={{ color: colors.secondaryLabel, flexShrink: 1 }}
        >
          {t.categories[category.id]}
        </ThemedText>
        <SymbolView
          name={symbols.chevronRight}
          tintColor={colors.tertiaryLabel}
          weight="semibold"
          resizeMode="scaleAspectFit"
          size={glyph.sm}
          style={{ transform: [{ rotate: open ? "-90deg" : "90deg" }] }}
        />
      </View>
    </Pressable>
  );
};
