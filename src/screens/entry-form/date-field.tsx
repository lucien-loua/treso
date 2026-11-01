import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useState } from "react";
import { Pressable } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { useInk } from "@/hooks/use-ink";
import { useI18n } from "@/i18n/context";
import { colors } from "@/theme";

/** iOS: inline compact SwiftUI picker. Android: tappable value that opens the Material 3 dialog. */
export const DateField = ({
  value,
  onChange,
}: {
  value: Date;
  onChange: (date: Date) => void;
}) => {
  const ink = useInk();
  const { t, locale, dates } = useI18n();
  const [open, setOpen] = useState(false);

  if (process.env.EXPO_OS === "ios") {
    return (
      <DateTimePicker
        value={value}
        mode="date"
        display="compact"
        locale={locale}
        accentColor={ink.tint}
        onValueChange={(_, date) => onChange(date)}
      />
    );
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => setOpen(true)}
      >
        <ThemedText variant="body" style={{ color: colors.tint }}>
          {dates.longDate(value)}
        </ThemedText>
      </Pressable>
      {open ? (
        <DateTimePicker
          value={value}
          mode="date"
          presentation="dialog"
          positiveButton={{ label: t.actions.ok }}
          negativeButton={{ label: t.actions.cancel }}
          onValueChange={(_, date) => {
            setOpen(false);
            onChange(date);
          }}
          onDismiss={() => setOpen(false)}
        />
      ) : null}
    </>
  );
};
