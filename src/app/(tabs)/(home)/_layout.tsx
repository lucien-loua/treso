import { Stack } from "expo-router";

import { tabStackScreenOptions } from "@/constants/navigation";

const HomeStack = () => (
  <Stack screenOptions={tabStackScreenOptions}>
    <Stack.Screen name="index" options={{ title: "Aperçu" }} />
  </Stack>
);

export default HomeStack;
