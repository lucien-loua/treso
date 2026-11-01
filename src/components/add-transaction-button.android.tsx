import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable } from "react-native";

import { symbols } from "@/constants/symbols";
import { useI18n } from "@/i18n/context";
import { colors, radius, spacing } from "@/theme";

const FAB_SIZE = 56;

/** Extra bottom room a scrolling screen leaves so its last row can scroll clear of the button. */
export const ADD_BUTTON_CLEARANCE = FAB_SIZE + spacing.md;

/** Material's floating action button: the screen's main action, bottom-right (iOS: header "+"). */
export const AddTransactionButton = () => {
  const { t } = useI18n();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.addTransaction}
      onPress={() => router.push("/transaction/new")}
      style={({ pressed }) => ({
        alignItems: "center",
        backgroundColor: colors.fab,
        borderRadius: radius.lg,
        bottom: spacing.md,
        boxShadow: "0 3px 8px rgba(0, 0, 0, 0.2)",
        height: FAB_SIZE,
        justifyContent: "center",
        opacity: pressed ? 0.85 : 1,
        position: "absolute",
        right: spacing.md,
        width: FAB_SIZE,
      })}
    >
      <SymbolView
        name={symbols.add}
        tintColor={colors.onFab}
        resizeMode="scaleAspectFit"
        style={{ height: 24, width: 24 }}
      />
    </Pressable>
  );
};
