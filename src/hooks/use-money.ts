import { useCurrencyCode } from "@/data/settings";
import { useI18n } from "@/i18n/context";
import type { Currency } from "@/lib/currency";

/** The currency chosen in Settings, writing amounts in the phone's language. */
export const useMoney = (): Currency => {
  const { currencies } = useI18n();
  const [code] = useCurrencyCode();
  return currencies.find(code) ?? currencies.default;
};
