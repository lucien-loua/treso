/** Keyword → icon id from `./icons`. First match wins, so put specific words before generic ones. */
const rules: [RegExp, string][] = [
	[/\b(essence|carburant|plein|gasoil|station)\b/, "fuel"],
	[/\b(taxi|uber|yango|voiture|parking|peage)\b/, "car"],
	[/\b(bus|gbaka|woro|sotra|car|metro|train|transport)\b/, "bus"],
	[/\b(avion|vol|billet|voyage)\b/, "plane"],
	[/\b(wifi|internet|fibre|box|canal)\b/, "wifi"],
	[/\b(credit|forfait|telephone|orange|mtn|moov|recharge|unites)\b/, "phone"],
	[/\b(eau|sodeci)\b/, "water"],
	[/\b(electricite|cie|courant|lumiere|compteur)\b/, "bolt"],
	[/\b(loyer|maison|logement|appartement)\b/, "house"],
	[/\b(cafe|the|petit dejeuner)\b/, "coffee"],
	[/\b(dejeuner|diner|resto|restaurant|maquis|repas|garba|alloco)\b/, "food"],
	[/\b(livraison|emporter|fast food|pizza|burger)\b/, "takeout"],
	[/\b(marche|supermarche|courses|boutique|epicerie|carrefour)\b/, "cart"],
	[/\b(pharmacie|medicament)s?\b/, "pills"],
	[/\b(medecin|docteur|hopital|clinique|sante)\b/, "health"],
	[/\b(sport|salle|gym|foot)\b/, "sport"],
	[/\b(cinema|film|netflix)\b/, "movie"],
	[/\b(musique|spotify|concert)\b/, "music"],
	[/\b(jeu|jeux|playstation|console)\b/, "game"],
	[/\b(vetement|vetements|habits|pagne|chaussures|tailleur)\b/, "clothes"],
	[/\b(coiffure|coiffeur|tresse|tresses|barbier|salon)\b/, "beauty"],
	[/\b(ecole|scolarite|cours|formation|universite)\b/, "school"],
	[/\b(livre|livres|fournitures)\b/, "book"],
	[/\b(famille|maman|papa|parents|enfant|enfants|frere|soeur)\b/, "family"],
	[/\b(don|aide|soutien|eglise|mosquee|quete|dime)\b/, "heart"],
	[/\b(cadeau|anniversaire|mariage|bapteme)\b/, "gift"],
	[/\b(chien|chat|animal|veterinaire)\b/, "pet"],
	[/\b(reparation|garage|mecanicien|plombier|electricien)\b/, "repair"],
	[/\b(banque|frais bancaires|agios)\b/, "bank"],
	[/\b(tontine|epargne|placement|investissement)\b/, "invest"],
	[/\b(salaire|paie|prime)\b/, "cash"],
	[/\b(freelance|mission|client|facture client)\b/, "work"],
];

function normalize(value: string) {
	return value
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase();
}

/** Icon id that fits a transaction name (« Taxi » → car, « Wifi » → wifi), or `null` to keep the category icon. */
export function suggestIcon(name: string): string | null {
	const text = normalize(name);
	if (!text.trim()) return null;
	return rules.find(([pattern]) => pattern.test(text))?.[1] ?? null;
}
