import type { ComponentProps } from "react";
import type { Stack } from "expo-router";

import { colors } from "@/theme";

type StackScreenOptions = NonNullable<ComponentProps<typeof Stack>["screenOptions"]>;

const isIOS = process.env.EXPO_OS === "ios";

/** Shared header style for the stack inside each tab: large titles over grouped content. */
export const tabStackScreenOptions: StackScreenOptions = {
	headerLargeTitleEnabled: true,
	headerTransparent: isIOS,
	headerShadowVisible: false,
	headerLargeTitleShadowVisible: false,
	headerLargeStyle: { backgroundColor: "transparent" },
	headerStyle: isIOS ? undefined : { backgroundColor: colors.background },
	headerTitleStyle: { color: colors.label },
	headerBackButtonDisplayMode: "minimal",
	contentStyle: { backgroundColor: colors.background },
};
