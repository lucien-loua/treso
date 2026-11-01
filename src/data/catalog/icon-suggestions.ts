import { foldText } from "@/utils/text";

import type { IconId } from "./icons";

/** Words of one language that call for an icon; accents and case don't matter. */
export type IconKeywords = Partial<Record<IconId, readonly string[]>>;

/** Tried in this order, so specific icons come before generic ones (« plein d'essence » is fuel, not cart). */
const ORDER: IconId[] = [
  "fuel",
  "car",
  "bus",
  "plane",
  "wifi",
  "phone",
  "water",
  "bolt",
  "house",
  "coffee",
  "food",
  "takeout",
  "cart",
  "pills",
  "health",
  "sport",
  "movie",
  "music",
  "game",
  "clothes",
  "beauty",
  "school",
  "book",
  "family",
  "heart",
  "gift",
  "pet",
  "repair",
  "bank",
  "invest",
  "cash",
  "work",
];

/** Brands, operators and local words people type whatever the language of their phone. */
const SHARED: IconKeywords = {
  bolt: ["cie"],
  bus: ["gbaka", "woro", "sotra"],
  car: ["uber", "yango", "taxi"],
  cart: ["carrefour"],
  food: ["maquis", "garba", "alloco"],
  game: ["playstation"],
  invest: ["tontine"],
  movie: ["netflix"],
  music: ["spotify"],
  phone: ["orange", "mtn", "moov"],
  water: ["sodeci"],
  wifi: ["wifi", "internet", "canal"],
};

const REGEXP_SPECIAL = /[$()*+.?[\\\]^{|}]/gu;

/** Whole words only, plural or not: « pharmacies » matches « pharmacie », « car » doesn't match « carte ». */
const wordsPattern = (words: readonly string[]) =>
  new RegExp(
    String.raw`\b(?:${words
      .map((word) => foldText(word).replaceAll(REGEXP_SPECIAL, String.raw`\$&`))
      .join("|")})s?\b`,
    "u"
  );

const compiled = new WeakMap<IconKeywords, [IconId, RegExp][]>();

const rulesFor = (keywords: IconKeywords) => {
  let rules = compiled.get(keywords);
  if (!rules) {
    rules = ORDER.flatMap((id): [IconId, RegExp][] => {
      const words = [...(keywords[id] ?? []), ...(SHARED[id] ?? [])];
      return words.length > 0 ? [[id, wordsPattern(words)]] : [];
    });
    compiled.set(keywords, rules);
  }
  return rules;
};

/**
 * Icon that fits a transaction name in the language of `keywords` (« Taxi » → car, « Rent » →
 * house), or `null` to keep the category icon.
 */
export const suggestIcon = (
  name: string,
  keywords: IconKeywords
): IconId | null => {
  const text = foldText(name);
  if (!text.trim()) {
    return null;
  }
  return (
    rulesFor(keywords).find(([, pattern]) => pattern.test(text))?.[0] ?? null
  );
};
