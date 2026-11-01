import { File, Paths } from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { Alert } from "react-native";

import { ownRatesBackup, restoreOwnRates } from "@/data/exchange-rates";
import { profileBackup, restoreProfile } from "@/data/profile-store";
import { restoreSettings, settingsBackup } from "@/data/settings";
import { useTransactions } from "@/data/transactions-provider";
import { createBackup, readBackup } from "@/data/transfer/backup";
import type { Backup } from "@/data/transfer/backup";
import { transactionsCsv } from "@/data/transfer/csv";
import { useI18n } from "@/i18n/context";
import { toISODate } from "@/lib/datetime";
import { confirm, runOrAlert } from "@/utils/alerts";
import { haptics } from "@/utils/haptics";

const JSON_FILE = {
  UTI: "public.json",
  extension: "json",
  mimeType: "application/json",
};
const CSV_FILE = {
  UTI: "public.comma-separated-values-text",
  extension: "csv",
  mimeType: "text/csv",
};

/** A backup may come through a messaging app or a drive, which don't always keep its type. */
const BACKUP_TYPES = [
  "application/json",
  "text/plain",
  "application/octet-stream",
];

/** Today as `YYYY-MM-DD`, for file names that sort by date. */
const today = () => toISODate(new Date());

/** Writes `content` to a file in the cache and opens the share sheet (Files, Drive, WhatsApp, mail…). */
const shareFile = async (
  name: string,
  content: string,
  { UTI, extension, mimeType }: typeof JSON_FILE,
  dialogTitle: string
) => {
  const file = new File(Paths.cache, `${name}.${extension}`);
  file.create({ overwrite: true });
  await file.write(content);
  await shareAsync(file.uri, { UTI, dialogTitle, mimeType });
};

/** Export a full backup or a spreadsheet, and import a backup in place of the current data. */
export const useDataTransfer = () => {
  const { readAll, replaceAll } = useTransactions();
  const { t, currencies, dates } = useI18n();

  const exportBackup = () =>
    runOrAlert(async () => {
      const backup = createBackup(await readAll(), {
        ...settingsBackup(),
        profile: profileBackup(),
        rates: ownRatesBackup(),
      });
      await shareFile(
        t.transfer.fileNames.backup(today()),
        JSON.stringify(backup, null, 2),
        JSON_FILE,
        t.transfer.exportBackup
      );
    }, t.errors.exportFailed);

  const exportCsv = () =>
    runOrAlert(async () => {
      const { transactions } = await readAll();
      await shareFile(
        t.transfer.fileNames.csv(today()),
        transactionsCsv(transactions, { currencies, t }),
        CSV_FILE,
        t.transfer.exportCsv
      );
    }, t.errors.exportFailed);

  const restore = async (backup: Backup) => {
    await replaceAll(backup);
    restoreSettings(backup.settings);
    restoreOwnRates(backup.settings.rates);
    restoreProfile(backup.settings.profile);
    haptics.success();
    Alert.alert(
      t.transfer.imported,
      t.transfer.importedMessage(
        backup.transactions.length,
        backup.schedules.length
      )
    );
  };

  const importBackup = () =>
    runOrAlert(async () => {
      const picked = await File.pickFileAsync({ mimeTypes: BACKUP_TYPES });
      if (picked.canceled) {
        return;
      }
      const read = readBackup(await picked.result.text());
      if ("problem" in read) {
        Alert.alert(
          t.transfer.invalidFile,
          read.problem === "newer"
            ? t.transfer.newerFile
            : t.transfer.invalidFileHint
        );
        return;
      }
      const { backup } = read;
      const current = await readAll();
      // Nothing to lose on this phone: no need to ask
      if (current.transactions.length === 0 && current.schedules.length === 0) {
        await restore(backup);
        return;
      }
      haptics.warning();
      confirm({
        cancelLabel: t.actions.cancel,
        confirmLabel: t.transfer.replace,
        destructive: true,
        failureTitle: t.errors.importFailed,
        message: t.transfer.replaceMessage(
          dates.longDate(new Date(backup.exportedAt)),
          t.dataCounts(backup.transactions.length, backup.schedules.length),
          t.dataCounts(current.transactions.length, current.schedules.length)
        ),
        onConfirm: () => restore(backup),
        title: t.transfer.replaceTitle,
      });
    }, t.errors.importFailed);

  return { exportBackup, exportCsv, importBackup };
};
