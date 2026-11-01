import { buildSampleTransactions } from "@/data/sample-data";
import { useCurrency } from "@/data/settings";
import { useTransactions } from "@/data/transactions-provider";
import { confirm } from "@/utils/alerts";
import { haptics } from "@/utils/haptics";

/** Asks, then adds three months of made-up transactions in the current currency. */
export const useLoadSampleData = () => {
  const { addMany } = useTransactions();
  const [currency] = useCurrency();

  return () =>
    confirm({
      confirmLabel: "Ajouter",
      failureTitle: "Import impossible",
      message:
        "Trois mois d’opérations fictives seront ajoutés à vos données. Vous pourrez tout effacer dans Réglages.",
      onConfirm: async () => {
        await addMany(buildSampleTransactions(currency));
        haptics.success();
      },
      title: "Ajouter des exemples ?",
    });
};
