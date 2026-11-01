import type { CategoryId } from "@/data/catalog/categories";
import type { IconKeywords } from "@/data/catalog/icon-suggestions";
import type { IconId } from "@/data/catalog/icons";
import type { CategoryColor } from "@/theme";

/** French counts 0 and 1 in the singular. */
const plural = (count: number, one: string, many: string) =>
  `${count} ${count < 2 ? one : many}`;

const VOWEL = /^[aeiouyàâéèêîôû]/iu;

/** « de novembre », « d’octobre » */
const de = (word: string) => (VOWEL.test(word) ? `d’${word}` : `de ${word}`);

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
    skip: "Ignorer",
  },
  addTransaction: "Ajouter une opération",
  categories,
  colors,
  currencies,
  /** « 1er », « 2 », … « 31 » */
  dayOfMonth: (day: number) => (day === 1 ? "1er" : String(day)),
  errors: {
    actionFailed: "Action impossible",
    deleteFailed: "Suppression impossible",
    duplicateFailed: "Impossible de dupliquer",
    importFailed: "Import impossible",
    loadFailed: "Impossible de charger vos données",
    saveFailed: "Enregistrement impossible",
  },
  form: {
    amountIn: (symbol: string) => `Montant en ${symbol}`,
    appearance: "Changer l’icône et la couleur",
    appearanceHint:
      "Par défaut, la couleur suit la catégorie et la première icône s’adapte au nom.",
    autoIcon: "Automatique, selon le nom",
    category: "Catégorie",
    categoryColor: (color: string) => `${color} (couleur de la catégorie)`,
    color: "Couleur",
    converted: (amount: string) => `Soit environ ${amount} au taux du jour`,
    date: "Date",
    deleteConfirm: (label: string) => `${label} ?`,
    details: "Détails",
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
    usualAmount:
      "Montant habituel : vous pourrez l’ajuster au moment de payer.",
  },
  iconKeywords,
  icons,
  overview: {
    balanceAtEnd: (month: string) => `Solde fin ${month}`,
    budget: {
      left: (amount: string) => `Reste ${amount}`,
      over: (amount: string) => `Dépassé de ${amount}`,
      perDay: (amount: string, days: number) =>
        `${amount} par jour sur ${days} j`,
      setUp: "Définir un budget mensuel",
      setUpHint: "Suivez ce qu’il vous reste à dépenser chaque mois.",
      spentOf: (spent: string, budget: string) =>
        `${spent} dépensés sur ${budget}`,
      title: "Budget",
      used: (percent: string) => `${percent} utilisé`,
    },
    byCategory: {
      none: "Aucune dépense ce mois-ci.",
      title: "Dépenses par catégorie",
    },
    carriedOver: (month: string, amount: string) =>
      `Report ${de(month)} : ${amount}`,
    currentBalance: "Solde actuel",
    expenses: "Dépenses",
    forecast: (month: string) => `Prévu fin ${month}`,
    forecastHint: "Après les échéances à venir",
    getStarted: {
      bills: {
        defaultName: "Électricité",
        hint: "Eau, électricité, wifi… une échéance par facture.",
        title: "Vos factures",
      },
      daily: {
        hint: "Transport, repas… notée en quelques secondes.",
        title: "Une dépense du jour",
      },
      footer: "Vous pourrez tout modifier ensuite : montants, jours, noms.",
      rent: {
        defaultName: "Loyer",
        hint: "À payer avant le 5, en avance ou le jour même.",
        title: "Votre loyer",
      },
      salary: {
        defaultName: "Salaire",
        hint: "Vers le 26 du mois, par exemple. Treso vous le rappelle.",
        title: "Votre salaire",
      },
      title: "Bien démarrer",
    },
    income: "Revenus",
    month: {
      backToCurrent: "Revient au mois en cours",
      next: "Mois suivant",
      previous: "Mois précédent",
    },
    monthTransactions: {
      none: (month: string) => `Aucune opération en ${month}.`,
      title: "Opérations du mois",
    },
    quickAdd: {
      add: (name: string) => `Ajouter : ${name}`,
      other: "Autre",
      title: "Ajout rapide",
      today: (amount: string) => `Aujourd’hui : ${amount}`,
    },
    thisMonth: (amount: string) => `Ce mois : ${amount}`,
    upcoming: {
      action: (action: string, name: string) => `${action} : ${name}`,
      footer:
        "Touchez « Payer » ou « Reçu » quand c’est fait. Touchez la ligne pour changer la date ou le montant, appui long pour ignorer un mois.",
      markPaid: "Marquer comme payé",
      markReceived: "Marquer comme reçu",
      openHint: "Ouvre l’échéance pour la modifier",
      pay: "Payer",
      received: "Reçu",
      skip: "Ignorer ce mois-ci",
      skipMessage: (date: string) =>
        `Rien ne sera enregistré. Prochaine échéance : ${date}.`,
      skipTitle: (name: string) => `Ignorer « ${name} » ce mois-ci ?`,
      title: "À venir",
    },
    welcome: {
      subtitle:
        "Suivez votre argent mois par mois : ce qui rentre, ce qui sort, et ce qu’il vous reste.",
      title: "Bienvenue sur Treso",
      trySamples: "Essayer avec des exemples",
    },
  },
  samples: {
    message:
      "Trois mois d’opérations fictives seront ajoutés à vos données. Vous pourrez tout effacer dans Réglages.",
    names: {
      cinema: "Cinéma",
      dinner: "Dîner entre amis",
      electricity: "Électricité",
      freelance: "Mission design",
      internet: "Internet",
      lunch: "Déjeuner",
      market: "Marché",
      music: "Musique",
      pharmacy: "Pharmacie",
      rent: "Loyer",
      salary: "Salaire",
      shoes: "Chaussures",
      supermarket: "Supermarché",
      transportPass: "Pass transport",
    },
    title: "Ajouter des exemples ?",
  },
  schedules: {
    dueBy: (date: string, inDays: string) => `Avant le ${date} · ${inDays}`,
    dueToday: "À payer aujourd’hui",
    eachMonth: {
      expense: (day: string) => `Avant le ${day} de chaque mois`,
      income: (day: string) => `Vers le ${day} de chaque mois`,
    },
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
    addSamples: "Ajouter des données d’exemple",
    addSchedule: "Ajouter une échéance",
    amount: "Montant",
    budget: "Budget mensuel",
    budgetFooter:
      "Plafond de dépenses suivi sur l’écran Aperçu. Laissez vide pour le désactiver.",
    budgetIn: (symbol: string) => `Budget mensuel en ${symbol}`,
    currency: "Devise",
    currencyFooter:
      "Chaque montant garde la devise dans laquelle il a été saisi et s’affiche converti dans celle-ci : changer de devise ne modifie aucune donnée.",
    data: "Données",
    eraseAll: "Effacer toutes les données",
    eraseConfirm: "Tout effacer",
    eraseMessage: (transactions: number, schedules: number) =>
      `${plural(transactions, "opération", "opérations")} et ${plural(schedules, "échéance", "échéances")} seront supprimées définitivement de cet appareil.`,
    eraseTitle: "Effacer toutes les données ?",
    invalidAmount: "Montant invalide",
    invalidAmountHint: "Saisissez un nombre positif, par exemple 150000.",
    none: "Aucun",
    preferences: "Préférences",
    privacy:
      "Treso garde vos données sur cet appareil : pas de compte, pas de serveur.",
    rates: {
      invalid: "Taux invalide",
      invalidHint: "Saisissez un nombre positif, par exemple 600.",
      manualFooter: (date: string) =>
        `Vos propres taux, modifiés le ${date}, servent à toutes les conversions. Réactivez les taux proposés pour revenir aux taux du jour.`,
      per: (amount: string) => `${amount} =`,
      rateOf: (currency: string, amount: string) =>
        `Taux du ${currency} pour ${amount}`,
      suggestedFooter: (date: string) =>
        `Taux du ${date}, mis à jour chaque jour depuis une source gratuite quand le téléphone est en ligne. Désactivez pour saisir vos propres taux.`,
      title: "Taux de change",
      useSuggested: "Utiliser les taux proposés",
    },
    recorded: "Opérations enregistrées",
    schedules: "Échéances mensuelles",
    schedulesFooter:
      "Salaire, loyer, factures… Treso vous les rappelle chaque mois sur l’Aperçu, et vous confirmez quand c’est payé ou reçu.",
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
    scheduleFooter:
      "Treso vous la rappelle chaque mois dans « À venir ». Quand c’est payé (ou reçu), touchez le bouton : le montant et la date peuvent varier.",
    scheduleMissing: "Échéance introuvable",
    scheduledPayment:
      "Paiement d’une échéance mensuelle. Le supprimer remet l’échéance à payer.",
    settleFooter:
      "Ajustez le montant ou la date s’ils diffèrent de d’habitude. L’échéance passera ensuite au mois suivant.",
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
};

/** The shape every language follows. */
export type Messages = typeof fr;
