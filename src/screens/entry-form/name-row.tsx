import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { symbols } from "@/constants/symbols";
import type { Category } from "@/data/catalog/categories";
import { suggestIcon } from "@/data/catalog/icon-suggestions";
import { useI18n } from "@/i18n/context";
import { colors, glyph, radius, spacing, type } from "@/theme";

import { AppearancePicker } from "./appearance-picker";

/**
 * Looks like the row it will become in the list: icon + name.
 * Tapping the icon opens the color and icon picker right below.
 */
export const NameRow = ({
  category,
  note,
  iconId,
  colorId,
  onNoteChange,
  onIconChange,
  onColorChange,
}: {
  category: Category;
  note: string;
  iconId: string | null;
  colorId: string | null;
  onNoteChange: (note: string) => void;
  onIconChange: (id: string | null) => void;
  onColorChange: (id: string | null) => void;
}) => {
  const { t } = useI18n();
  const [picking, setPicking] = useState(false);
  const autoIconId = suggestIcon(note, t.iconKeywords);

  return (
    <>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          gap: spacing.smd,
          minHeight: 56,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.form.appearance}
          accessibilityState={{ expanded: picking }}
          hitSlop={8}
          onPress={() => setPicking((open) => !open)}
        >
          <CategoryIcon
            category={category}
            iconId={iconId ?? autoIconId}
            colorId={colorId}
            size={36}
          />
          <View
            style={{
              alignItems: "center",
              backgroundColor: colors.surface,
              borderRadius: radius.full,
              bottom: -5,
              height: glyph.lg + 2,
              justifyContent: "center",
              position: "absolute",
              right: -5,
              width: glyph.lg + 2,
            }}
          >
            <SymbolView
              name={symbols.edit}
              tintColor={colors.secondaryLabel}
              resizeMode="scaleAspectFit"
              size={glyph.lg}
            />
          </View>
        </Pressable>
        {/* Empty name falls back to the category name, which the placeholder shows. */}
        <TextInput
          value={note}
          onChangeText={onNoteChange}
          placeholder={t.categories[category.id]}
          placeholderTextColor={colors.tertiaryLabel}
          accessibilityLabel={t.form.name}
          returnKeyType="done"
          clearButtonMode="while-editing"
          maxLength={80}
          selectionColor={colors.tint}
          style={[type.body, { flex: 1, paddingVertical: spacing.sm }]}
        />
      </View>
      {picking ? (
        <AppearancePicker
          category={category}
          autoIconId={autoIconId}
          iconId={iconId}
          colorId={colorId}
          onColorChange={onColorChange}
          onIconChange={(id) => {
            // The icon is usually the last choice: close the panel once it's picked.
            onIconChange(id);
            setPicking(false);
          }}
        />
      ) : null}
    </>
  );
};
