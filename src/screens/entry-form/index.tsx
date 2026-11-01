import { SegmentedControl } from "@expo/ui/community/segmented-control";
import { router, Stack, useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { NativeStackNavigationProp } from "expo-router/native-stack";
import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from "react";
import { Alert, Pressable, ScrollView, TextInput, View } from "react-native";

import { CategoryIcon } from "@/components/category-icon";
import { GroupedSection, RowSeparator } from "@/components/grouped-section";
import { ThemedText } from "@/components/themed-text";
import { categoriesFor, defaultCategoryId, getCategory } from "@/data/categories";
import { suggestIcon } from "@/data/icon-suggestions";
import { useCurrency } from "@/data/settings";
import type { TransactionType } from "@/data/types";
import { colors, spacing, type } from "@/theme";
import { dateInMonth, monthKeyOf, nextDueFrom, parseISODate, toISODate } from "@/utils/dates";
import { haptics } from "@/utils/haptics";
import { centsToInput, currencyDecimals, currencySymbol, parseAmount } from "@/utils/money";

import { CategoryGrid } from "./category-grid";
import { DateField } from "./date-field";
import { DayField } from "./day-field";
import { AppearancePicker } from "./appearance-picker";

const types: { value: TransactionType; label: string }[] = [
	{ value: "expense", label: "Dépense" },
	{ value: "income", label: "Revenu" },
];

/** Everything the form edits. `date` matters for a transaction, `dayOfMonth` and `nextDue` for a schedule. */
export type EntryDraft = {
	type: TransactionType;
	amountCents: number;
	categoryId: string;
	note: string;
	icon: string | null;
	color: string | null;
	date: string;
	dayOfMonth: number;
	nextDue: string;
};

export const SCHEDULE_FOOTER =
	"Treso vous la rappelle chaque mois dans « À venir ». Quand c’est payé (ou reçu), touchez le bouton : le montant et la date peuvent varier.";

export function toTransactionInput({ dayOfMonth: _day, nextDue: _nextDue, ...draft }: EntryDraft) {
	return draft;
}

export function toScheduleInput({ date: _date, ...draft }: EntryDraft) {
	return draft;
}

/** Keeps digits and, when the currency has cents, one decimal comma with at most `decimals` digits. */
function sanitizeAmount(text: string, decimals: number) {
	const [whole, ...fraction] = text.replace(/[^\d.,]/g, "").replace(/\./g, ",").split(",");
	const integer = whole.slice(0, 12);
	if (decimals === 0 || fraction.length === 0) return integer;
	return `${integer || "0"},${fraction.join("").slice(0, decimals)}`;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				gap: spacing.md,
				minHeight: 50,
				paddingHorizontal: spacing.md,
				paddingVertical: spacing.xs,
			}}
		>
			<ThemedText variant="body">{label}</ThemedText>
			{children}
		</View>
	);
}

