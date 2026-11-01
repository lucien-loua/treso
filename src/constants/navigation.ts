import type { Stack } from "expo-router";
import type { ComponentProps } from "react";

import { colors } from "@/theme";

type StackScreenOptions = NonNullable<
  ComponentProps<typeof Stack>["screenOptions"]
>;

const isIOS = process.env.EXPO_OS === "ios";

/** Shared header style for the stack inside each tab: large titles over grouped content. */
export const tabStackScreenOptions: StackScreenOptions = {
  contentStyle: { backgroundColor: colors.background },
  headerBackButtonDisplayMode: "minimal",
  headerLargeStyle: { backgroundColor: "transparent" },
  headerLargeTitleEnabled: true,
  headerLargeTitleShadowVisible: false,
  headerShadowVisible: false,
  headerStyle: isIOS ? undefined : { backgroundColor: colors.background },
  headerTitleStyle: { color: colors.label },
  headerTransparent: isIOS,
};
