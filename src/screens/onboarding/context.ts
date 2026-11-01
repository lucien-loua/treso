import { createContext, use } from "react";

import type { Profile } from "@/data/profile";
import type { Budget } from "@/data/settings";

/** The answers so far: saved only at the end, so leaving halfway changes nothing. */
export interface OnboardingDraft {
  profile: Profile;
  /** "No regular income" picked: an explicit answer, unlike nothing picked yet */
  noIncome: boolean;
  currency: string;
  budget: Budget | null;
}

export interface Onboarding {
  /** `first`: first launch, nothing to go back to. `edit`: opened from Settings. */
  mode: "first" | "edit";
  /** Where the steps live for this mode */
  base: "/onboarding" | "/personalize";
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  /** Saves every answer and leaves: to the app on first launch, back to Settings otherwise. */
  finish: (budget: Budget | null) => void;
  /** First launch only: starts with Treso's usual setup, changeable later in Settings. */
  skip: () => void;
}

export const OnboardingContext = createContext<Onboarding | null>(null);

export const useOnboarding = (): Onboarding => {
  const onboarding = use(OnboardingContext);
  if (!onboarding) {
    throw new Error("useOnboarding must be used inside <OnboardingProvider>");
  }
  return onboarding;
};