export function EntryForm({
	kind,
	initial,
	title,
	submitLabel,
	focusAmount = false,
	essentialsOnly = false,
	intro,
	footer,
	onSubmit,
	onDelete,
	deleteLabel = "Supprimer",
	deleteMessage = "Cette action est définitive.",
}: {
	/** A transaction has a date; a schedule has a day of the month. */
	kind: "transaction" | "schedule";
	initial?: Partial<EntryDraft>;
	title: string;
	submitLabel: string;
	focusAmount?: boolean;
	/** Only amount, name and date: for confirming a schedule, where type and category are already known. */
	essentialsOnly?: boolean;
	/** Short context line shown above the amount, e.g. which due date is being paid. */
	intro?: string;
	footer?: string;
	onSubmit: (draft: EntryDraft) => Promise<void>;
	onDelete?: () => Promise<void>;
	deleteLabel?: string;
	deleteMessage?: string;
}) {
	const [currency] = useCurrency();
	const [kindOfMoney, setKindOfMoney] = useState<TransactionType>(initial?.type ?? "expense");
	const [amountText, setAmountText] = useState(initial?.amountCents ? centsToInput(initial.amountCents) : "");
	const [categoryId, setCategoryId] = useState(initial?.categoryId ?? defaultCategoryId[initial?.type ?? "expense"]);
	const [date, setDate] = useState(() => (initial?.date ? parseISODate(initial.date) : new Date()));
	const [dayOfMonth, setDayOfMonth] = useState(initial?.dayOfMonth ?? new Date().getDate());
	// Next due date of a schedule: computed from the day, and editable when it's off
	// (e.g. this month's rent is not paid yet).
	const [nextDue, setNextDue] = useState(() =>
		parseISODate(initial?.nextDue ?? nextDueFrom(initial?.dayOfMonth ?? new Date().getDate())),
	);
	const [note, setNote] = useState(initial?.note ?? "");
	// `null` = automatic: the icon follows the name (« Taxi » → car), else the category.
	const [iconId, setIconId] = useState<string | null>(initial?.icon ?? null);
	// `null` = the category's color.
	const [colorId, setColorId] = useState<string | null>(initial?.color ?? null);
	const [pickingIcon, setPickingIcon] = useState(false);
	const [busy, setBusy] = useState(false);
	const amountInput = useRef<ComponentRef<typeof TextInput>>(null);
	const navigation = useNavigation<NativeStackNavigationProp<Record<string, undefined>>>();

	// Focus the amount once the sheet has settled; focusing mid-animation makes iOS
	// scroll the content under the header.
	useEffect(() => {
		if (!focusAmount) return;
		return navigation.addListener("transitionEnd", (event) => {
			if (!event.data.closing) amountInput.current?.focus();
		});
	}, [navigation, focusAmount]);

	const decimals = currencyDecimals(currency);
	const amountCents = parseAmount(amountText, decimals);
	const canSave = amountCents !== null && !busy;
	const category = getCategory(categoryId, kindOfMoney);
	const isIncome = kindOfMoney === "income";

	const changeType = (next: TransactionType) => {
		setKindOfMoney(next);
		if (!categoriesFor(next).some((c) => c.id === categoryId)) {
			setCategoryId(defaultCategoryId[next]);
		}
	};

	const save = async () => {
		if (amountCents === null) return;
		setBusy(true);
		try {
			await onSubmit({
				type: kindOfMoney,
				amountCents,
				categoryId,
				note: note.trim(),
				icon: iconId ?? suggestIcon(note),
				color: colorId,
				date: toISODate(date),
				dayOfMonth,
				nextDue: toISODate(nextDue),
			});
			haptics.success();
			router.back();
		} catch (error) {
			// Keep the sheet open with the draft intact so nothing typed is lost.
			setBusy(false);
			Alert.alert("Enregistrement impossible", String(error));
		}
	};

	const confirmDelete = () => {
		if (!onDelete) return;
		haptics.warning();
		Alert.alert(`${deleteLabel} ?`, deleteMessage, [
			{ text: "Annuler", style: "cancel" },
			{
				text: "Supprimer",
				style: "destructive",
				onPress: async () => {
					setBusy(true);
					try {
						await onDelete();
						router.back();
					} catch (error) {
						setBusy(false);
						Alert.alert("Suppression impossible", String(error));
					}
				},
			},
		]);
	};

	return (
		<>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				automaticallyAdjustKeyboardInsets
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="interactive"
				contentContainerStyle={{ padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl }}
			>
				{/* Amount sits first: iOS scrolls the focused field to the top, so anything above it would hide. */}
				<View style={{ alignItems: "center", gap: spacing.md, paddingTop: spacing.sm }}>
					{intro ? (
						<ThemedText variant="subhead" style={{ textAlign: "center" }}>
							{intro}
						</ThemedText>
					) : null}
					<View style={{ flexDirection: "row", alignItems: "baseline", gap: spacing.xs }}>
						<TextInput
							ref={amountInput}
							value={amountText}
							onChangeText={(text) => setAmountText(sanitizeAmount(text, decimals))}
							placeholder="0"
							placeholderTextColor={colors.tertiaryLabel}
							keyboardType={decimals > 0 ? "decimal-pad" : "number-pad"}
							accessibilityLabel={`Montant en ${currencySymbol(currency)}`}
							selectionColor={colors.tint}
							style={[
								type.hero,
								{ color: isIncome ? colors.income : colors.label, minWidth: 60, textAlign: "center", padding: 0 },
							]}
						/>
						<ThemedText variant="title" style={{ color: colors.secondaryLabel }}>
							{currencySymbol(currency)}
						</ThemedText>
					</View>
					{kind === "schedule" ? (
						<ThemedText variant="footnote" style={{ textAlign: "center" }}>
							Montant habituel : vous pourrez l’ajuster au moment de payer.
						</ThemedText>
					) : null}
					{essentialsOnly ? null : (
						<SegmentedControl
							values={types.map((t) => t.label)}
							selectedIndex={types.findIndex((t) => t.value === kindOfMoney)}
							onChange={(event) => changeType(types[event.nativeEvent.selectedSegmentIndex].value)}
							accessibilityLabel="Dépense ou revenu"
							style={{ alignSelf: "stretch" }}
						/>
					)}
				</View>

				{essentialsOnly ? null : (
					<GroupedSection title="Catégorie">
						<CategoryGrid type={kindOfMoney} selectedId={categoryId} onSelect={setCategoryId} />
					</GroupedSection>
				)}

				<GroupedSection title="Détails" footer={footer}>
					{/* Looks like the row it will become in the list: icon + name. Tap the icon to change it. */}
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: spacing.sm + 4,
							minHeight: 56,
							paddingHorizontal: spacing.md,
							paddingVertical: spacing.sm,
						}}
					>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel="Changer l’icône et la couleur"
							accessibilityState={{ expanded: pickingIcon }}
							hitSlop={8}
							onPress={() => setPickingIcon((open) => !open)}
						>
							<CategoryIcon
								category={category}
								iconId={iconId ?? suggestIcon(note)}
								colorId={colorId}
								size={36}
							/>
							<View
								style={{
									position: "absolute",
									right: -5,
									bottom: -5,
									width: 18,
									height: 18,
									borderRadius: 9,
									backgroundColor: colors.surface,
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<SymbolView
									name={{ ios: "pencil.circle.fill", android: "edit", web: "edit" }}
									tintColor={colors.secondaryLabel}
									resizeMode="scaleAspectFit"
									style={{ width: 16, height: 16 }}
								/>
							</View>
						</Pressable>
						{/* Empty name falls back to the category label, which the placeholder shows. */}
						<TextInput
							value={note}
							onChangeText={setNote}
							placeholder={category.label}
							placeholderTextColor={colors.tertiaryLabel}
							accessibilityLabel="Nom"
							returnKeyType="done"
							clearButtonMode="while-editing"
							maxLength={80}
							selectionColor={colors.tint}
							style={[type.body, { flex: 1, paddingVertical: spacing.sm }]}
						/>
					</View>
					{pickingIcon ? (
						<AppearancePicker
							category={category}
							autoIconId={suggestIcon(note)}
							iconId={iconId}
							colorId={colorId}
							onColorChange={setColorId}
							onIconChange={(id) => {
								// The icon is usually the last choice: close the panel once it's picked.
								setIconId(id);
								setPickingIcon(false);
							}}
						/>
					) : null}
					<RowSeparator />
					{kind === "transaction" ? (
						<Row label="Date">
							<DateField value={date} onChange={setDate} />
						</Row>
					) : (
						<>
							<Row label={isIncome ? "Attendu vers le" : "À payer avant le"}>
								<DayField
									value={dayOfMonth}
									onChange={(day) => {
										setDayOfMonth(day);
										setNextDue(parseISODate(dateInMonth(monthKeyOf(nextDue), day)));
									}}
								/>
							</Row>
							<RowSeparator />
							<Row label={isIncome ? "Prochain versement" : "Prochaine échéance"}>
								<DateField value={nextDue} onChange={setNextDue} />
							</Row>
						</>
					)}
				</GroupedSection>


				{onDelete ? (
					<GroupedSection>
						<Pressable
							accessibilityRole="button"
							disabled={busy}
							onPress={confirmDelete}
							style={({ pressed }) => ({
								minHeight: 50,
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: pressed ? colors.fill : "transparent",
							})}
						>
							<ThemedText variant="body" style={{ color: colors.danger }}>
								{deleteLabel}
							</ThemedText>
						</Pressable>
					</GroupedSection>
				) : null}
			</ScrollView>

			<Stack.Screen.Title>{title}</Stack.Screen.Title>
			{process.env.EXPO_OS === "ios" ? (
				<Stack.Toolbar placement="left">
					<Stack.Toolbar.Button onPress={() => router.back()}>Annuler</Stack.Toolbar.Button>
				</Stack.Toolbar>
			) : null}
			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" disabled={!canSave} onPress={save}>
					{submitLabel}
				</Stack.Toolbar.Button>
			</Stack.Toolbar>
		</>
	);
}
