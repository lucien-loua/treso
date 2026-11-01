import type { CategoryId } from "@/data/catalog/categories";
import type { IconKeywords } from "@/data/catalog/icon-suggestions";
import type { IconId } from "@/data/catalog/icons";
import type { CategoryColor } from "@/theme";

/** French counts 0 and 1 in the singular. */
const plural = (count: number, one: string, many: string) =>
  `${count} ${count < 2 ? one : many}`;

/** « 32 opérations et 3 échéances » */
const dataCounts = (transactions: number, schedules: number) =>
  `${plural(transactions, "opération", "opérations")} et ${plural(schedules, "échéance", "échéances")}`;

const categories: Record<CategoryId, string> = {
  bills: "Factures",
  education: "Éducation",
  freelance: "Freelance",
  gifts: "Cadeaux",
  groceries: "Courses",
  health: "Santé",
  help: "Aide",
  housing: "Logement",
  investments: "Placements",
  leisure: "Loisirs",
  "other-expense": "Autre",
  "other-income": "Autre revenu",
  restaurants: "Restaurants",
  salary: "Salaire",
  shopping: "Shopping",
  subscriptions: "Abonnements",
  transport: "Transport",
};

const icons: Record<IconId, string> = {
  bag: "Sac",
  bank: "Banque",
  beauty: "Coiffure",
  bolt: "Électricité",
  book: "Livre",
  bus: "Bus",
  car: "Voiture",
  card: "Carte",
  cart: "Panier",
  cash: "Espèces",
  clothes: "Vêtements",
  coffee: "Café",
  family: "Famille",
  food: "Repas",
  fuel: "Carburant",
  game: "Jeux",
  gift: "Cadeau",
  health: "Santé",
  heart: "Cœur",
  house: "Maison",
  invest: "Placement",
  movie: "Cinéma",
  music: "Musique",
  people: "Personnes",
  pet: "Animal",
  phone: "Téléphone",
  pills: "Médicaments",
  plane: "Avion",
  repair: "Réparation",
  school: "École",
  sparkles: "Divers",
  sport: "Sport",
  star: "Étoile",
  takeout: "À emporter",
  water: "Eau",
  wifi: "Internet",
  work: "Travail",
};

const iconKeywords: IconKeywords = {
  bank: ["banque", "frais bancaires", "agios"],
  beauty: ["coiffure", "coiffeur", "tresse", "barbier", "salon"],
  bolt: ["électricité", "courant", "lumière", "compteur"],
  book: ["livre", "fournitures"],
  bus: ["bus", "car", "métro", "train", "transport"],
  car: ["voiture", "parking", "péage"],
  cart: ["marché", "supermarché", "courses", "boutique", "épicerie"],
  cash: ["salaire", "paie", "prime"],
  clothes: ["vêtement", "habits", "pagne", "chaussures", "tailleur"],
  coffee: ["café", "thé", "petit déjeuner"],
  family: [
    "famille",
    "maman",
    "papa",
    "parents",
    "enfant",
    "frère",
    "soeur",
    "sœur",
  ],
  food: ["déjeuner", "dîner", "resto", "restaurant", "repas"],
  fuel: ["essence", "carburant", "plein", "gasoil", "station"],
  game: ["jeu", "jeux", "console"],
  gift: ["cadeau", "anniversaire", "mariage", "baptême"],
  health: ["médecin", "docteur", "hôpital", "clinique", "santé"],
  heart: ["don", "aide", "soutien", "église", "mosquée", "quête", "dîme"],
  house: ["loyer", "maison", "logement", "appartement"],
  invest: ["épargne", "placement", "investissement"],
  movie: ["cinéma", "film"],
  music: ["musique", "concert"],
  pet: ["chien", "chat", "animal", "vétérinaire"],
  phone: ["crédit", "forfait", "téléphone", "recharge", "unités"],
  pills: ["pharmacie", "médicament"],
  plane: ["avion", "vol", "billet", "voyage"],
  repair: ["réparation", "garage", "mécanicien", "plombier", "électricien"],
  school: ["école", "scolarité", "cours", "formation", "université"],
  sport: ["sport", "salle", "gym", "foot"],
  takeout: ["livraison", "emporter", "fast food", "pizza", "burger"],
  water: ["eau"],
  wifi: ["fibre", "box"],
  work: ["freelance", "mission", "client", "facture client"],
};

