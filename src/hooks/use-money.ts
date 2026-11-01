import type { AmountOf, Recorded } from "@/data/entries";
import { useExchange } from "@/data/exchange-rates";
import { useCurrencyCode } from "@/data/settings";
import { useI18n } from "@/i18n/context";
import type { Currency } from "@/lib/currency";

/** The currency on screen, and the way recorded amounts reach it. */
export interface Money extends Currency {
  /** A recorded amount in hundredths of this currency, at the exchange rates in use. */
  amountOf: AmountOf;
  /** "25 000 F CFA" when `recorded` is in another currency than this one, else `null`. */
  originalOf: (recorded: Recorded) => string | null;
}

/**
 * The currency chosen in Settings, writing amounts in the phone's language. Amounts recorded in
 * another currency are converted on the way in (`amountOf`), never rewritten.
 */
export const useMoney = (): Money => {
  const { currencies } = useI18n();
  const [code] = useCurrencyCode();
  const exchange = useExchange();
  const currency = currencies.find(code) ?? currencies.default;
  return {
    ...currency,
    amountOf: (recorded) =>
      exchange.convert(recorded.amountCents, recorded.currency, currency.code),
    originalOf: (recorded) =>
      recorded.currency === currency.code
        ? null
        : (currencies.find(recorded.currency)?.format(recorded.amountCents) ??
          null),
  };
};
