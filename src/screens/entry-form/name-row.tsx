import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import type { Category } from "@/data/categories";
import { suggestIcon } from "@/data/icon-suggestions";
import { colors, spacing, type } from "@/theme";

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
  const [picking, setPicking] = useState(false);
  const autoIconId = suggestIcon(note);

  return (
    <>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          gap: spacing.sm + 4,
          minHeight: 56,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Changer l’icône et la couleur"
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
              borderRadius: 9,
              bottom: -5,
              height: 18,
              justifyContent: "center",
              position: "absolute",
              right: -5,
              width: 18,
            }}
          >
            <SymbolView
              name={{ android: "edit", ios: "pencil.circle.fill", web: "edit" }}
              tintColor={colors.secondaryLabel}
              resizeMode="scaleAspectFit"
              style={{ height: 16, width: 16 }}
            />
          </View>
        </Pressable>
        {/* Empty name falls back to the category label, which the placeholder shows. */}
        <TextInput
          value={note}
          onChangeText={onNoteChange}
          placeholder={category.label}
          placeholderTextColor={colors.tertiaryLabel}
          accessibilityLabel="Nom"
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
