import { Stack } from "expo-router";

import { colors } from "@/theme";

import { OnboardingProvider } from "./provider";

const isIOS = process.env.EXPO_OS === "ios";

/**
 * The questions about the user's life, as a stack of steps. `first`: at first launch, until a
 * profile exists. `edit`: from Settings, to change the answers.
 */
export const OnboardingFlow = ({ mode }: { mode: "first" | "edit" }) => (
  <OnboardingProvider mode={mode}>
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerBackButtonDisplayMode: "minimal",
        headerShadowVisible: false,
        headerStyle: isIOS ? undefined : { backgroundColor: colors.background },
        headerTransparent: isIOS,
        title: "",
      }}
    />
  </OnboardingProvider>
);
