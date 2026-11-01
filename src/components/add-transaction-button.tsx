import { router, Stack } from "expo-router";

import { useI18n } from "@/i18n/context";

/** Extra bottom room a scrolling screen leaves for this button: none on iOS, it sits in the header. */
export const ADD_BUTTON_CLEARANCE = 0;

/** iOS: a "+" in the header that opens the new-transaction sheet (Android: see `.android.tsx`). */
export const AddTransactionButton = () => {
  const { t } = useI18n();
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Button
        icon="plus"
        accessibilityLabel={t.addTransaction}
        onPress={() => router.push("/transaction/new")}
      />
    </Stack.Toolbar>
  );
};
