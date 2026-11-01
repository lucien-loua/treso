import { useEffect } from "react";
import { AppState } from "react-native";

import { CURRENCY_CODES, createExchange } from "@/lib/currency";
import type { Exchange, ExchangeRates } from "@/lib/currency";
import { toISODate } from "@/lib/datetime";

import { readStored, useStored, writeStored } from "./storage";

const RATES_KEY = "treso.exchangeRates";
const MANUAL_KEY = "treso.manualRates";
const MODE_KEY = "treso.ratesMode";

/**
 * Rates shipped with the app, used until the first download and when offline. The franc CFA is
 * pegged to the euro, so only the dollar and the Guinean franc really move.
 */
const BUNDLED: ExchangeRates = {
  base: "USD",
  date: "2026-11-01",
  rates: { GNF: 8848.18, USD: 1, XOF: 585.463 },
};

/**
 * Daily rates against the dollar, free and without a key, from two mirrors of the same data.
 * Only the rates are downloaded: nothing about the user is sent.
 */
const SOURCES = [
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
  "https://latest.currency-api.pages.dev/v1/currencies/usd.json",
];

/** A download is tried again only after this, even if the source still has yesterday's rates. */
const REFRESH_AFTER_MS = 6 * 60 * 60 * 1000;
const TIMEOUT_MS = 10_000;

interface StoredRates extends ExchangeRates {
  /** When they were downloaded, ms since epoch */
  fetchedAt: number;
}

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/u;

const isRate = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/** The offered currencies' valid rates in `quoted` (keys spelled by `keyOf`); some may be missing. */
const pickRates = (quoted: unknown, keyOf: (code: string) => string) => {
  const rates: Record<string, number> = {};
  if (!isRecord(quoted)) {
    return rates;
  }
  for (const code of CURRENCY_CODES) {
    const rate = quoted[keyOf(code)];
    if (isRate(rate)) {
      rates[code] = rate;
    }
  }
  return rates;
};

const isComplete = (rates: Record<string, number>) =>
  CURRENCY_CODES.every((code) => code in rates);

/** The rates in a source's answer (`{ date, usd: { xof: 585.46, … } }`). */
const ratesFrom = (body: unknown): ExchangeRates | null => {
  if (
    !isRecord(body) ||
    typeof body.date !== "string" ||
    !ISO_DAY.test(body.date)
  ) {
    return null;
  }
  const rates = pickRates(body.usd, (code) => code.toLowerCase());
  return isComplete(rates) ? { base: "USD", date: body.date, rates } : null;
};

const readStoredRates = (raw: string | null): StoredRates | null => {
  if (raw === null) {
    return null;
  }
  try {
    const stored: unknown = JSON.parse(raw);
    if (
      !isRecord(stored) ||
      typeof stored.date !== "string" ||
      !isRate(stored.fetchedAt)
    ) {
      return null;
    }
    const rates = pickRates(stored.rates, (code) => code);
    return isComplete(rates)
      ? { base: "USD", date: stored.date, fetchedAt: stored.fetchedAt, rates }
      : null;
  } catch {
    return null;
  }
};

const download = async (url: string) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response.ok ? ratesFrom(await response.json()) : null;
  } finally {
    clearTimeout(timer);
  }
};

/** Downloads today's rates unless recent ones are stored. Offline, the stored or bundled ones stay. */
const refreshRates = async () => {
  const stored = readStoredRates(readStored(RATES_KEY));
  if (stored && Date.now() - stored.fetchedAt < REFRESH_AFTER_MS) {
    return;
  }
  for (const url of SOURCES) {
    try {
      // The mirror is only worth trying when the first source failed
      // oxlint-disable-next-line no-await-in-loop
      const rates = await download(url);
      if (rates) {
        writeStored(
          RATES_KEY,
          JSON.stringify({ ...rates, fetchedAt: Date.now() })
        );
        return;
      }
    } catch {
      // Offline or source down: try the next one, else keep the rates we have
    }
  }
};

/** Keeps the rates fresh: on launch and each time the app comes back to the foreground. */
export const useRefreshExchangeRates = () => {
  useEffect(() => {
    refreshRates();
    const subscription = AppState.addEventListener("change", (next) => {
      if (next === "active") {
        refreshRates();
      }
    });
    return () => subscription.remove();
  }, []);
};

/** The user's own rates, per one dollar, merged over `suggested` for any currency they lack. */
const readManualRates = (
  raw: string | null,
  suggested: ExchangeRates
): ExchangeRates | null => {
  if (raw === null) {
    return null;
  }
  try {
    const stored: unknown = JSON.parse(raw);
    if (!isRecord(stored) || typeof stored.date !== "string") {
      return null;
    }
    return {
      base: "USD",
      date: stored.date,
      rates: {
        ...suggested.rates,
        ...pickRates(stored.rates, (code) => code),
      },
    };
  } catch {
    return null;
  }
};

/** The rates Settings shows and edits. */
export interface ExchangeRatesState {
  /** Whether the user's own rates are used instead of the suggested ones */
  manual: boolean;
  /** Downloaded daily (or shipped with the app until the first download) */
  suggested: ExchangeRates;
  /** The rates amounts are converted with: the user's when `manual`, else the suggested ones */
  active: ExchangeRates;
  /** Switches to the user's own rates (starting from the suggested ones) or back. */
  setManual: (manual: boolean) => void;
  /** Sets the user's rate of `code`: how many units one dollar buys. */
  setRate: (code: string, perDollar: number) => void;
}

export const useExchangeRates = (): ExchangeRatesState => {
  const suggested = readStoredRates(useStored(RATES_KEY)) ?? BUNDLED;
  const manualRates = readManualRates(useStored(MANUAL_KEY), suggested);
  const manual = useStored(MODE_KEY) === "manual" && manualRates !== null;
  return {
    active: manual && manualRates ? manualRates : suggested,
    manual,
    setManual(next) {
      if (next && manualRates === null) {
        writeStored(
          MANUAL_KEY,
          JSON.stringify({
            date: toISODate(new Date()),
            rates: suggested.rates,
          })
        );
      }
      writeStored(MODE_KEY, next ? "manual" : null);
    },
    setRate(code, perDollar) {
      const rates = { ...(manualRates ?? suggested).rates, [code]: perDollar };
      writeStored(
        MANUAL_KEY,
        JSON.stringify({ date: toISODate(new Date()), rates })
      );
    },
    suggested,
  };
};

/** One `Exchange` per set of rates, so screens get the same object until the rates change. */
const exchangeByKey = new Map<string, Exchange>();

/** Conversions at the rates in use: the user's own, else the latest downloaded, else the bundled ones. */
export const useExchange = (): Exchange => {
  const { active } = useExchangeRates();
  const key = JSON.stringify(active);
  let exchange = exchangeByKey.get(key);
  if (!exchange) {
    exchange = createExchange(active);
    exchangeByKey.clear();
    exchangeByKey.set(key, exchange);
  }
  return exchange;
};
