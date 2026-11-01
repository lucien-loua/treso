import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useColorScheme } from "react-native";

import { RemindersSync } from "@/components/reminders-sync";
import { DATABASE_NAME, migrate } from "@/data/db";
import { useRefreshExchangeRates } from "@/data/exchange-rates";
import { TransactionsProvider } from "@/data/transactions-provider";
import { I18nProvider } from "@/i18n/provider";
import { colors } from "@/theme";

// Opaque header so form content starts below it: with a translucent header, ScrollView's
// `automaticallyAdjustKeyboardInsets` resets the top inset on focus and content jumps under the bar.
const sheetOptions = {
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.background },
  headerTransparent: false,
  presentation: "modal",
} as const;

/** Sheets opened from a link (notification, shared URL) still get the tabs underneath to go back to. */
export const unstable_settings = { anchor: "(tabs)" };

const RootLayout = () => {
  const colorScheme = useColorScheme();
  useRefreshExchangeRates();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <I18nProvider>
        <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrate}>
          <TransactionsProvider>
            <RemindersSync />
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="transaction/new" options={sheetOptions} />
              <Stack.Screen name="transaction/[id]" options={sheetOptions} />
              <Stack.Screen name="schedule/new" options={sheetOptions} />
              <Stack.Screen name="schedule/[id]" options={sheetOptions} />
              <Stack.Screen
                name="personalize"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="onboarding"
                options={{ gestureEnabled: false, headerShown: false }}
              />
            </Stack>
          </TransactionsProvider>
        </SQLiteProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
