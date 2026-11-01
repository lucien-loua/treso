import { Stack } from "expo-router";

import { tabStackScreenOptions } from "@/constants/navigation";

const TransactionsStack = () => (
  <Stack screenOptions={tabStackScreenOptions}>
    <Stack.Screen name="index" options={{ title: "Opérations" }} />
  </Stack>
);

export default TransactionsStack;
