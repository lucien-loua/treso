import { Stack } from "expo-router";

import { tabStackScreenOptions } from "@/constants/navigation";
import { useI18n } from "@/i18n/context";

const TransactionsStack = () => {
  const { t } = useI18n();
  return (
    <Stack screenOptions={tabStackScreenOptions}>
      <Stack.Screen name="index" options={{ title: t.tabs.transactions }} />
    </Stack>
  );
};

export default TransactionsStack;
