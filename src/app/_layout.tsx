import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useColorScheme } from "react-native";

import { DATABASE_NAME, migrate } from "@/data/db";
import { TransactionsProvider } from "@/data/transactions-provider";
import { colors } from "@/theme";

// Opaque header so form content starts below it: with a translucent header, ScrollView's
// `automaticallyAdjustKeyboardInsets` resets the top inset on focus and content jumps under the bar.
const sheetOptions = {
	presentation: "modal",
	headerTransparent: false,
	headerShadowVisible: false,
	headerStyle: { backgroundColor: colors.background },
} as const;

export default function RootLayout() {
	const colorScheme = useColorScheme();

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<SQLiteProvider databaseName={DATABASE_NAME} onInit={migrate}>
				<TransactionsProvider>
					<Stack screenOptions={{ contentStyle: { backgroundColor: colors.background } }}>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="transaction/new" options={sheetOptions} />
						<Stack.Screen name="transaction/[id]" options={sheetOptions} />
						<Stack.Screen name="schedule/new" options={sheetOptions} />
						<Stack.Screen name="schedule/[id]" options={sheetOptions} />
					</Stack>
				</TransactionsProvider>
			</SQLiteProvider>
		</ThemeProvider>
	);
}
