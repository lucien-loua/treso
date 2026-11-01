import { Stack } from "expo-router";

import { tabStackScreenOptions } from "@/constants/navigation";

export default function TransactionsStack() {
	return (
		<Stack screenOptions={tabStackScreenOptions}>
			<Stack.Screen name="index" options={{ title: "Opérations" }} />
		</Stack>
	);
}
