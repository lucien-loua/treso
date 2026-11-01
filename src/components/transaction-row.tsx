import { Link } from "expo-router";
import { Alert, Pressable, View } from "react-native";

import { getCategory } from "@/data/categories";
import { useTransactions } from "@/data/transactions-provider";
import type { Transaction } from "@/data/types";
import { colors, spacing } from "@/theme";
import { formatShortDate, toISODate } from "@/utils/dates";
import { haptics } from "@/utils/haptics";
import { formatMoney } from "@/utils/money";
import { signedCents } from "@/utils/stats";

import { CategoryIcon } from "./category-icon";
import { ThemedText } from "./themed-text";

export function TransactionRow({
	transaction,
	currency,
	showDate = false,
}: {
	transaction: Transaction;
	currency: string;
	showDate?: boolean;
}) {
	const { add, remove } = useTransactions();
	const category = getCategory(transaction.categoryId, transaction.type);
	const isIncome = transaction.type === "income";
	const title = transaction.note || category.label;
	const subtitle = [
		transaction.note ? category.label : null,
		showDate ? formatShortDate(transaction.date) : null,
		transaction.scheduleId != null ? "Échéance" : null,
	]
		.filter(Boolean)
		.join(" · ");

	const duplicate = async () => {
		try {
			await add({
				type: transaction.type,
				amountCents: transaction.amountCents,
				categoryId: transaction.categoryId,
				note: transaction.note,
				date: toISODate(new Date()),
				icon: transaction.icon,
				color: transaction.color,
			});
			haptics.success();
		} catch (error) {
			Alert.alert("Impossible de dupliquer", String(error));
		}
	};

	const confirmDelete = () => {
		haptics.warning();
		Alert.alert("Supprimer cette opération ?", `${title} · ${formatMoney(signedCents(transaction), currency)}`, [
			{ text: "Annuler", style: "cancel" },
			{
				text: "Supprimer",
				style: "destructive",
				onPress: () => {
					remove(transaction.id).catch((error) => Alert.alert("Suppression impossible", String(error)));
				},
			},
		]);
	};

	return (
		<Link href={`/transaction/${transaction.id}`} asChild>
			<Link.Trigger>
				{/* Layout lives on the inner View: `Link asChild` drops a function `style` on the Pressable. */}
				<Pressable accessibilityRole="button" accessibilityHint="Ouvre l’opération pour la modifier">
					{({ pressed }) => (
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								gap: spacing.sm + 4,
								minHeight: 60,
								paddingHorizontal: spacing.md,
								paddingVertical: spacing.sm + 2,
								backgroundColor: pressed ? colors.fill : "transparent",
							}}
						>
							<CategoryIcon category={category} iconId={transaction.icon} colorId={transaction.color} />
							<View style={{ flex: 1, gap: 2 }}>
								<ThemedText variant="body" numberOfLines={1}>
									{title}
								</ThemedText>
								{subtitle ? (
									<ThemedText variant="footnote" numberOfLines={1}>
										{subtitle}
									</ThemedText>
								) : null}
							</View>
							<ThemedText
								variant="body"
								style={{
									fontWeight: "600",
									fontVariant: ["tabular-nums"],
									color: isIncome ? colors.income : colors.expense,
								}}
							>
								{formatMoney(signedCents(transaction), currency, { showPlus: true })}
							</ThemedText>
						</View>
					)}
				</Pressable>
			</Link.Trigger>
			<Link.Menu>
				<Link.MenuAction icon="plus.square.on.square" onPress={duplicate}>
					Dupliquer aujourd’hui
				</Link.MenuAction>
				<Link.MenuAction icon="trash" destructive onPress={confirmDelete}>
					Supprimer
				</Link.MenuAction>
			</Link.Menu>
		</Link>
	);
}
