import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useState } from "react";
import { Pressable } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useInk } from "@/hooks/use-ink";
import { colors } from "@/theme";

/** iOS: inline compact SwiftUI picker. Android: tappable value that opens the Material 3 dialog. */
export function DateField({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
	const ink = useInk();
	const [open, setOpen] = useState(false);

	if (process.env.EXPO_OS === "ios") {
		return (
			<DateTimePicker
				value={value}
				mode="date"
				display="compact"
				locale="fr-FR"
				accentColor={ink.tint}
				onValueChange={(_, date) => onChange(date)}
			/>
		);
	}

	return (
		<>
			<Pressable accessibilityRole="button" hitSlop={8} onPress={() => setOpen(true)}>
				<ThemedText variant="body" style={{ color: colors.tint }}>
					{value.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
				</ThemedText>
			</Pressable>
			{open ? (
				<DateTimePicker
					value={value}
					mode="date"
					presentation="dialog"
					positiveButton={{ label: "OK" }}
					negativeButton={{ label: "Annuler" }}
					onValueChange={(_, date) => {
						setOpen(false);
						onChange(date);
					}}
					onDismiss={() => setOpen(false)}
				/>
			) : null}
		</>
	);
}
