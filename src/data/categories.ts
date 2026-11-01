import type { SymbolViewProps } from "expo-symbols";

import type { CategoryColor } from "@/theme";

import type { TransactionType } from "./types";

export type Category = {
	id: string;
	type: TransactionType;
	label: string;
	icon: SymbolViewProps["name"];
	color: CategoryColor;
};

export const categories: Category[] = [
	{
		id: "groceries",
		type: "expense",
		label: "Courses",
		icon: { ios: "cart.fill", android: "shopping_cart", web: "shopping_cart" },
		color: "orange",
	},
	{
		id: "restaurants",
		type: "expense",
		label: "Restaurants",
		icon: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
		color: "pink",
	},
	{
		id: "transport",
		type: "expense",
		label: "Transport",
		icon: { ios: "car.fill", android: "directions_car", web: "directions_car" },
		color: "blue",
	},
	{
		id: "housing",
		type: "expense",
		label: "Logement",
		icon: { ios: "house.fill", android: "home", web: "home" },
		color: "brown",
	},
	{
		id: "bills",
		type: "expense",
		label: "Factures",
		icon: { ios: "bolt.fill", android: "bolt", web: "bolt" },
		color: "yellow",
	},
	{
		id: "shopping",
		type: "expense",
		label: "Shopping",
		icon: { ios: "bag.fill", android: "shopping_bag", web: "shopping_bag" },
		color: "purple",
	},
	{
		id: "leisure",
		type: "expense",
		label: "Loisirs",
		icon: {
			ios: "gamecontroller.fill",
			android: "sports_esports",
			web: "sports_esports",
		},
		color: "teal",
	},
	{
		id: "health",
		type: "expense",
		label: "Santé",
		icon: {
			ios: "cross.case.fill",
			android: "medical_services",
			web: "medical_services",
		},
		color: "red",
	},
	{
		id: "education",
		type: "expense",
		label: "Éducation",
		icon: { ios: "book.fill", android: "school", web: "school" },
		color: "cyan",
	},
	{
		id: "subscriptions",
		type: "expense",
		label: "Abonnements",
		icon: { ios: "repeat", android: "autorenew", web: "autorenew" },
		color: "indigo",
	},
	{
		id: "help",
		type: "expense",
		label: "Aide",
		icon: { ios: "heart.fill", android: "volunteer_activism", web: "volunteer_activism" },
		color: "mint",
	},
	{
		id: "other-expense",
		type: "expense",
		label: "Autre",
		icon: { ios: "ellipsis", android: "more_horiz", web: "more_horiz" },
		color: "gray",
	},
	{
		id: "salary",
		type: "income",
		label: "Salaire",
		icon: { ios: "banknote.fill", android: "payments", web: "payments" },
		color: "green",
	},
	{
		id: "freelance",
		type: "income",
		label: "Freelance",
		icon: { ios: "briefcase.fill", android: "work", web: "work" },
		color: "blue",
	},
	{
		id: "gifts",
		type: "income",
		label: "Cadeaux",
		icon: { ios: "gift.fill", android: "redeem", web: "redeem" },
		color: "pink",
	},
	{
		id: "investments",
		type: "income",
		label: "Placements",
		icon: {
			ios: "chart.line.uptrend.xyaxis",
			android: "trending_up",
			web: "trending_up",
		},
		color: "mint",
	},
	{
		id: "other-income",
		type: "income",
		label: "Autre revenu",
		icon: { ios: "plus", android: "add", web: "add" },
		color: "gray",
	},
];

const byId = new Map(categories.map((category) => [category.id, category]));

const fallback: Record<TransactionType, Category> = {
	expense: byId.get("other-expense")!,
	income: byId.get("other-income")!,
};

export function getCategory(
	id: string,
	type: TransactionType = "expense",
): Category {
	return byId.get(id) ?? fallback[type];
}

export function categoriesFor(type: TransactionType): Category[] {
	return categories.filter((category) => category.type === type);
}

export const defaultCategoryId: Record<TransactionType, string> = {
	expense: "groceries",
	income: "salary",
};