const colors: Record<CategoryColor, string> = {
  blue: "Bleu",
  brown: "Marron",
  cyan: "Cyan",
  gray: "Gris",
  green: "Vert",
  indigo: "Indigo",
  mint: "Menthe",
  orange: "Orange",
  pink: "Rose",
  purple: "Violet",
  red: "Rouge",
  teal: "Bleu canard",
  yellow: "Jaune",
};

/** Names in the currency picker, by ISO code; a code missing here is shown as is. */
const currencies: Readonly<Record<string, string | undefined>> = {
  GNF: "Franc guinéen",
  USD: "Dollar US",
  XOF: "Franc CFA",
};

/**
 * Treso's texts in French, the reference language: every other language has exactly these keys
 * (`Messages`). Texts with values are functions; amounts and dates arrive already formatted.
 */
export const fr = {
  actions: {
    add: "Ajouter",
    cancel: "Annuler",
    close: "Fermer",
    confirm: "Confirmer",
    delete: "Supprimer",
    hide: "Masquer",
    ok: "OK",
    retry: "Réessayer",
    save: "Enregistrer",
    seeAll: "Tout voir",
    seeLess: "Réduire",
    skip: "Ignorer",
  },
  addTransaction: "Ajouter une opération",
  categories,
  colors,
  currencies,
  dataCounts,
  /** « 1er », « 2 », … « 31 » */
  dayOfMonth: (day: number) => (day === 1 ? "1er" : String(day)),
  errors: {
    actionFailed: "Action impossible",
    deleteFailed: "Suppression impossible",
    duplicateFailed: "Impossible de dupliquer",
    exportFailed: "Export impossible",
    importFailed: "Import impossible",
    loadFailed: "Impossible de charger vos données",
    saveFailed: "Enregistrement impossible",
  },
  form: {
    amountIn: (symbol: string) => `Montant en ${symbol}`,
    appearance: "Changer l’icône et la couleur",
    autoIcon: "Automatique, selon le nom",
    category: "Catégorie",
    categoryColor: (color: string) => `${color} (couleur de la catégorie)`,
    categoryValue: (name: string) => `Catégorie : ${name}`,
    color: "Couleur",
    converted: (amount: string) => `Soit environ ${amount} au taux du jour`,
    date: "Date",
    deleteConfirm: (label: string) => `${label} ?`,
    expectedAround: "Attendu vers le",
    expense: "Dépense",
    icon: "Icône",
    income: "Revenu",
    irreversible: "Cette action est définitive.",
    kind: "Dépense ou revenu",
    name: "Nom",
    nextDue: "Prochaine échéance",
    nextIncome: "Prochain versement",
    payBefore: "À payer avant le",
    usualAmount: "Montant habituel, ajustable au moment de payer.",
  },
  iconKeywords,
  icons,
  onboarding: {
    budget: {
      subtitle:
        "Treso vous dira ce qu’il vous reste à dépenser. Laissez vide si vous n’en voulez pas.",
      title: "Un budget pour le mois ?",
    },
    continue: "Continuer",
    currency: "Votre devise",
    daily: {
      subtitle: "Elles apparaîtront en raccourci, à noter d’un geste.",
      title: "Vos dépenses du quotidien",
    },
    finish: "C’est parti",
    fixed: {
      subtitle: "Treso vous les rappellera chaque mois.",
      title: "Vos dépenses de chaque mois",
    },
    income: {
      none: "Pas de revenu régulier",
      subtitle: "Choisissez tout ce qui s’applique.",
      title: "D’où vient votre argent ?",
    },
    skip: "Passer",
    welcome: {
      subtitle:
        "Quelques questions pour adapter Treso à votre vie. Moins d’une minute.",
      title: "Bienvenue sur Treso",
    },
  },
  overview: {
    balanceAtEnd: (month: string) => `Solde fin ${month}`,
    budget: {
      left: (amount: string) => `Reste ${amount}`,
      over: (amount: string) => `Dépassé de ${amount}`,
      perDay: (amount: string, days: number) =>
        `${amount} par jour sur ${days} j`,
      spentOf: (spent: string, budget: string) =>
        `${spent} dépensés sur ${budget}`,
      title: "Budget",
      used: (percent: string) => `${percent} utilisé`,
    },
    byCategory: {
      none: "Aucune dépense ce mois-ci.",
      title: "Dépenses par catégorie",
    },
    currentBalance: "Solde actuel",
    expenses: "Dépenses",
    forecast: (month: string) => `Prévu fin ${month}`,
    getStarted: {
      title: "Bien démarrer",
    },
    income: "Revenus",
    month: {
      backToCurrent: "Revient au mois en cours",
      next: "Mois suivant",
      previous: "Mois précédent",
    },
    quickAdd: {
      add: (name: string) => `Ajouter : ${name}`,
      title: "Ajout rapide",
      today: (amount: string) => `Aujourd’hui : ${amount}`,
    },
    thisMonth: (amount: string) => `Ce mois : ${amount}`,
    upcoming: {
      action: (action: string, name: string) => `${action} : ${name}`,
      markPaid: "Marquer comme payé",
      markReceived: "Marquer comme reçu",
      none: "Aucune échéance. Ajoutez votre salaire, votre loyer ou une facture : Treso vous les rappellera.",
      openHint: "Ouvre l’échéance pour la modifier",
      pay: "Payer",
      received: "Reçu",
      skip: "Ignorer ce mois-ci",
      skipMessage: (date: string) =>
        `Rien ne sera enregistré. Prochaine échéance : ${date}.`,
      skipTitle: (name: string) => `Ignorer « ${name} » ce mois-ci ?`,
      title: "À venir",
    },
  },
  profile: {
    daily: {
      airtime: { label: "Crédit téléphone", name: "Crédit téléphone" },
      food: { label: "Repas dehors", name: "Repas" },
      fuel: { label: "Carburant", name: "Carburant" },
      groceries: { label: "Courses, marché", name: "" },
      transport: { label: "Transport", name: "" },
    },
    dailyStep: {
      hint: "Notée en quelques secondes avec l’ajout rapide.",
      title: "Une dépense du jour",
    },
    fixed: {
      electricity: { label: "Électricité", name: "Électricité" },
      family: { label: "Aide à la famille", name: "Aide à la famille" },
      internet: { label: "Internet", name: "Internet" },
      phone: { label: "Forfait téléphone", name: "Forfait téléphone" },
      rent: { label: "Loyer", name: "Loyer" },
      school: { label: "Scolarité", name: "Scolarité" },
      tontine: { label: "Tontine, épargne", name: "Tontine" },
      water: { label: "Eau", name: "Eau" },
    },
    fixedHint: (day: string) =>
      `Avant le ${day} du mois, par exemple. Treso vous la rappelle.`,
    income: {
      business: { label: "Commerce ou freelance", name: "" },
      family: { label: "Aide de la famille", name: "Aide de la famille" },
      salary: { label: "Salaire", name: "Salaire" },
    },
    incomeHint: {
      schedule: (day: string) =>
        `Vers le ${day} du mois, par exemple. Treso vous le rappelle.`,
      transaction: "Notez-le quand l’argent arrive.",
    },
  },
  reminders: {
    channel: "Rappels",
    dueTomorrow: "À payer demain",
  },
  schedules: {
    dueBy: (date: string, inDays: string) => `Avant le ${date} · ${inDays}`,
    dueToday: "À payer aujourd’hui",
    expected: (date: string, inDays: string) =>
      `Attendu vers le ${date} · ${inDays}`,
    expectedSince: (date: string) => `Attendu depuis le ${date}`,
    expectedToday: "Attendu aujourd’hui",
    late: (date: string) => `En retard · échéance le ${date}`,
    paid: (date: string, nextDate: string) =>
      `Payé le ${date} · prochain avant le ${nextDate}`,
    received: (date: string, nextDate: string) =>
      `Reçu le ${date} · prochain vers le ${nextDate}`,
  },
  settings: {
    about: "À propos",
    amount: "Montant",
    budget: "Budget mensuel",
    budgetFooter: "Suivi sur l’Aperçu. Laissez vide pour ne pas en avoir.",
    budgetIn: (symbol: string) => `Budget mensuel en ${symbol}`,
    currency: "Devise",
    currencyFooter:
      "Les montants saisis dans une autre devise sont convertis, jamais modifiés.",
    data: "Données",
    eraseAll: "Effacer toutes les données",
    eraseConfirm: "Tout effacer",
    eraseMessage: (transactions: number, schedules: number) =>
      `${dataCounts(transactions, schedules)} seront supprimées définitivement de cet appareil.`,
    eraseTitle: "Effacer toutes les données ?",
    invalidAmount: "Montant invalide",
    invalidAmountHint: "Saisissez un nombre positif, par exemple 150000.",
    none: "Aucun",
    personalize: "Personnaliser Treso",
    personalizeHint: "Revenus, dépenses fixes et du quotidien",
    preferences: "Préférences",
    privacy:
      "Treso garde vos données sur cet appareil : pas de compte, pas de serveur.",
    rates: {
      invalid: "Taux invalide",
      invalidHint: "Saisissez un nombre positif, par exemple 600.",
      manualFooter: (date: string) => `Vos taux, modifiés le ${date}.`,
      own: "Vos propres taux",
      per: (amount: string) => `${amount} =`,
      rateOf: (currency: string, amount: string) =>
        `Taux du ${currency} pour ${amount}`,
      suggested: (date: string) => `Taux proposés du ${date}`,
      suggestedFooter: (date: string) =>
        `Taux du ${date}, mis à jour chaque jour quand le téléphone est en ligne.`,
      title: "Taux de change",
      useSuggested: "Utiliser les taux proposés",
    },
    reminders: {
      footer:
        "Vers 9 h : la veille d’un paiement, le jour même d’un revenu attendu. Sans montant, car la notification s’affiche sur l’écran verrouillé.",
      title: "Rappels",
      toggle: "Notifications",
    },
    version: "Version",
  },
  sheets: {
    deleteSchedule: "Supprimer l’échéance",
    deleteScheduleMessage:
      "Elle ne sera plus rappelée. Les paiements déjà enregistrés sont conservés.",
    deleteTransaction: "Supprimer l’opération",
    edit: "Modifier",
    incomeReceived: "Revenu reçu",
    newSchedule: "Nouvelle échéance",
    newTransaction: "Nouvelle opération",
    payment: "Paiement",
    schedule: "Échéance",
    scheduleFooter: "Rappelée chaque mois dans « À venir ».",
    scheduleMissing: "Échéance introuvable",
    scheduledPayment:
      "Paiement d’une échéance mensuelle. Le supprimer remet l’échéance à payer.",
    settleFooter:
      "Ajustez si besoin : l’échéance passera ensuite au mois suivant.",
    settleIntro: {
      expense: (name: string, date: string) => `${name} · échéance le ${date}`,
      income: (name: string, date: string) =>
        `${name} · attendu vers le ${date}`,
    },
    transaction: "Opération",
    transactionMissing: "Opération introuvable",
    transactionMissingHint: "Elle a peut-être été supprimée.",
  },
  tabs: {
    overview: "Aperçu",
    settings: "Réglages",
    transactions: "Opérations",
  },
  transactions: {
    deleteTitle: "Supprimer cette opération ?",
    duplicate: "Dupliquer aujourd’hui",
    empty: "Aucune opération",
    emptyHint: "Vos dépenses et revenus apparaîtront ici, regroupés par jour.",
    filter: "Filtrer par type",
    filters: { all: "Tout", expense: "Dépenses", income: "Revenus" },
    noResults: "Aucun résultat",
    noResultsForQuery: (query: string) => `Rien ne correspond à « ${query} ».`,
    noResultsForType: "Aucune opération de ce type.",
    openHint: "Ouvre l’opération pour la modifier",
    scheduled: "Échéance",
    search: "Rechercher une opération",
  },
  transfer: {
    columns: {
      amount: "Montant",
      category: "Catégorie",
      currency: "Devise",
      date: "Date",
      name: "Nom",
      type: "Type",
    },
    exportBackup: "Exporter une sauvegarde",
    exportCsv: "Exporter en tableur (CSV)",
    fileNames: {
      backup: (date: string) => `treso-sauvegarde-${date}`,
      csv: (date: string) => `treso-operations-${date}`,
    },
    footer:
      "Une sauvegarde se réimporte sur ce téléphone ou un autre. Toute personne qui ouvre le fichier peut le lire : gardez-le en lieu sûr.",
    importBackup: "Importer une sauvegarde",
    imported: "Sauvegarde importée",
    importedMessage: (transactions: number, schedules: number) =>
      `${dataCounts(transactions, schedules)} restaurées.`,
    invalidFile: "Fichier non reconnu",
    invalidFileHint:
      "Choisissez une sauvegarde exportée depuis Treso (fichier .json).",
    newerFile:
      "Cette sauvegarde vient d’une version plus récente de Treso. Mettez l’app à jour pour l’importer.",
    replace: "Remplacer",
    replaceMessage: (date: string, backup: string, current: string) =>
      `La sauvegarde du ${date} contient ${backup}. Elle remplacera les données de ce téléphone (${current}), ainsi que la devise, le budget et les taux.`,
    replaceTitle: "Remplacer vos données ?",
  },
};

/** The shape every language follows. */
export type Messages = typeof fr;
