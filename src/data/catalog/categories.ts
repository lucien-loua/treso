import type { SymbolViewProps } from "expo-symbols";

import type { TransactionType } from "@/data/types";
import type { CategoryColor } from "@/theme";

/** Stored in the database: never rename one. Each language names them (`t.categories`). */
export type CategoryId =
  | "groceries"
  | "restaurants"
  | "transport"
  | "housing"
  | "bills"
  | "shopping"
  | "leisure"
  | "health"
  | "education"
  | "subscriptions"
  | "help"
  | "other-expense"
  | "salary"
  | "freelance"
  | "gifts"
  | "investments"
  | "other-income";

export interface Category {
  id: CategoryId;
  type: TransactionType;
  icon: SymbolViewProps["name"];
  color: CategoryColor;
}

export const categories: Category[] = [
  {
    color: "orange",
    icon: { android: "shopping_cart", ios: "cart.fill", web: "shopping_cart" },
    id: "groceries",
    type: "expense",
  },
  {
    color: "pink",
    icon: { android: "restaurant", ios: "fork.knife", web: "restaurant" },
    id: "restaurants",
    type: "expense",
  },
  {
    color: "blue",
    icon: { android: "directions_car", ios: "car.fill", web: "directions_car" },
    id: "transport",
    type: "expense",
  },
  {
    color: "brown",
    icon: { android: "home", ios: "house.fill", web: "home" },
    id: "housing",
    type: "expense",
  },
  {
    color: "yellow",
    icon: { android: "bolt", ios: "bolt.fill", web: "bolt" },
    id: "bills",
    type: "expense",
  },
  {
    color: "purple",
    icon: { android: "shopping_bag", ios: "bag.fill", web: "shopping_bag" },
    id: "shopping",
    type: "expense",
  },
  {
    color: "teal",
    icon: {
      android: "sports_esports",
      ios: "gamecontroller.fill",
      web: "sports_esports",
    },
    id: "leisure",
    type: "expense",
  },
  {
    color: "red",
    icon: {
      android: "medical_services",
      ios: "cross.case.fill",
      web: "medical_services",
    },
    id: "health",
    type: "expense",
  },
  {
    color: "cyan",
    icon: { android: "school", ios: "book.fill", web: "school" },
    id: "education",
    type: "expense",
  },
  {
    color: "indigo",
    icon: { android: "autorenew", ios: "repeat", web: "autorenew" },
    id: "subscriptions",
    type: "expense",
  },
  {
    color: "mint",
    icon: {
      android: "volunteer_activism",
      ios: "heart.fill",
      web: "volunteer_activism",
    },
    id: "help",
    type: "expense",
  },
  {
    color: "gray",
    icon: { android: "more_horiz", ios: "ellipsis", web: "more_horiz" },
    id: "other-expense",
    type: "expense",
  },
  {
    color: "green",
    icon: { android: "payments", ios: "banknote.fill", web: "payments" },
    id: "salary",
    type: "income",
  },
  {
    color: "blue",
    icon: { android: "work", ios: "briefcase.fill", web: "work" },
    id: "freelance",
    type: "income",
  },
  {
    color: "pink",
    icon: { android: "redeem", ios: "gift.fill", web: "redeem" },
    id: "gifts",
    type: "income",
  },
  {
    color: "mint",
    icon: {
      android: "trending_up",
      ios: "chart.line.uptrend.xyaxis",
      web: "trending_up",
    },
    id: "investments",
    type: "income",
  },
  {
    color: "gray",
    icon: { android: "add", ios: "plus", web: "add" },
    id: "other-income",
    type: "income",
  },
];

const byId = new Map<string, Category>(
  categories.map((category) => [category.id, category])
);

const requireCategory = (id: CategoryId): Category => {
  const category = byId.get(id);
  if (!category) {
    throw new Error(`Unknown category: ${id}`);
  }
  return category;
};

const fallback: Record<TransactionType, Category> = {
  expense: requireCategory("other-expense"),
  income: requireCategory("other-income"),
};

export const getCategory = (
  id: string,
  type: TransactionType = "expense"
): Category => byId.get(id) ?? fallback[type];

export const categoriesFor = (type: TransactionType): Category[] =>
  categories.filter((category) => category.type === type);

export const defaultCategoryId: Record<TransactionType, CategoryId> = {
  expense: "groceries",
  income: "salary",
};
