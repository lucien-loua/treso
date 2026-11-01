import { router, Stack } from "expo-router";

/** Header "+" that opens the new-transaction sheet. Android header items take text, not SF Symbols. */
export const AddTransactionToolbar = () => (
  <Stack.Toolbar placement="right">
    <Stack.Toolbar.Button
      icon={process.env.EXPO_OS === "ios" ? "plus" : undefined}
      accessibilityLabel="Ajouter une opération"
      onPress={() => router.push("/transaction/new")}
    >
      Ajouter
    </Stack.Toolbar.Button>
  </Stack.Toolbar>
);
