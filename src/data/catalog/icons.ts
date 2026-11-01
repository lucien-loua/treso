import type { SymbolViewProps } from "expo-symbols";

/** Stored in the database: never rename one. Each language names them (`t.icons`). */
export type IconId =
  | "cart"
  | "food"
  | "coffee"
  | "takeout"
  | "car"
  | "fuel"
  | "bus"
  | "plane"
  | "house"
  | "bolt"
  | "water"
  | "wifi"
  | "phone"
  | "bag"
  | "clothes"
  | "game"
  | "movie"
  | "music"
  | "sport"
  | "health"
  | "pills"
  | "school"
  | "book"
  | "heart"
  | "gift"
  | "people"
  | "family"
  | "pet"
  | "beauty"
  | "repair"
  | "cash"
  | "work"
  | "invest"
  | "card"
  | "bank"
  | "star"
  | "sparkles";

export interface IconOption {
  id: IconId;
  symbol: SymbolViewProps["name"];
}

type SymbolSpec = Exclude<SymbolViewProps["name"], string>;

// Typed parameters make TypeScript reject misspelled SF Symbol / Material names.
const icon = (
  id: IconId,
  ios: NonNullable<SymbolSpec["ios"]>,
  android: NonNullable<SymbolSpec["android"]>
): IconOption => ({ id, symbol: { android, ios, web: android } });

/** Icons a transaction can use instead of its category's. */
export const icons: IconOption[] = [
  icon("cart", "cart.fill", "shopping_cart"),
  icon("food", "fork.knife", "restaurant"),
  icon("coffee", "cup.and.saucer.fill", "local_cafe"),
  icon("takeout", "takeoutbag.and.cup.and.straw.fill", "takeout_dining"),
  icon("car", "car.fill", "directions_car"),
  icon("fuel", "fuelpump.fill", "local_gas_station"),
  icon("bus", "bus.fill", "directions_bus"),
  icon("plane", "airplane", "flight"),
  icon("house", "house.fill", "home"),
  icon("bolt", "bolt.fill", "bolt"),
  icon("water", "drop.fill", "water_drop"),
  icon("wifi", "wifi", "wifi"),
  icon("phone", "iphone", "smartphone"),
  icon("bag", "bag.fill", "shopping_bag"),
  icon("clothes", "tshirt.fill", "checkroom"),
  icon("game", "gamecontroller.fill", "sports_esports"),
  icon("movie", "film.fill", "movie"),
  icon("music", "music.note", "music_note"),
  icon("sport", "dumbbell.fill", "fitness_center"),
  icon("health", "cross.case.fill", "medical_services"),
  icon("pills", "pills.fill", "medication"),
  icon("school", "graduationcap.fill", "school"),
  icon("book", "book.fill", "menu_book"),
  icon("heart", "heart.fill", "volunteer_activism"),
  icon("gift", "gift.fill", "redeem"),
  icon("people", "person.2.fill", "group"),
  icon("family", "figure.2.and.child.holdinghands", "family_restroom"),
  icon("pet", "pawprint.fill", "pets"),
  icon("beauty", "scissors", "content_cut"),
  icon("repair", "wrench.and.screwdriver.fill", "build"),
  icon("cash", "banknote.fill", "payments"),
  icon("work", "briefcase.fill", "work"),
  icon("invest", "chart.line.uptrend.xyaxis", "trending_up"),
  icon("card", "creditcard.fill", "credit_card"),
  icon("bank", "building.columns.fill", "account_balance"),
  icon("star", "star.fill", "star"),
  icon("sparkles", "sparkles", "auto_awesome"),
];

const byId = new Map<string, IconOption>(
  icons.map((option) => [option.id, option])
);

export const getIcon = (
  id: string | null | undefined
): IconOption | undefined => (id ? byId.get(id) : undefined);
