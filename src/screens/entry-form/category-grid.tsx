import { Pressable, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { ThemedText } from "@/components/themed-text";
import { categoriesFor } from "@/data/categories";
import type { TransactionType } from "@/data/types";
import { colors, radius, spacing } from "@/theme";
import { haptics } from "@/utils/haptics";

export const CategoryGrid = ({
  type,
  selectedId,
  onSelect,
}: {
  type: TransactionType;
  selectedId: string;
  onSelect: (id: string) => void;
}) => (
  <View
    accessibilityRole="radiogroup"
    style={{ flexDirection: "row", flexWrap: "wrap", padding: spacing.sm }}
  >
    {categoriesFor(type).map((category) => {
      const selected = category.id === selectedId;
      return (
        <Pressable
          key={category.id}
          accessibilityRole="radio"
          accessibilityLabel={category.label}
          accessibilityState={{ selected }}
          onPress={() => {
            haptics.selection();
            onSelect(category.id);
          }}
          style={({ pressed }) => ({
            alignItems: "center",
            backgroundColor: selected ? colors.fill : "transparent",
            borderCurve: "continuous",
            borderRadius: radius.md,
            gap: 6,
            opacity: pressed ? 0.6 : 1,
            paddingVertical: spacing.sm,
            width: "25%",
          })}
        >
          <View
            style={{
              borderColor: selected ? colors.tint : "transparent",
              borderCurve: "continuous",
              borderRadius: radius.md + 2,
              borderWidth: 2,
              padding: 2,
            }}
          >
            <CategoryIcon category={category} size={40} />
          </View>
          <ThemedText
            variant="caption"
            numberOfLines={1}
            style={
              selected ? { color: colors.label, fontWeight: "600" } : undefined
            }
          >
            {category.label}
          </ThemedText>
        </Pressable>
      );
    })}
  </View>
);
