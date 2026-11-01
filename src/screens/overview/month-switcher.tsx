import { SymbolView } from "expo-symbols";
import type { SymbolViewProps } from "expo-symbols";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { colors, radius, spacing } from "@/theme";
import { formatMonth, shiftMonth } from "@/utils/dates";
import type { MonthKey } from "@/utils/dates";
import { haptics } from "@/utils/haptics";

const buttonOpacity = (disabled: boolean | undefined, pressed: boolean) => {
  if (disabled) {
    return 0.35;
  }
  return pressed ? 0.6 : 1;
};

const ArrowButton = ({
  icon,
  label,
  disabled,
  onPress,
}: {
  icon: SymbolViewProps["name"];
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ disabled }}
    disabled={disabled}
    hitSlop={8}
    onPress={() => {
      haptics.selection();
      onPress();
    }}
    style={({ pressed }) => ({
      alignItems: "center",
      backgroundColor: colors.fill,
      borderRadius: radius.full,
      height: 36,
      justifyContent: "center",
      opacity: buttonOpacity(disabled, pressed),
      width: 36,
    })}
  >
    <SymbolView
      name={icon}
      tintColor={colors.label}
      weight="semibold"
      resizeMode="scaleAspectFit"
      style={{ height: 14, width: 14 }}
    />
  </Pressable>
);

export const MonthSwitcher = ({
  month,
  currentMonth,
  onChange,
}: {
  month: MonthKey;
  currentMonth: MonthKey;
  onChange: (month: MonthKey) => void;
}) => {
  const isCurrent = month === currentMonth;
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: spacing.xs,
      }}
    >
      <ArrowButton
        icon={{
          android: "chevron_left",
          ios: "chevron.left",
          web: "chevron_left",
        }}
        label="Mois précédent"
        onPress={() => onChange(shiftMonth(month, -1))}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityHint={isCurrent ? undefined : "Revient au mois en cours"}
        disabled={isCurrent}
        onPress={() => onChange(currentMonth)}
      >
        <ThemedText variant="headline" accessibilityRole="header">
          {formatMonth(month)}
        </ThemedText>
      </Pressable>
      <ArrowButton
        icon={{
          android: "chevron_right",
          ios: "chevron.right",
          web: "chevron_right",
        }}
        label="Mois suivant"
        disabled={isCurrent}
        onPress={() => onChange(shiftMonth(month, 1))}
      />
    </View>
  );
};
