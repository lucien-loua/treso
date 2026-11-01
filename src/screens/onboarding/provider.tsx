import { useLocales } from "expo-localization";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { DEFAULT_PROFILE } from "@/data/profile";
import type { Profile } from "@/data/profile";
import { useProfile } from "@/data/profile-store";
import {
  useCurrencyCode,
  useGetStartedHidden,
  useMonthlyBudget,
} from "@/data/settings";
import { CURRENCY_CODES } from "@/lib/currency";

import { OnboardingContext } from "./context";
import type { OnboardingDraft } from "./context";

const EMPTY_PROFILE: Profile = { daily: [], fixed: [], income: [] };

/** Holds the answers across the steps, then saves them all at once. */
export const OnboardingProvider = ({
  mode,
  children,
}: {
  mode: "first" | "edit";
  children: ReactNode;
}) => {
  const [saved, setProfile] = useProfile();
  const [currency, setCurrency] = useCurrencyCode();
  const [budget, setBudget] = useMonthlyBudget();
  const [, setGetStartedHidden] = useGetStartedHidden();
  const [locale] = useLocales();
  const hasProfile = saved !== null;
  const [draft, setDraft] = useState<OnboardingDraft>(() =>
    saved
      ? {
          budget,
          currency,
          noIncome: saved.income.length === 0,
          profile: saved,
        }
      : {
          budget: null,
          // The phone's region knows the local currency: fr-CI → XOF, fr-GN → GNF
          currency:
            locale.currencyCode && CURRENCY_CODES.includes(locale.currencyCode)
              ? locale.currencyCode
              : currency,
          noIncome: false,
          profile: EMPTY_PROFILE,
        }
  );

  // First launch: once the profile exists, the app's routes are open; leave the questions for them.
  useEffect(() => {
    if (mode === "first" && hasProfile) {
      router.replace("/");
    }
  }, [mode, hasProfile]);

  const save = (profile: Profile) => {
    setCurrency(draft.currency);
    // New answers may bring new things to set up: show the checklist again
    setGetStartedHidden(false);
    setProfile(profile);
  };

  return (
    <OnboardingContext
      value={{
        base: mode === "first" ? "/onboarding" : "/personalize",
        draft,
        finish(nextBudget) {
          setBudget(nextBudget);
          save(draft.profile);
          if (mode === "edit") {
            router.dismissTo("/settings");
          }
        },
        mode,
        skip: () => save(DEFAULT_PROFILE),
        update: (patch) => setDraft((previous) => ({ ...previous, ...patch })),
      }}
    >
      {children}
    </OnboardingContext>
  );
};
