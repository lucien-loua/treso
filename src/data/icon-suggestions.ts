/** Keyword → icon id from `./icons`. First match wins, so put specific words before generic ones. */
const rules: [RegExp, string][] = [
  [/\b(?:essence|carburant|plein|gasoil|station)\b/u, "fuel"],
  [/\b(?:taxi|uber|yango|voiture|parking|peage)\b/u, "car"],
  [/\b(?:bus|gbaka|woro|sotra|car|metro|train|transport)\b/u, "bus"],
  [/\b(?:avion|vol|billet|voyage)\b/u, "plane"],
  [/\b(?:wifi|internet|fibre|box|canal)\b/u, "wifi"],
  [
    /\b(?:credit|forfait|telephone|orange|mtn|moov|recharge|unites)\b/u,
    "phone",
  ],
  [/\b(?:eau|sodeci)\b/u, "water"],
  [/\b(?:electricite|cie|courant|lumiere|compteur)\b/u, "bolt"],
  [/\b(?:loyer|maison|logement|appartement)\b/u, "house"],
  [/\b(?:cafe|the|petit dejeuner)\b/u, "coffee"],
  [
    /\b(?:dejeuner|diner|resto|restaurant|maquis|repas|garba|alloco)\b/u,
    "food",
  ],
  [/\b(?:livraison|emporter|fast food|pizza|burger)\b/u, "takeout"],
  [/\b(?:marche|supermarche|courses|boutique|epicerie|carrefour)\b/u, "cart"],
  [/\b(?:pharmacie|medicament)s?\b/u, "pills"],
  [/\b(?:medecin|docteur|hopital|clinique|sante)\b/u, "health"],
  [/\b(?:sport|salle|gym|foot)\b/u, "sport"],
  [/\b(?:cinema|film|netflix)\b/u, "movie"],
  [/\b(?:musique|spotify|concert)\b/u, "music"],
  [/\b(?:jeu|jeux|playstation|console)\b/u, "game"],
  [/\b(?:vetement|vetements|habits|pagne|chaussures|tailleur)\b/u, "clothes"],
  [/\b(?:coiffure|coiffeur|tresse|tresses|barbier|salon)\b/u, "beauty"],
  [/\b(?:ecole|scolarite|cours|formation|universite)\b/u, "school"],
  [/\b(?:livre|livres|fournitures)\b/u, "book"],
  [/\b(?:famille|maman|papa|parents|enfant|enfants|frere|soeur)\b/u, "family"],
  [/\b(?:don|aide|soutien|eglise|mosquee|quete|dime)\b/u, "heart"],
  [/\b(?:cadeau|anniversaire|mariage|bapteme)\b/u, "gift"],
  [/\b(?:chien|chat|animal|veterinaire)\b/u, "pet"],
  [/\b(?:reparation|garage|mecanicien|plombier|electricien)\b/u, "repair"],
  [/\b(?:banque|frais bancaires|agios)\b/u, "bank"],
  [/\b(?:tontine|epargne|placement|investissement)\b/u, "invest"],
  [/\b(?:salaire|paie|prime)\b/u, "cash"],
  [/\b(?:freelance|mission|client|facture client)\b/u, "work"],
];

const normalize = (value: string) =>
  value.normalize("NFD").replaceAll(/\p{M}/gu, "").toLowerCase();

/** Icon id that fits a transaction name (« Taxi » → car, « Wifi » → wifi), or `null` to keep the category icon. */
export const suggestIcon = (name: string): string | null => {
  const text = normalize(name);
  if (!text.trim()) {
    return null;
  }
  return rules.find(([pattern]) => pattern.test(text))?.[1] ?? null;
};
