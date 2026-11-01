import type { SymbolViewProps } from "expo-symbols";

export type IconOption = {
	id: string;
	label: string;
	symbol: SymbolViewProps["name"];
};

type SymbolSpec = Exclude<SymbolViewProps["name"], string>;

// Typed parameters make TypeScript reject misspelled SF Symbol / Material names.
const icon = (
	id: string,
	label: string,
	ios: NonNullable<SymbolSpec["ios"]>,
	android: NonNullable<SymbolSpec["android"]>,
): IconOption => ({ id, label, symbol: { ios, android, web: android } });

/** Icons a transaction can use instead of its category's. Ids are stored in the database: never rename one. */
export const icons: IconOption[] = [
	icon("cart", "Panier", "cart.fill", "shopping_cart"),
	icon("food", "Repas", "fork.knife", "restaurant"),
	icon("coffee", "Café", "cup.and.saucer.fill", "local_cafe"),
	icon("takeout", "À emporter", "takeoutbag.and.cup.and.straw.fill", "takeout_dining"),
	icon("car", "Voiture", "car.fill", "directions_car"),
	icon("fuel", "Carburant", "fuelpump.fill", "local_gas_station"),
	icon("bus", "Bus", "bus.fill", "directions_bus"),
	icon("plane", "Avion", "airplane", "flight"),
	icon("house", "Maison", "house.fill", "home"),
	icon("bolt", "Électricité", "bolt.fill", "bolt"),
	icon("water", "Eau", "drop.fill", "water_drop"),
	icon("wifi", "Internet", "wifi", "wifi"),
	icon("phone", "Téléphone", "iphone", "smartphone"),
	icon("bag", "Sac", "bag.fill", "shopping_bag"),
	icon("clothes", "Vêtements", "tshirt.fill", "checkroom"),
	icon("game", "Jeux", "gamecontroller.fill", "sports_esports"),
	icon("movie", "Cinéma", "film.fill", "movie"),
	icon("music", "Musique", "music.note", "music_note"),
	icon("sport", "Sport", "dumbbell.fill", "fitness_center"),
	icon("health", "Santé", "cross.case.fill", "medical_services"),
	icon("pills", "Médicaments", "pills.fill", "medication"),
	icon("school", "École", "graduationcap.fill", "school"),
	icon("book", "Livre", "book.fill", "menu_book"),
	icon("heart", "Cœur", "heart.fill", "volunteer_activism"),
	icon("gift", "Cadeau", "gift.fill", "redeem"),
	icon("people", "Personnes", "person.2.fill", "group"),
	icon("family", "Famille", "figure.2.and.child.holdinghands", "family_restroom"),
	icon("pet", "Animal", "pawprint.fill", "pets"),
	icon("beauty", "Coiffure", "scissors", "content_cut"),
	icon("repair", "Réparation", "wrench.and.screwdriver.fill", "build"),
	icon("cash", "Espèces", "banknote.fill", "payments"),
	icon("work", "Travail", "briefcase.fill", "work"),
	icon("invest", "Placement", "chart.line.uptrend.xyaxis", "trending_up"),
	icon("card", "Carte", "creditcard.fill", "credit_card"),
	icon("bank", "Banque", "building.columns.fill", "account_balance"),
	icon("star", "Étoile", "star.fill", "star"),
	icon("sparkles", "Divers", "sparkles", "auto_awesome"),
];

const byId = new Map(icons.map((option) => [option.id, option]));

export function getIcon(id: string | null | undefined): IconOption | undefined {
	return id ? byId.get(id) : undefined;
}
