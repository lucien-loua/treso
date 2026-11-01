import { Stack } from "expo-router";

import { tabStackScreenOptions } from "@/constants/navigation";

const SettingsStack = () => (
  <Stack screenOptions={tabStackScreenOptions}>
    <Stack.Screen name="index" options={{ title: "Réglages" }} />
  </Stack>
);

export default SettingsStack;
