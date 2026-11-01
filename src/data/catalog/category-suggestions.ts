import type { TransactionType } from "@/data/types";

import type { CategoryId } from "./categories";
import { matchingIcons } from "./icon-suggestions";
import type { IconKeywords } from "./icon-suggestions";
import type { IconId } from "./icons";

/** The category an icon's words point to, by type: « Salaire » is income, « Taxi » an expense. */
const BY_ICON: Partial<
  Record<IconId, Partial<Record<TransactionType, CategoryId>>>
> = {
  bag: { expense: "shopping" },
  bank: { expense: "bills" },
  beauty: { expense: "shopping" },
  bolt: { expense: "bills" },
  book: { expense: "education" },
  bus: { expense: "transport" },
  car: { expense: "transport" },
  cart: { expense: "groceries" },
  cash: { income: "salary" },
  clothes: { expense: "shopping" },
  coffee: { expense: "restaurants" },
  family: { expense: "help" },
  food: { expense: "restaurants" },
  fuel: { expense: "transport" },
  game: { expense: "leisure" },
  gift: { expense: "help", income: "gifts" },
  health: { expense: "health" },
  heart: { expense: "help" },
  house: { expense: "housing" },
  invest: { income: "investments" },
  movie: { expense: "leisure" },
  music: { expense: "leisure" },
  phone: { expense: "bills" },
  pills: { expense: "health" },
  plane: { expense: "transport" },
  repair: { expense: "housing" },
  school: { expense: "education" },
  sport: { expense: "leisure" },
  takeout: { expense: "restaurants" },
  water: { expense: "bills" },
  wifi: { expense: "bills" },
  work: { income: "freelance" },
};

/**
 * The category a transaction name suggests (« Taxi » → transport, « Loyer » → housing), from the
 * same words as its icon: the first of its icons that has one for `type` (« Cadeau maman »
 * received is a gift). `null` when the name says nothing.
 */
export const suggestCategory = (
  name: string,
  type: TransactionType,
  keywords: IconKeywords
): CategoryId | null => {
  for (const icon of matchingIcons(name, keywords)) {
    const category = BY_ICON[icon]?.[type];
    if (category) {
      return category;
    }
  }
  return null;
};
