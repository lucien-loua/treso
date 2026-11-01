import { buildSampleTransactions } from "@/data/sample-data";
import { useTransactions } from "@/data/transactions-provider";
import { useMoney } from "@/hooks/use-money";
import { useI18n } from "@/i18n/context";
import { confirm } from "@/utils/alerts";
import { haptics } from "@/utils/haptics";

/** Asks, then adds three months of made-up transactions in the current currency and language. */
export const useLoadSampleData = () => {
  const { addMany } = useTransactions();
  const { t } = useI18n();
  const money = useMoney();

  return () =>
    confirm({
      cancelLabel: t.actions.cancel,
      confirmLabel: t.actions.add,
      failureTitle: t.errors.importFailed,
      message: t.samples.message,
      onConfirm: async () => {
        await addMany(buildSampleTransactions(money.code, t.samples.names));
        haptics.success();
      },
      title: t.samples.title,
    });
};
