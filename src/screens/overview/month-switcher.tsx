import { SymbolView } from "expo-symbols";
import type { SymbolViewProps } from "expo-symbols";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { symbols } from "@/constants/symbols";
import { useI18n } from "@/i18n/context";
import { shiftMonth } from "@/lib/datetime";
import type { MonthKey } from "@/lib/datetime";
import { colors, glyph, radius, spacing } from "@/theme";
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
      style={{ height: glyph.md, width: glyph.md }}
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
  const { t, dates } = useI18n();
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
        icon={symbols.chevronLeft}
        label={t.overview.month.previous}
        onPress={() => onChange(shiftMonth(month, -1))}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityHint={
          isCurrent ? undefined : t.overview.month.backToCurrent
        }
        disabled={isCurrent}
        onPress={() => onChange(currentMonth)}
      >
        <ThemedText variant="headline" accessibilityRole="header">
          {dates.month(month)}
        </ThemedText>
      </Pressable>
      <ArrowButton
        icon={symbols.chevronRight}
        label={t.overview.month.next}
        disabled={isCurrent}
        onPress={() => onChange(shiftMonth(month, 1))}
      />
    </View>
  );
};
