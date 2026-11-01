import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { ThemedText } from "@/components/themed-text";
import type { Category } from "@/data/categories";
import { getIcon, icons } from "@/data/icons";
import type { CategoryColor } from "@/theme";
import { categoryColors, colors, radius, spacing } from "@/theme";
import { haptics } from "@/utils/haptics";

// Clearly distinct colors; near-duplicates (cyan, mint, teal…) only appear as a category's own color.
const PALETTE: CategoryColor[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "indigo",
  "purple",
  "pink",
];
const PALETTE_SIZE = 8;

/** One row: the category's color first (the automatic choice), then distinct colors. Keeps a saved choice visible. */
const paletteFor = (
  category: Category,
  colorId: string | null
): CategoryColor[] => {
  const keys = [
    category.color,
    ...PALETTE.filter((key) => key !== category.color),
  ].slice(0, PALETTE_SIZE);
  const saved = colorId as CategoryColor | null;
  if (saved && saved in categoryColors && !keys.includes(saved)) {
    keys[keys.length - 1] = saved;
  }
  return keys;
};

const colorNames: Record<CategoryColor, string> = {
  blue: "Bleu",
  brown: "Marron",
  cyan: "Cyan",
  gray: "Gris",
  green: "Vert",
  indigo: "Indigo",
  mint: "Menthe",
  orange: "Orange",
  pink: "Rose",
  purple: "Violet",
  red: "Rouge",
  teal: "Bleu canard",
  yellow: "Jaune",
};

const IconCell = ({
  label,
  selected,
  onPress,
  children,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
}) => (
  <Pressable
    accessibilityRole="radio"
    accessibilityLabel={label}
    accessibilityState={{ selected }}
    onPress={() => {
      haptics.selection();
      onPress();
    }}
    style={({ pressed }) => ({
      alignItems: "center",
      opacity: pressed ? 0.6 : 1,
      paddingVertical: spacing.xs,
      width: "16.66%",
    })}
  >
    <View
      style={{
        borderColor: selected ? colors.tint : "transparent",
        borderCurve: "continuous",
        borderRadius: radius.md,
        borderWidth: 2,
        padding: 2,
      }}
    >
      {children}
    </View>
  </Pressable>
);

/**
 * Opened from the icon next to the name: a row of colors, then the icons.
 * Defaults stay automatic (category color, icon from the name); a tap here overrides them.
 */
export const AppearancePicker = ({
  category,
  autoIconId,
  iconId,
  colorId,
  onIconChange,
  onColorChange,
}: {
  category: Category;
  /** Icon suggested from the name, shown in the "automatic" cell. */
  autoIconId: string | null;
  iconId: string | null;
  colorId: string | null;
  onIconChange: (id: string | null) => void;
  onColorChange: (id: string | null) => void;
}) => {
  const activeColor = (colorId as CategoryColor | null) ?? category.color;
  // The "automatic" cell already shows this glyph: don't list it twice (unless it's the saved choice).
  const autoGlyph = (getIcon(autoIconId)?.symbol ?? category.icon) as {
    ios?: string;
  };
  const library = icons.filter(
    (option) =>
      option.id === iconId ||
      (option.symbol as { ios?: string }).ios !== autoGlyph.ios
  );

  return (
    <View
      style={{
        gap: spacing.sm,
        paddingBottom: spacing.md,
        paddingHorizontal: spacing.sm,
      }}
    >
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Couleur"
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: spacing.xs,
        }}
      >
        {paletteFor(category, colorId).map((key) => {
          const selected = key === activeColor;
          return (
            <Pressable
              key={key}
              accessibilityRole="radio"
              accessibilityLabel={
                key === category.color
                  ? `${colorNames[key]} (couleur de la catégorie)`
                  : colorNames[key]
              }
              accessibilityState={{ selected }}
              hitSlop={6}
              onPress={() => {
                haptics.selection();
                // Picking the category's own color goes back to automatic.
                onColorChange(key === category.color ? null : key);
              }}
              style={{
                alignItems: "center",
                borderColor: selected ? colors.tint : "transparent",
                borderRadius: 18,
                borderWidth: 2,
                height: 36,
                justifyContent: "center",
                width: 36,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: categoryColors[key],
                  borderRadius: 14,
                  height: 28,
                  justifyContent: "center",
                  width: 28,
                }}
              >
                {selected ? (
                  <SymbolView
                    name={{ android: "check", ios: "checkmark", web: "check" }}
                    tintColor="#ffffff"
                    weight="bold"
                    resizeMode="scaleAspectFit"
                    style={{ height: 12, width: 12 }}
                  />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View
        style={{
          backgroundColor: colors.separator,
          height: 0.5,
          marginHorizontal: spacing.sm,
        }}
      />

      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Icône"
        style={{ flexDirection: "row", flexWrap: "wrap" }}
      >
        <IconCell
          label="Automatique, selon le nom"
          selected={iconId === null}
          onPress={() => onIconChange(null)}
        >
          <CategoryIcon
            category={category}
            iconId={autoIconId}
            colorId={colorId}
            size={36}
          />
        </IconCell>
        {library.map((option) => (
          <IconCell
            key={option.id}
            label={option.label}
            selected={iconId === option.id}
            onPress={() => onIconChange(option.id)}
          >
            <CategoryIcon
              category={category}
              iconId={option.id}
              colorId={colorId}
              size={36}
            />
          </IconCell>
        ))}
      </View>
      <ThemedText variant="footnote" style={{ paddingHorizontal: spacing.sm }}>
        Par défaut, la couleur suit la catégorie et la première icône s’adapte
        au nom.
      </ThemedText>
    </View>
  );
};
